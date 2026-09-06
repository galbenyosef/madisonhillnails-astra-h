import "server-only";
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { configured, database } from "./db";
import { sendMail } from "./mail";

function createAuth() {
  if (!configured() || process.env.BETTER_AUTH_SECRET!.length < 32)
    throw new Error("Authentication unavailable");
  return betterAuth({
    appName: "Madison Hill Nails",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: database(),
    trustedOrigins: [process.env.BETTER_AUTH_URL!],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      requireEmailVerification: true,
      autoSignIn: false,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        await sendMail(
          user.email,
          "Reset your Madison Hill Nails password",
          `Reset your password using this link:\n${url}\n\nIf you didn't request this, ignore this email.`,
        );
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: false,
      expiresIn: 3600,
      sendVerificationEmail: async ({ user, url }) => {
        await sendMail(
          user.email,
          "Verify your Madison Hill Nails email",
          `Confirm your email before booking:\n${url}\n\nThis link expires in one hour. If you didn't request this, ignore this email.`,
        );
      },
    },
    session: { expiresIn: 60 * 60 * 24 * 7, cookieCache: { enabled: false } },
    advanced: { ipAddress: { ipAddressHeaders: ["x-mhn-client-ip"] } },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 30,
      customRules: {
        "/sign-up/email": { window: 3600, max: 5 },
        "/sign-in/email": { window: 60, max: 5 },
        "/request-password-reset": { window: 3600, max: 5 },
        "/send-verification-email": { window: 3600, max: 5 },
        "/two-factor/*": { window: 60, max: 5 },
      },
    },
    plugins: [twoFactor({ issuer: "Madison Hill Nails" })],
  });
}
let instance: ReturnType<typeof createAuth> | undefined;
export const auth = () => (instance ??= createAuth());
export async function currentSession(requestHeaders?: Headers) {
  if (!configured()) return null;
  return auth().api.getSession({
    headers: requestHeaders ?? (await headers()),
  });
}
export async function actor(requestHeaders?: Headers) {
  const session = await currentSession(requestHeaders);
  if (!session?.user.emailVerified) return null;
  const { rows } = await database().query(
    `select r.role, exists(select 1 from restricted_accounts where user_id=$1) blocked,
    exists(select 1 from staff_session_verifications where session_id=$2 and verified_at > now()-interval '12 hours') stepped_up
    from (select 1) x left join staff_roles r on r.user_id=$1`,
    [session.user.id, session.session.id],
  );
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: rows[0].role as string | null,
    staff: Boolean(
      rows[0].role && session.user.twoFactorEnabled && rows[0].stepped_up,
    ),
    blocked: Boolean(rows[0].blocked),
    session,
  };
}
export async function requireUser(next = "/appointments") {
  const user = await actor();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}
export async function requireStaff() {
  const user = await requireUser("/admin");
  if (!user.role) redirect("/appointments");
  if (!user.staff) redirect("/account/security?next=/admin");
  return user;
}
