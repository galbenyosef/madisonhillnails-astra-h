import Link from "next/link";
import { catalog } from "@/lib/data";
import { mailConfigured } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { database } from "@/lib/db";
import { ownAppointment } from "@/lib/scheduling";
import { BookingForm } from "@/components/booking-form";
export const metadata = {
  title: "Book an appointment",
  robots: { index: false, follow: false },
};
export default async function Book({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const p = await searchParams;
  const data = await catalog();
  if (!data || !data.settings.online_booking_enabled || !mailConfigured())
    return (
      <main id="main" className="app-page">
        <div className="app-heading">
          <div>
            <span className="eyebrow">YOUR NEXT VISIT</span>
            <h1>
              Good things take
              <br />
              <em>a little time.</em>
            </h1>
          </div>
        </div>
        <div className="notice">
          <h2 style={{ fontSize: 30 }}>Online booking is coming soon.</h2>
          <p>
            Visit Madison Hill Nails at 349 Main St, Madison, NJ for current
            availability and appointment assistance.
          </p>
          <p>
            <Link href="/#visit">Find the salon →</Link>
          </p>
        </div>
      </main>
    );
  const user = await requireUser(
    `/book${p.edit ? `?edit=${p.edit}` : p.service ? `?service=${p.service}` : ""}`,
  );
  let original;
  try {
    original = p.edit
      ? await ownAppointment(database(), user, p.edit)
      : undefined;
  } catch {
    return (
      <main id="main" className="app-page">
        <div className="notice">
          This appointment is unavailable.{" "}
          <Link href="/appointments">View your appointments.</Link>
        </div>
      </main>
    );
  }
  return (
    <main id="main" className="app-page">
      <div className="app-heading">
        <div>
          <span className="eyebrow">A LITTLE TIME FOR YOU</span>
          <h1>{original ? "A change of plans." : "Let’s make a date."}</h1>
          <p>Your next appointment, in a few simple steps.</p>
        </div>
        <Link className="text-link" href="/appointments">
          My appointments
        </Link>
      </div>
      {user.blocked ? (
        <div className="notice">
          Please visit the salon for help with your account.
        </div>
      ) : (
        <BookingForm
          catalog={data}
          user={user}
          serviceId={p.service}
          original={original}
        />
      )}
    </main>
  );
}
