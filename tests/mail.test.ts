import { vi, beforeAll, beforeEach, afterAll, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import type { DB } from "../lib/db";
const state = vi.hoisted(() => ({
  db: null as unknown as PGlite,
  send: vi.fn(),
}));
vi.mock("nodemailer", () => ({
  default: {
    createTransport: () => ({
      sendMail: (...args: unknown[]) => state.send(...args),
    }),
  },
}));
vi.mock("../lib/db", () => ({
  mailConfigured: () => true,
  transaction: async (fn: (db: DB) => Promise<unknown>) =>
    state.db.transaction((tx) => fn(tx as unknown as DB)),
}));
import { sendMail } from "../lib/mail";
import { requestAllowed } from "../lib/request-limit";
beforeAll(async () => {
  state.db = new PGlite();
  await state.db.exec(
    "create table mail_usage(period text primary key,sent integer not null default 0); create table request_limits(key text primary key,window_start timestamptz not null default now(),count integer not null default 1)",
  );
  vi.stubEnv("MAIL_DAILY_LIMIT", "2");
  vi.stubEnv("MAIL_MONTHLY_LIMIT", "3");
});
beforeEach(async () => {
  state.send.mockReset();
  await state.db.exec("truncate mail_usage,request_limits");
});
afterAll(async () => {
  await state.db.close();
  vi.unstubAllEnvs();
});
it("stops sending at the daily quota", async () => {
  await sendMail("fixture@example.test", "Test", "Fixture");
  await sendMail("fixture@example.test", "Test", "Fixture");
  await expect(
    sendMail("fixture@example.test", "Test", "Fixture"),
  ).rejects.toThrow("quota");
  expect(state.send).toHaveBeenCalledTimes(2);
});
it("reserves monthly and daily allowances atomically", async () => {
  await state.db.query("insert into mail_usage(period,sent) values($1,3)", [
    new Date().toISOString().slice(0, 7),
  ]);
  await expect(
    sendMail("fixture@example.test", "Test", "Fixture"),
  ).rejects.toThrow("quota");
  expect(state.send).not.toHaveBeenCalled();
  expect((await state.db.query("select * from mail_usage")).rows).toHaveLength(
    1,
  );
});
it("counts failed attempts toward the allowance", async () => {
  state.send.mockRejectedValue(new Error("Delivery failed"));
  await expect(
    sendMail("fixture@example.test", "Test", "Fixture"),
  ).rejects.toThrow();
  await expect(
    sendMail("fixture@example.test", "Test", "Fixture"),
  ).rejects.toThrow();
  await expect(
    sendMail("fixture@example.test", "Test", "Fixture"),
  ).rejects.toThrow("quota");
  expect(state.send).toHaveBeenCalledTimes(2);
});
it("enforces persistent application request limits and resets expired windows", async () => {
  const db = state.db as unknown as DB;
  expect(await requestAllowed(db, "fixture-account", 2)).toBe(true);
  expect(await requestAllowed(db, "fixture-account", 2)).toBe(true);
  expect(await requestAllowed(db, "fixture-account", 2)).toBe(false);
  await state.db.exec(
    "update request_limits set window_start=now()-interval '2 minutes'",
  );
  expect(await requestAllowed(db, "fixture-account", 2)).toBe(true);
});
