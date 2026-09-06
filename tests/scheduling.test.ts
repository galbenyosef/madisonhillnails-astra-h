import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { btree_gist } from "@electric-sql/pglite/contrib/btree_gist";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import {
  saveAppointment,
  cancelAppointment,
  adminChange,
  slots,
  type Actor,
} from "../lib/scheduling";
import type { DB } from "../lib/db";
import { localToUTC, salonDate } from "../lib/format";
let db: PGlite;
let service: string;
let tech: string;
const customer: Actor = {
  id: "customer-fixture",
  name: "Test Customer",
  email: "booking@example.test",
  staff: false,
  blocked: false,
};
const staff: Actor = {
  id: "staff-fixture",
  name: "Test Staff",
  email: "staff@example.test",
  staff: true,
  blocked: false,
};
const another: Actor = { ...customer, id: "other-fixture" };
const date = () => salonDate(new Date(Date.now() + 7 * 86400000), "yyyy-MM-dd");
const input = (hour = "10:00") => ({
  serviceId: service,
  technicianId: tech,
  startAt: localToUTC(`${date()}T${hour}`),
  name: customer.name,
  phone: "202-555-0100",
  acceptPolicy: true,
  requestId: randomUUID(),
});
const tx = <T>(fn: (conn: DB) => Promise<T>) =>
  db.transaction((c) => fn(c as unknown as DB));
