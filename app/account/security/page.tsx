export const dynamic = "force-dynamic";
import { requireUser } from "@/lib/auth";
import { SecurityForm } from "@/components/auth-forms";
import { safeNext } from "@/lib/validation";
export const metadata = {
  title: "Account security",
  robots: { index: false, follow: false },
};
export default async function Security({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const who = await requireUser("/account/security");
  const p = await searchParams;
  return (
    <main id="main" className="app-page">
      <SecurityForm
        enabled={Boolean(who.session.user.twoFactorEnabled)}
        next={safeNext(p.next)}
      />
    </main>
  );
}
