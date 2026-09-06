import { vi, beforeAll, afterAll, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { btree_gist } from "@electric-sql/pglite/contrib/btree_gist";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createOTP } from "@better-auth/utils/otp";
import { base32 } from "@better-auth/utils/base32";
const state = vi.hoisted(() => ({
  db: null as unknown as PGlite,
  emails: [] as string[],
}));
vi.mock("server-only", () => ({}));
vi.mock("../lib/mail", () => ({
  sendMail: async (_to: string, _subject: string, text: string) => {
    state.emails.push(text);
  },
}));
vi.mock("../lib/db", async (importOriginal) => {
  const original = await importOriginal<typeof import("../lib/db")>();
  const client = {
    query: async (sql: string, values: unknown[] = []) => {
      const r = await state.db.query(sql, values);
      return {
        ...r,
        command: sql.trim().split(" ")[0].toUpperCase(),
        rowCount: r.affectedRows || r.rows.length,
      };
    },
    release: () => {},
  };
  return {
    ...original,
    database: () => ({
      ...client,
      connect: async () => client,
      end: async () => {},
    }),
    transaction: async (fn: (db: typeof client) => Promise<unknown>) =>
      state.db.transaction(async (tx) =>
        fn({
          ...client,
          query: async (sql: string, values: unknown[] = []) => {
            const r = await tx.query(sql, values);
            return {
              ...r,
              command: sql.trim().split(" ")[0].toUpperCase(),
              rowCount: r.affectedRows || r.rows.length,
            };
          },
        }),
      ),
  };
});
import { POST, GET } from "../app/api/auth/[...all]/route";
import { actor } from "../lib/auth";
import { POST as bookingPOST } from "../app/api/booking/route";
const origin = "http://localhost:3000";
const password = randomBytes(24).toString("hex");
let cookies = new Map<string, string>();
let userId = "";
let totpSecret = "";
const header = () =>
  new Headers({
    origin,
    "content-type": "application/json",
    cookie: Array.from(cookies, ([k, v]) => `${k}=${v}`).join("; "),
  });
