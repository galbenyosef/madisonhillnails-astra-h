import { auth, currentSession } from "@/lib/auth";
import { configured, database, mailConfigured } from "@/lib/db";
import { isAllowedEmail } from "@/lib/validation";
import { isIP } from "node:net";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const fail = (message: string, status = 400) =>
  Response.json(
    { message },
    { status, headers: { "Cache-Control": "no-store" } },
  );

async function handler(request: Request) {
  if (!configured())
    return fail(
      "Online accounts are getting ready. Please try again later.",
      503,
    );
  try {
    const path = decodeURIComponent(new URL(request.url).pathname).replace(
      /\/+$/,
      "",
    );
    const incoming = new Headers(request.headers);
    // Netlify overwrites its client-IP header. Never trust a client-supplied forwarding chain.
    const netlifyIp = process.env.AUTH_IP_SOURCE === "netlify";
    if (process.env.NODE_ENV === "production" && !netlifyIp)
      return fail("Please try again later.", 503);
    const ip = netlifyIp
      ? incoming.get("x-nf-client-connection-ip")
      : "127.0.0.1";
    if (!ip || !isIP(ip)) return fail("Please try again later.", 503);
    incoming.set("x-mhn-client-ip", ip);
    if (request.method === "POST") {
      if (
        incoming.get("origin") !== new URL(process.env.BETTER_AUTH_URL!).origin
      )
        return fail("Invalid request.", 403);
      const raw = await request.text();
      if (raw.length > 12000) return fail("Request too large.", 413);
      const body = JSON.parse(raw);
      if (body.trustDevice)
        return fail("Please use a verification code for each sign-in.");
      if (path.endsWith("/sign-up/email")) {
        if (!mailConfigured())
          return fail(
            "Online accounts are getting ready. Please try again later.",
            503,
          );
        if (
          body.website ||
          typeof body.email !== "string" ||
          !isAllowedEmail(body.email)
        )
          return fail("Please use your regular email address.");
        if (
          typeof body.name !== "string" ||
          body.name.trim().length < 2 ||
          body.name.length > 80
        )
          return fail("Enter your name.");
      }
      if (path.endsWith("/two-factor/disable")) {
        const session = await currentSession(incoming);
        if (
          session &&
          (
            await database().query(
              "select 1 from staff_roles where user_id=$1",
              [session.user.id],
            )
          ).rows.length
        )
          return fail(
            "Staff accounts must keep two-factor authentication enabled.",
            403,
          );
      }
      request = new Request(request.url, {
        method: "POST",
        headers: incoming,
        body: raw,
      });
    } else request = new Request(request.url, { headers: incoming });
    const response = await auth().handler(request);
    if (response.ok && /\/two-factor\/verify-(totp|backup-code)$/.test(path)) {
      // Bind staff step-up to the actual session that survived successful verification.
      const cookies = new Map(
        (incoming.get("cookie") || "")
          .split(/;\s*/)
          .filter(Boolean)
          .map((c) => [
            c.slice(0, c.indexOf("=")),
            c.slice(c.indexOf("=") + 1),
          ]),
      );
      for (const value of response.headers.getSetCookie()) {
        const c = value.split(";")[0];
        cookies.set(c.slice(0, c.indexOf("=")), c.slice(c.indexOf("=") + 1));
      }
      incoming.set(
        "cookie",
        Array.from(cookies, ([k, v]) => `${k}=${v}`).join("; "),
      );
      const session = await currentSession(incoming);
      if (session?.user.twoFactorEnabled)
        await database().query(
          "insert into staff_session_verifications(session_id) values($1) on conflict(session_id) do update set verified_at=now()",
          [session.session.id],
        );
    }
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch {
    return fail(
      "We couldn’t complete that request. Please try again later.",
      503,
    );
  }
}
export { handler as GET, handler as POST };
