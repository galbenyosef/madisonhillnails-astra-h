import { database, mailConfigured, transaction } from "./db";
import { sendMail } from "./mail";
import { salonDate } from "./format";
import type { Appointment } from "./types";
export async function processNotifications() {
  if (!mailConfigured() || process.env.EMAIL_JOBS_ENABLED !== "true")
    return { processed: 0, enabled: false };
  let processed = 0;
  for (let i = 0; i < 5; i++) {
    const found = await transaction(async (db) => {
      // Same lock order as appointment changes, avoiding job/appointment deadlocks.
      await db.query("select pg_advisory_xact_lock(931270)");
      const job = (
        await db.query<{
          id: string;
          appointment_id: string;
          revision: number;
          kind: string;
          attempts: number;
        }>(
          "select * from notification_jobs where status='pending' and due_at<=now() order by due_at for update skip locked limit 1",
        )
      ).rows[0];
      if (!job) return false;
      // Hold the appointment lock through delivery so cancellation/rescheduling cannot race a stale email.
      const a = (
        await db.query<Appointment>(
          "select * from appointments where id=$1 for update",
          [job.appointment_id],
        )
      ).rows[0];
      if (
        !a ||
        a.revision !== job.revision ||
        !a.customer_email ||
        (job.kind !== "cancellation" && a.status !== "confirmed") ||
        (job.kind === "reminder" && Date.parse(a.start_at) <= Date.now())
      ) {
        await db.query(
          "update notification_jobs set status='obsolete' where id=$1",
          [job.id],
        );
        return true;
      }
      try {
        const label =
          job.kind === "cancellation"
            ? "Appointment canceled"
            : job.kind === "change"
              ? "Appointment updated"
              : job.kind === "reminder"
                ? "Your appointment is tomorrow"
                : "Appointment confirmed";
        await sendMail(
          a.customer_email,
          `${label} · Madison Hill Nails`,
          `${label}\n\n${a.service_name}\n${salonDate(a.start_at)} Eastern Time\nWith ${a.technician_name}\n349 Main St, Madison, NJ 07940\n\nManage online bookings at ${process.env.BETTER_AUTH_URL}/appointments. For staff-entered bookings, please visit the salon for assistance.\n\nNo payment has been collected by this website.`,
          db,
        );
        await db.query(
          "update notification_jobs set status='sent',attempts=attempts+1 where id=$1",
          [job.id],
        );
      } catch {
        await db.query(
          "update notification_jobs set attempts=attempts+1,status=case when attempts>=4 then 'failed' else 'pending' end,due_at=now()+make_interval(mins=>least(120,5*power(2,attempts)::int)) where id=$1",
          [job.id],
        );
      }
      return true;
    });
    if (!found) break;
    processed++;
  }
  // Bounded housekeeping without logging account details or tokens.
  await database().query(
    "delete from verification where \"expiresAt\"<now()-interval '7 days'",
  );
  await database().query('delete from session where "expiresAt"<now()');
  await database().query(
    "delete from request_limits where window_start<now()-interval '7 days'",
  );
  return { processed, enabled: true };
}