async function call(path: string, body: unknown) {
  const result = await POST(
    new Request(`${origin}/api/auth/${path}`, {
      method: "POST",
      headers: header(),
      body: JSON.stringify(body),
    }),
  );
  for (const c of result.headers.getSetCookie()) {
    const first = c.split(";")[0];
    cookies.set(
      first.slice(0, first.indexOf("=")),
      first.slice(first.indexOf("=") + 1),
    );
  }
  return result;
}
beforeAll(async () => {
  state.db = new PGlite({ extensions: { btree_gist } });
  await state.db.exec(
    await readFile(
      new URL("../database/001-schema.sql", import.meta.url),
      "utf8",
    ),
  );
  vi.stubEnv("DATABASE_URL", "postgresql://localhost/unused_test_adapter");
  vi.stubEnv("BETTER_AUTH_SECRET", randomBytes(48).toString("hex"));
  vi.stubEnv("BETTER_AUTH_URL", origin);
  vi.stubEnv("SMTP_HOST", "localhost");
  vi.stubEnv("SMTP_USER", "fixture");
  vi.stubEnv("SMTP_PASSWORD", randomBytes(16).toString("hex"));
  vi.stubEnv("MAIL_FROM", "test@example.test");
});
afterAll(async () => {
  await state.db.close();
  vi.unstubAllEnvs();
});
it("rejects cross-origin signup and bot traps", async () => {
  const cross = await POST(
    new Request(`${origin}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        origin: "https://untrusted.example",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Fixture User",
        email: "auth@example.test",
        password,
      }),
    }),
  );
  expect(cross.status).toBe(403);
  const bot = await call("sign-up/email", {
    name: "Fixture User",
    email: "auth@example.test",
    password,
    website: "filled-by-bot",
  });
  expect(bot.status).toBe(400);
  expect((await state.db.query('select id from "user"')).rows.length).toBe(0);
});
it("requires email verification and ignores privilege fields at signup", async () => {
  const r = await call("sign-up/email", {
    name: "Fixture User",
    email: "auth@example.test",
    password,
    website: "",
    role: "owner",
    emailVerified: true,
    twoFactorEnabled: true,
    callbackURL: "/login?verified=1",
  });
  expect(r.status).toBe(200);
  const user = (
    await state.db.query<{
      id: string;
      emailVerified: boolean;
      twoFactorEnabled: boolean;
    }>('select id,"emailVerified","twoFactorEnabled" from "user"')
  ).rows[0];
  userId = user.id;
  expect(user.emailVerified).toBe(false);
  expect(user.twoFactorEnabled).toBe(false);
  expect((await state.db.query("select * from staff_roles")).rows.length).toBe(
    0,
  );
  expect(await actor(header())).toBeNull();
  const login = await call("sign-in/email", {
    email: "auth@example.test",
    password,
  });
  expect(login.ok).toBe(false);
});
it("verifies the inbox, signs in, and keeps ordinary users out of staff access", async () => {
  const text = state.emails.at(-1)!;
  const link = text.match(
    /http:\/\/localhost:3000\/api\/auth\/verify-email\?\S+/,
  )?.[0];
  expect(Boolean(link)).toBe(true);
  const response = await GET(new Request(link!, { headers: header() }));
  expect(response.status).toBe(302);
  const r = await call("sign-in/email", {
    email: "auth@example.test",
    password,
  });
  expect(r.ok).toBe(true);
  const user = await actor(header());
  expect(user?.id).toBe(userId);
  expect(user?.staff).toBe(false);
});
it("rejects forged staff privileges at the booking HTTP boundary", async () => {
  const response = await bookingPOST(
    new Request(`${origin}/api/booking`, {
      method: "POST",
      headers: header(),
      body: JSON.stringify({
        action: "settings",
        staff: true,
        role: "owner",
        payload: { online_booking_enabled: true },
      }),
    }),
  );
  expect(response.status).toBe(403);
  expect(
    (
      await state.db.query<{ online_booking_enabled: boolean }>(
        "select online_booking_enabled from booking_settings",
      )
    ).rows[0].online_booking_enabled,
  ).toBe(false);
});
it("requires staff enrollment and verification tied to the current session", async () => {
  await state.db.query("insert into staff_roles values($1,'owner')", [userId]);
  expect((await actor(header()))?.staff).toBe(false);
  const enable = await call("two-factor/enable", { password, method: "totp" });
  expect(enable.ok).toBe(true);
  const setup = await enable.json();
  totpSecret = new URL(setup.totpURI).searchParams.get("secret")!;
  expect((await actor(header()))?.staff).toBe(false);
  const code = await createOTP(
    new TextDecoder().decode(base32.decode(totpSecret)),
  ).totp();
  const verify = await call("two-factor/verify-totp", {
    code,
    trustDevice: false,
  });
  expect(verify.ok).toBe(true);
  expect((await actor(header()))?.staff).toBe(true);
});
it("does not allow staff to disable MFA or use another session's step-up", async () => {
  const disable = await call("two-factor/disable", { password });
  expect(disable.status).toBe(403);
  const current = await actor(header());
  await state.db.query(
    "update staff_session_verifications set verified_at=now()-interval '13 hours' where session_id=$1",
    [current!.session.session.id],
  );
  expect((await actor(header()))?.staff).toBe(false);
});
it("issues no authenticated session on password-only staff sign-in", async () => {
  await call("sign-out", {});
  cookies = new Map();
  const login = await call("sign-in/email", {
    email: "auth@example.test",
    password,
  });
  expect(login.ok).toBe(true);
  const body = await login.json();
  expect(body.twoFactorRedirect).toBe(true);
  expect(await actor(header())).toBeNull();
  const bad = await call("two-factor/verify-totp", {
    code: "not-a-valid-code",
  });
  expect(bad.ok).toBe(false);
  expect(await actor(header())).toBeNull();
});
it("rejects repeated sign-in attempts with durable rate limiting", async () => {
  let limited = false;
  for (let i = 0; i < 8; i++) {
    const response = await call("sign-in/email", {
      email: "nonexistent@example.test",
      password,
    });
    if (response.status === 429) limited = true;
  }
  expect(limited).toBe(true);
  expect(
    (await state.db.query('select count(*) count from "rateLimit"')).rows
      .length,
  ).toBe(1);
});
it("fails closed without production IP configuration or the trusted Netlify header", async () => {
  const previousMode = process.env.NODE_ENV;
  const previousSource = process.env.AUTH_IP_SOURCE;
  try {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("AUTH_IP_SOURCE", undefined);
    const request = () =>
      new Request(`${origin}/api/auth/get-session`, {
        headers: { "x-forwarded-for": "192.0.2.1" },
      });
    expect((await GET(request())).status).toBe(503);
    vi.stubEnv("AUTH_IP_SOURCE", "netlify");
    expect((await GET(request())).status).toBe(503);
  } finally {
    vi.stubEnv("NODE_ENV", previousMode);
    vi.stubEnv("AUTH_IP_SOURCE", previousSource);
  }
});
