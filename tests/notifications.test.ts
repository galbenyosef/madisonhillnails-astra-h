import { vi, beforeAll, beforeEach, afterAll, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { btree_gist } from "@electric-sql/pglite/contrib/btree_gist";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { DB } from "../lib/db";
const state = vi.hoisted(() => ({
  db: null as unknown as PGlite,
  send: vi.fn(),
}));
vi.mock("../lib/db", () => ({
  database: () => state.db,
  mailConfigured: () => true,
  transaction: async (fn: (db: DB) => Promise<unknown>) =>
    state.db.transaction((tx) => fn(tx as unknown as DB)),
}));
vi.mock("../lib/mail", () => ({
  sendMail: (...args: unknown[]) => state.send(...args),
}));
import { processNotifications } from "../lib/jobs";
let id: string;
beforeAll(async () => {
  state.db = new PGlite({ extensions: { btree_gist } });
  await state.db.exec(
    await readFile(
      new URL("../database/001-schema.sql", import.meta.url),
      "utf8",
    ),
  );
  vi.stubEnv("EMAIL_JOBS_ENABLED", "true");
});
afterAll(async () => {
  await state.db.close();
  vi.unstubAllEnvs();
});
beforeEach(async () => {
  state.send.mockReset();
  await state.db.exec(
    "truncate appointments,notification_jobs,reservations,services,technicians cascade",
  );
  const service = randomUUID();
  const tech = randomUUID();
  id = randomUUID();
  await state.db.query(
    "insert into services(id,name,duration_minutes) values($1,'Fixture service',30)",
    [service],
  );
  await state.db.query(
    "insert into technicians(id,name) values($1,'Fixture technician')",
    [tech],
  );
  await state.db.query(
    `insert into appointments(id,customer_name,customer_email,customer_phone,service_id,service_name,technician_id,technician_name,start_at,end_at,reserved_until,source,request_id,cancellation_hours_snapshot,policy_text_snapshot)
 values($1,'Fixture customer','fixture@example.test','202-555-0100',$2,'Fixture service',$3,'Fixture technician',now()+interval '2 days',now()+interval '2 days 30 minutes',now()+interval '2 days 30 minutes','admin',$4,24,'Fixture policy')`,
    [id, service, tech, randomUUID()],
  );
  await state.db.query(
    "insert into notification_jobs(appointment_id,revision,kind) values($1,1,'confirmation')",
    [id],
  );
});
it("sends once on the normal path and marks a job sent", async () => {
  await processNotifications();
  await processNotifications();
  expect(state.send).toHaveBeenCalledTimes(1);
  expect(
    (
      await state.db.query<{ status: string }>(
        "select status from notification_jobs",
      )
    ).rows[0].status,
  ).toBe("sent");
});
it("does not send obsolete appointment revisions", async () => {
  await state.db.query("update appointments set revision=2 where id=$1", [id]);
  await processNotifications();
  expect(state.send).not.toHaveBeenCalled();
  expect(
    (
      await state.db.query<{ status: string }>(
        "select status from notification_jobs",
      )
    ).rows[0].status,
  ).toBe("obsolete");
});
it("suppresses confirmations after cancellation", async () => {
  await state.db.query(
    "update appointments set status='canceled' where id=$1",
    [id],
  );
  await processNotifications();
  expect(state.send).not.toHaveBeenCalled();
});
it("delivers cancellation notices for the current canceled revision", async () => {
  await state.db.query(
    "update appointments set status='canceled' where id=$1",
    [id],
  );
  await state.db.exec("update notification_jobs set kind='cancellation'");
  await processNotifications();
  expect(state.send).toHaveBeenCalledTimes(1);
});
it("retries failures with a bounded attempt count", async () => {
  state.send.mockRejectedValue(new Error("Simulated delivery failure"));
  for (let i = 0; i < 5; i++) {
    await state.db.exec("update notification_jobs set due_at=now()");
    await processNotifications();
  }
  const job = (
    await state.db.query<{ status: string; attempts: number }>(
      "select status,attempts from notification_jobs",
    )
  ).rows[0];
  expect(job).toEqual({ status: "failed", attempts: 5 });
});
it("keeps delivery off unless explicitly enabled", async () => {
  vi.stubEnv("EMAIL_JOBS_ENABLED", "false");
  expect(await processNotifications()).toEqual({
    processed: 0,
    enabled: false,
  });
  expect(state.send).not.toHaveBeenCalled();
  vi.stubEnv("EMAIL_JOBS_ENABLED", "true");
});
