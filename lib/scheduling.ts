import { z } from "zod";
import type { DB } from "./db";
import { bookingSchema } from "./validation";
import type { Appointment, BookingSettings, Service, Slot } from "./types";

export type Actor = {
  id: string;
  name: string;
  email: string;
  staff: boolean;
  blocked: boolean;
};
function error(message: string): never {
  throw new Error(message);
}
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (s) =>
      !isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s,
  );
export async function settings(db: DB) {
  return (
    await db.query<BookingSettings>(
      "select * from booking_settings where id=true",
    )
  ).rows[0];
}
export async function slots(
  db: DB,
  serviceId: string,
  date: string,
  staff = false,
  excludeId: string | null = null,
) {
  z.uuid().parse(serviceId);
  dateSchema.parse(date);
  const result = await db.query<Slot>(
    `select to_char(t.slot at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS"Z"') start_at, n.id technician_id,n.name technician_name
  from services s join technician_services ts on ts.service_id=s.id
  join technicians n on n.id=ts.technician_id join working_hours h on h.technician_id=n.id
  cross join booking_settings cfg
  cross join lateral generate_series(($2::date+h.opens) at time zone 'America/New_York',
    ($2::date+h.closes) at time zone 'America/New_York' - make_interval(mins=>s.duration_minutes+s.buffer_minutes), interval '15 minutes') t(slot)
  where s.id=$1 and s.active and n.active and h.weekday=extract(dow from $2::date)
  and ($3::boolean or (cfg.online_booking_enabled and cfg.capacity_confirmed))
  and t.slot >= now()+make_interval(hours=>case when $3::boolean then 0 else cfg.lead_hours end)
  and t.slot <= now()+make_interval(days=>case when $3::boolean then 365 else cfg.horizon_days end)
  and not exists(select 1 from reservations r where r.technician_id=n.id
    and ($4::uuid is null or r.appointment_id is distinct from $4::uuid)
    and tstzrange(r.start_at,r.end_at,'[)') && tstzrange(t.slot,t.slot+make_interval(mins=>s.duration_minutes+s.buffer_minutes),'[)'))
  order by t.slot,n.name`,
    [serviceId, date, staff, excludeId],
  );
  return result.rows;
}
async function audit(db: DB, actor: Actor, action: string, id: string) {
  await db.query(
    "insert into audit_log(actor_id,action,entity_id) values($1,$2,$3)",
    [actor.id, action, id],
  );
}
async function notify(db: DB, row: Appointment, kind: string) {
  await db.query(
    "update notification_jobs set status='obsolete' where appointment_id=$1 and status='pending'",
    [row.id],
  );
  if (!row.customer_email) return;
  await db.query(
    "insert into notification_jobs(appointment_id,revision,kind) values($1,$2,$3)",
    [row.id, row.revision, kind],
  );
  if (kind !== "cancellation")
    await db.query(
      `insert into notification_jobs(appointment_id,revision,kind,due_at)
    select $1,$2,'reminder',start_at-interval '24 hours' from appointments where id=$1 and start_at-interval '24 hours'>now()`,
      [row.id, row.revision],
    );
}
export async function ownAppointment(
  db: DB,
  who: Actor,
  id: string,
  lock = false,
) {
  z.uuid().parse(id);
  const row = (
    await db.query<Appointment>(
      `select * from appointments where id=$1 ${lock ? "for update" : ""}`,
      [id],
    )
  ).rows[0];
  if (!row || (!who.staff && row.customer_id !== who.id))
    error("Appointment unavailable.");
  return row;
}
const changeSchema = bookingSchema.extend({
  id: z.uuid().optional(),
  revision: z.number().int().positive().optional(),
  email: z.union([z.email().max(254), z.literal("")]).optional(),
  notes: z.string().max(1000).optional(),
});
export async function saveAppointment(db: DB, who: Actor, input: unknown) {
  const data = changeSchema.parse(input);
  if (who.blocked)
    error("Your account cannot make appointments. Please contact the salon.");
  // Serialize scheduling writes for this small salon; the exclusion constraint is a second independent defense.
  await db.query("select pg_advisory_xact_lock(931270)");
  const cfg = await settings(db);
  if (!who.staff && !cfg.online_booking_enabled)
    error("Online booking is not open yet.");
  if (!who.staff && !cfg.capacity_confirmed)
    error("Online booking is not open yet.");
  const original = data.id
    ? await ownAppointment(db, who, data.id, true)
    : null;
  if (original) {
    if (original.revision !== data.revision || original.status !== "confirmed")
      error("This appointment was changed. Refresh and try again.");
    if (
      !who.staff &&
      Date.parse(original.start_at) - Date.now() <
        original.cancellation_hours_snapshot * 3600000
    )
      error("Please contact the salon to change this appointment.");
  } else {
    const existing = (
      await db.query<Appointment>(
        "select * from appointments where request_id=$1",
        [data.requestId],
      )
    ).rows[0];
    if (existing) {
      if (existing.customer_id === who.id || who.staff) return existing;
      error("We couldn’t save that change.");
    }
    if (!who.staff) {
      const count = (
        await db.query<{ count: string }>(
          "select count(*) from appointments where customer_id=$1 and status='confirmed' and start_at>now()",
          [who.id],
        )
      ).rows[0];
      if (Number(count.count) >= cfg.max_upcoming)
        error("You have reached the limit for upcoming appointments.");
      if (
        (
          await db.query(
            "select 1 from appointments where customer_id=$1 and created_at>now()-interval '1 minute'",
            [who.id],
          )
        ).rows.length
      )
        error("Please wait a minute before trying again.");
    }
  }
  const service = (
    await db.query<Service>("select * from services where id=$1 and active", [
      data.serviceId,
    ])
  ).rows[0];
  if (!service) error("This service or technician is unavailable.");
  const date = (
    await db.query<{ date: string }>(
      "select to_char($1::timestamptz at time zone 'America/New_York','YYYY-MM-DD') date",
      [data.startAt],
    )
  ).rows[0].date;
  const available = await slots(
    db,
    data.serviceId,
    date,
    who.staff,
    original?.id,
  );
  const slot = available.find(
    (s) =>
      s.technician_id === data.technicianId &&
      Date.parse(s.start_at) === Date.parse(data.startAt),
  );
  if (!slot) error("That time is no longer available.");
  const end = new Date(
    Date.parse(data.startAt) + service.duration_minutes * 60000,
  ).toISOString();
  const until = new Date(
    Date.parse(end) + service.buffer_minutes * 60000,
  ).toISOString();
  let row: Appointment;
  if (original) {
    row = (
      await db.query<Appointment>(
        `update appointments set service_id=$2,service_name=$3,technician_id=$4,technician_name=$5,
     start_at=$6,end_at=$7,reserved_until=$8,price_cents=$9,revision=revision+1,notes=$10,
     customer_name=$11,customer_phone=$12,customer_email=$13 where id=$1 returning *`,
        [
          original.id,
          service.id,
          service.name,
          slot.technician_id,
          slot.technician_name,
          data.startAt,
          end,
          until,
          service.price_cents,
          who.staff ? (data.notes ?? original.notes) : original.notes,
          who.staff ? data.name : original.customer_name,
          who.staff ? data.phone : original.customer_phone,
          who.staff && !original.customer_id
            ? data.email || null
            : original.customer_email,
        ],
      )
    ).rows[0];
    await db.query("delete from reservations where appointment_id=$1", [
      row.id,
    ]);
  } else {
    row = (
      await db.query<Appointment>(
        `insert into appointments(customer_id,customer_name,customer_email,customer_phone,
      service_id,service_name,technician_id,technician_name,start_at,end_at,reserved_until,source,notes,price_cents,request_id,cancellation_hours_snapshot,policy_text_snapshot)
      values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) returning *`,
        [
          who.staff ? null : who.id,
          data.name,
          who.staff ? data.email || null : who.email,
          data.phone,
          service.id,
          service.name,
          slot.technician_id,
          slot.technician_name,
          data.startAt,
          end,
          until,
          who.staff ? "admin" : "online",
          who.staff ? (data.notes ?? "") : "",
          service.price_cents,
          data.requestId,
          cfg.cancellation_hours,
          cfg.policy_text,
        ],
      )
    ).rows[0];
  }
  await db.query(
    "insert into reservations(technician_id,appointment_id,start_at,end_at) values($1,$2,$3,$4)",
    [row.technician_id, row.id, data.startAt, until],
  );
  await audit(
    db,
    who,
    original ? "appointment.rescheduled" : "appointment.created",
    row.id,
  );
  await notify(db, row, original ? "change" : "confirmation");
  return row;
}
export async function cancelAppointment(db: DB, who: Actor, input: unknown) {
  const data = z
    .object({
      id: z.uuid(),
      revision: z.number().int().positive(),
      reason: z.string().trim().max(300).default(""),
    })
    .parse(input);
  await db.query("select pg_advisory_xact_lock(931270)");
  const old = await ownAppointment(db, who, data.id, true);
  if (old.revision !== data.revision || old.status !== "confirmed")
    error("This appointment was changed. Refresh and try again.");
  if (
    !who.staff &&
    Date.parse(old.start_at) - Date.now() <
      old.cancellation_hours_snapshot * 3600000
  )
    error("Please contact the salon to change this appointment.");
  const row = (
    await db.query<Appointment>(
      "update appointments set status='canceled',revision=revision+1,cancellation_reason=$2 where id=$1 returning *",
      [old.id, data.reason],
    )
  ).rows[0];
  await db.query("delete from reservations where appointment_id=$1", [old.id]);
  await audit(db, who, "appointment.canceled", old.id);
  await notify(db, row, "cancellation");
  return row;
}
export async function adminChange(db: DB, who: Actor, input: unknown) {
  if (!who.staff)
    error("Staff access and two-factor authentication are required.");
  await db.query("select pg_advisory_xact_lock(931270)");
  const data = z
    .object({ action: z.string(), payload: z.unknown() })
    .parse(input);
  let id = "settings";
  if (data.action === "service") {
    const s = z
      .object({
        id: z.uuid().optional(),
        name: z.string().trim().min(2).max(80),
        category: z.string().trim().max(60),
        description: z.string().max(400),
        duration_minutes: z.number().int().min(15).max(240).multipleOf(15),
        buffer_minutes: z.number().int().min(0).max(60).multipleOf(15),
        price_cents: z.number().int().min(0).max(100000).nullable(),
        active: z.boolean(),
      })
      .parse(data.payload);
    id = (
      await db.query<{ id: string }>(
        `insert into services(id,name,category,description,duration_minutes,buffer_minutes,price_cents,active)
      values(coalesce($1::uuid,gen_random_uuid()),$2,$3,$4,$5,$6,$7,$8) on conflict(id) do update set name=$2,category=$3,description=$4,duration_minutes=$5,buffer_minutes=$6,price_cents=$7,active=$8 returning id`,
        [
          s.id ?? null,
          s.name,
          s.category,
          s.description,
          s.duration_minutes,
          s.buffer_minutes,
          s.price_cents,
          s.active,
        ],
      )
    ).rows[0].id;
  } else if (data.action === "technician") {
    const t = z
      .object({
        id: z.uuid().optional(),
        name: z.string().trim().min(2).max(80),
        active: z.boolean(),
        services: z.array(z.uuid()).max(100),
        hours: z
          .array(
            z
              .object({
                weekday: z.number().int().min(0).max(6),
                opens: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
                closes: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
              })
              .refine((h) => h.opens < h.closes),
          )
          .max(7),
      })
      .parse(data.payload);
    id = (
      await db.query<{ id: string }>(
        "insert into technicians(id,name,active) values(coalesce($1::uuid,gen_random_uuid()),$2,$3) on conflict(id) do update set name=$2,active=$3 returning id",
        [t.id ?? null, t.name, t.active],
      )
    ).rows[0].id;
    await db.query("delete from technician_services where technician_id=$1", [
      id,
    ]);
    await db.query("delete from working_hours where technician_id=$1", [id]);
    for (const service of t.services)
      await db.query("insert into technician_services values($1,$2)", [
        id,
        service,
      ]);
    for (const h of t.hours)
      await db.query("insert into working_hours values($1,$2,$3,$4)", [
        id,
        h.weekday,
        h.opens,
        h.closes,
      ]);
  } else if (data.action === "block") {
    const b = z
      .object({
        technician_id: z.uuid(),
        start_at: z.iso.datetime({ offset: true }),
        end_at: z.iso.datetime({ offset: true }),
        reason: z.string().trim().min(2).max(200),
      })
      .refine((b) => Date.parse(b.end_at) > Date.parse(b.start_at))
      .parse(data.payload);
    id = (
      await db.query<{ id: string }>(
        "insert into reservations(technician_id,start_at,end_at,reason) values($1,$2,$3,$4) returning id",
        [b.technician_id, b.start_at, b.end_at, b.reason],
      )
    ).rows[0].id;
  } else if (data.action === "unblock") {
    id = z.object({ id: z.uuid() }).parse(data.payload).id;
    await db.query(
      "delete from reservations where id=$1 and appointment_id is null",
      [id],
    );
  } else if (data.action === "settings") {
    const s = z
      .object({
        online_booking_enabled: z.boolean(),
        lead_hours: z.number().int().min(0).max(168),
        horizon_days: z.number().int().min(1).max(180),
        max_upcoming: z.number().int().min(1).max(10),
        cancellation_hours: z.number().int().min(0).max(336),
        policy_text: z.string().trim().min(20).max(1500),
        capacity_confirmed: z.boolean(),
      })
      .parse(data.payload);
    if (
      s.online_booking_enabled &&
      (!s.capacity_confirmed ||
        !(
          await db.query(
            "select 1 from services s join technician_services ts on ts.service_id=s.id join technicians t on t.id=ts.technician_id join working_hours h on h.technician_id=t.id where s.active and t.active limit 1",
          )
        ).rows.length)
    )
      error(
        "Configure services, staff hours, and capacity before opening booking.",
      );
    await db.query(
      "update booking_settings set online_booking_enabled=$1,lead_hours=$2,horizon_days=$3,max_upcoming=$4,cancellation_hours=$5,policy_text=$6,capacity_confirmed=$7 where id=true",
      [
        s.online_booking_enabled,
        s.lead_hours,
        s.horizon_days,
        s.max_upcoming,
        s.cancellation_hours,
        s.policy_text,
        s.capacity_confirmed,
      ],
    );
  } else if (data.action === "restrict") {
    const r = z
      .object({
        email: z.email(),
        blocked: z.boolean(),
        reason: z.string().trim().max(200),
      })
      .parse(data.payload);
    const customer = (
      await db.query<{ id: string }>(
        `select id from "user" where lower(email)=lower($1) and not exists(select 1 from staff_roles where user_id="user".id)`,
        [r.email],
      )
    ).rows[0];
    if (!customer) error("Customer account unavailable.");
    id = customer.id;
    if (r.blocked) {
      await db.query(
        "insert into restricted_accounts(user_id,reason) values($1,$2) on conflict(user_id) do update set reason=$2",
        [id, r.reason],
      );
    } else
      await db.query("delete from restricted_accounts where user_id=$1", [id]);
  } else if (data.action === "status") {
    const s = z
      .object({
        id: z.uuid(),
        revision: z.number().int(),
        status: z.enum(["completed", "no_show"]),
      })
      .parse(data.payload);
    const old = await ownAppointment(db, who, s.id, true);
    if (old.revision !== s.revision || old.status !== "confirmed")
      error("This appointment was changed. Refresh and try again.");
    if (Date.parse(old.start_at) > Date.now())
      error(
        "An appointment must start before it can be marked complete or missed.",
      );
    await db.query(
      "update appointments set status=$2,revision=revision+1 where id=$1",
      [s.id, s.status],
    );
    await db.query("delete from reservations where appointment_id=$1", [s.id]);
    await db.query(
      "update notification_jobs set status='obsolete' where appointment_id=$1 and status='pending'",
      [s.id],
    );
    id = s.id;
  } else error("Unknown action.");
  await audit(db, who, data.action, id);
  return { id };
}