beforeAll(async () => {
  db = new PGlite({ extensions: { btree_gist } });
  await db.exec(
    await readFile(
      new URL("../database/001-schema.sql", import.meta.url),
      "utf8",
    ),
  );
  for (const a of [customer, staff, another])
    await db.query(
      'insert into "user"(id,name,email,"emailVerified") values($1,$2,$3,true)',
      [a.id, a.name, `${a.id}@example.test`],
    );
});
afterAll(async () => {
  await db.close();
});
beforeEach(async () => {
  await db.exec(
    "truncate appointments,reservations,notification_jobs,audit_log,technician_services,working_hours,technicians,services cascade; update booking_settings set online_booking_enabled=true,capacity_confirmed=true,lead_hours=2,horizon_days=60,max_upcoming=3,cancellation_hours=24",
  );
  service = randomUUID();
  tech = randomUUID();
  await db.query(
    "insert into services(id,name,duration_minutes,buffer_minutes,price_cents) values($1,'Fixture service',30,15,2500)",
    [service],
  );
  await db.query(
    "insert into technicians(id,name) values($1,'Fixture technician')",
    [tech],
  );
  await db.query("insert into technician_services values($1,$2)", [
    tech,
    service,
  ]);
  for (let day = 0; day < 7; day++)
    await db.query("insert into working_hours values($1,$2,'09:00','17:00')", [
      tech,
      day,
    ]);
});
describe("shared PostgreSQL scheduling", () => {
  it("commits booking, occupied buffer, audit, and notification jobs together", async () => {
    const a = await tx((c) => saveAppointment(c, customer, input()));
    expect(a.status).toBe("confirmed");
    expect((await db.query("select * from reservations")).rows).toHaveLength(1);
    expect((await db.query("select * from audit_log")).rows).toHaveLength(1);
    expect(
      (await db.query("select * from notification_jobs")).rows,
    ).toHaveLength(2);
    const available = await slots(db as unknown as DB, service, date());
    expect(
      available.some(
        (s) => Date.parse(s.start_at) === Date.parse(input("10:30").startAt),
      ),
    ).toBe(false);
    expect(
      available.some(
        (s) => Date.parse(s.start_at) === Date.parse(input("10:45").startAt),
      ),
    ).toBe(true);
  });
  it("makes retries idempotent", async () => {
    const payload = input();
    const a = await tx((c) => saveAppointment(c, customer, payload));
    const b = await tx((c) => saveAppointment(c, customer, payload));
    expect(a.id).toBe(b.id);
    expect((await db.query("select * from appointments")).rows).toHaveLength(1);
  });
  it("allows only one of two competing bookings", async () => {
    const results = await Promise.allSettled([
      tx((c) => saveAppointment(c, customer, input())),
      tx((c) => saveAppointment(c, another, input())),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect((await db.query("select * from appointments")).rows).toHaveLength(1);
  });
  it("blocks online appointments during a manual appointment", async () => {
    await tx((c) => saveAppointment(c, staff, input()));
    await expect(
      tx((c) => saveAppointment(c, customer, input("10:15"))),
    ).rejects.toThrow("no longer available");
  });
  it("enforces the exclusion constraint even for direct overlapping writes", async () => {
    await tx((c) => saveAppointment(c, customer, input()));
    await expect(
      db.query(
        "insert into reservations(technician_id,start_at,end_at,reason) values($1,$2,$3,'break')",
        [tech, input("10:30").startAt, input("11:00").startAt],
      ),
    ).rejects.toMatchObject({ code: "23P01" });
  });
  it("time blocks suppress availability and removing a block restores it", async () => {
    const block = await tx((c) =>
      adminChange(c, staff, {
        action: "block",
        payload: {
          technician_id: tech,
          start_at: input().startAt,
          end_at: input("11:00").startAt,
          reason: "Fixture break",
        },
      }),
    );
    await expect(
      tx((c) => saveAppointment(c, customer, input())),
    ).rejects.toThrow("no longer available");
    await tx((c) =>
      adminChange(c, staff, { action: "unblock", payload: block }),
    );
    await expect(
      tx((c) => saveAppointment(c, customer, input())),
    ).resolves.toHaveProperty("status", "confirmed");
  });
  it("rejects customer admin actions and cross-account changes", async () => {
    const a = await tx((c) => saveAppointment(c, customer, input()));
    await expect(
      tx((c) =>
        cancelAppointment(c, another, { id: a.id, revision: a.revision }),
      ),
    ).rejects.toThrow("unavailable");
    await expect(
      tx((c) =>
        adminChange(c, customer, {
          action: "unblock",
          payload: { id: randomUUID() },
        }),
      ),
    ).rejects.toThrow("Staff access");
  });
  it("rolls back a conflicting reschedule and retains the old reservation", async () => {
    const a = await tx((c) => saveAppointment(c, customer, input()));
    await tx((c) => saveAppointment(c, staff, input("12:00")));
    await expect(
      tx((c) =>
        saveAppointment(c, customer, {
          ...input("12:00"),
          id: a.id,
          revision: a.revision,
        }),
      ),
    ).rejects.toThrow("no longer available");
    const remaining = (
      await db.query<{ start_at: Date }>(
        "select start_at from reservations where appointment_id=$1",
        [a.id],
      )
    ).rows[0];
    expect(new Date(remaining.start_at).toISOString()).toBe(input().startAt);
  });
  it("releases canceled time and obsoletes pending reminders", async () => {
    const a = await tx((c) => saveAppointment(c, customer, input()));
    await tx((c) =>
      cancelAppointment(c, customer, { id: a.id, revision: a.revision }),
    );
    expect((await db.query("select * from reservations")).rows).toHaveLength(0);
    expect(
      (
        await db.query(
          "select * from notification_jobs where status='pending' and kind='reminder'",
        )
      ).rows,
    ).toHaveLength(0);
    await expect(
      tx((c) =>
        cancelAppointment(c, customer, { id: a.id, revision: a.revision }),
      ),
    ).rejects.toThrow("was changed");
  });
  it("applies cutoff to customers while staff can assist", async () => {
    await db.exec("update booking_settings set cancellation_hours=336");
    const a = await tx((c) => saveAppointment(c, customer, input()));
    await db.exec("update booking_settings set cancellation_hours=336");
    await expect(
      tx((c) =>
        cancelAppointment(c, customer, { id: a.id, revision: a.revision }),
      ),
    ).rejects.toThrow("contact the salon");
    await expect(
      tx((c) =>
        cancelAppointment(c, staff, { id: a.id, revision: a.revision }),
      ),
    ).resolves.toHaveProperty("status", "canceled");
  });
  it("rejects restricted accounts, booking when closed, ineligible staff, and off-grid times", async () => {
    await expect(
      tx((c) => saveAppointment(c, { ...customer, blocked: true }, input())),
    ).rejects.toThrow("cannot make appointments");
    await db.exec("update booking_settings set online_booking_enabled=false");
    await expect(
      tx((c) => saveAppointment(c, customer, input())),
    ).rejects.toThrow("not open");
    await expect(
      tx((c) => saveAppointment(c, staff, input("10:07"))),
    ).rejects.toThrow("no longer available");
    await db.exec("delete from technician_services");
    await expect(tx((c) => saveAppointment(c, staff, input()))).rejects.toThrow(
      "no longer available",
    );
  });
  it("enforces booking caps and preserves capacity during rapid retries", async () => {
    await tx((c) => saveAppointment(c, customer, input()));
    await expect(
      tx((c) => saveAppointment(c, customer, input("12:00"))),
    ).rejects.toThrow("wait a minute");
    await db.exec("update booking_settings set max_upcoming=1");
    await expect(
      tx((c) => saveAppointment(c, customer, input("13:00"))),
    ).rejects.toThrow("limit for upcoming");
  });
  it("starts with private RLS-enabled tables and no public policies", async () => {
    const tables = await db.query<{ relrowsecurity: boolean }>(
      "select relrowsecurity from pg_class where relname in ('appointments','user','session','staff_roles') and relnamespace='public'::regnamespace",
    );
    expect(tables.rows.every((t) => t.relrowsecurity)).toBe(true);
    expect(
      (await db.query("select * from pg_policies where schemaname='public'"))
        .rows,
    ).toHaveLength(0);
  });
  it("converts Madison times correctly across daylight saving changes", () => {
    expect(localToUTC("2027-01-10T10:00")).toBe("2027-01-10T15:00:00.000Z");
    expect(localToUTC("2027-07-10T10:00")).toBe("2027-07-10T14:00:00.000Z");
  });
  it("does not retroactively tighten a booked cancellation policy", async () => {
    const a = await tx((c) => saveAppointment(c, customer, input()));
    await db.exec("update booking_settings set cancellation_hours=336");
    await expect(
      tx((c) =>
        cancelAppointment(c, customer, { id: a.id, revision: a.revision }),
      ),
    ).resolves.toHaveProperty("status", "canceled");
  });
  it("lets staff correct manual customer details without linking an account", async () => {
    const a = await tx((c) => saveAppointment(c, staff, input()));
    const updated = await tx((c) =>
      saveAppointment(c, staff, {
        ...input(),
        id: a.id,
        revision: a.revision,
        name: "Updated fixture",
        phone: "202-555-0101",
        email: "updated@example.test",
        notes: "Fixture correction",
      }),
    );
    expect(updated.customer_id).toBeNull();
    expect(updated.customer_name).toBe("Updated fixture");
    expect(updated.customer_phone).toBe("202-555-0101");
    expect(updated.revision).toBe(2);
  });
  it("rejects contact numbers consisting only of punctuation", async () => {
    await expect(
      tx((c) => saveAppointment(c, customer, { ...input(), phone: "-------" })),
    ).rejects.toThrow();
    expect((await db.query("select * from appointments")).rows).toHaveLength(0);
  });
});
