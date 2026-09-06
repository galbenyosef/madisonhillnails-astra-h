import Link from "next/link";
import { AuthForm } from "@/components/auth-forms";
import { configured, mailConfigured } from "@/lib/db";
import { safeNext } from "@/lib/validation";
export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const p = await searchParams;
  return (
    <main id="main" className="app-page">
      {configured() && mailConfigured() ? (
        <AuthForm
          next={safeNext(p.next)}
          token={p.token}
          verified={p.verified === "1"}
        />
      ) : (
        <div className="auth-card notice">
          <h1 className="serif" style={{ fontSize: 36 }}>
            A little more time.
          </h1>
          <p>
            Online accounts and appointments are getting ready. Visit us at 349
            Main St in Madison for booking assistance.
          </p>
          <p>
            <Link href="/#visit">Plan your visit →</Link>
          </p>
        </div>
      )}
    </main>
  );
}
