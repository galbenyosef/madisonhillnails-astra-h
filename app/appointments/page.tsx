export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { database } from "@/lib/db";
import type { Appointment } from "@/lib/types";
import { salonDate } from "@/lib/format";
import { CancelButton } from "@/components/booking-form";
import { SignOut } from "@/components/auth-forms";
export const metadata = {
  title: "My appointments",
  robots: { index: false, follow: false },
};
export default async function Appointments() {
  const user = await requireUser();
  const { rows } = await database().query<Appointment & { is_future: boolean }>(
    "select *,start_at>now() is_future from appointments where customer_id=$1 order by start_at desc limit 100",
    [user.id],
  );
  return (
    <main id="main" className="app-page">
      <div className="app-heading">
        <div>
          <span className="eyebrow">HELLO, {user.name.toUpperCase()}</span>
          <h1>Your little moments.</h1>
          <p>Manage your appointments. All times are Eastern Time.</p>
        </div>
        <div className="actions">
          {user.role && (
            <Link className="text-link" href="/admin">
              Staff dashboard
            </Link>
          )}
          <Link className="text-link" href="/account/security">
            Account security
          </Link>
          <SignOut />
        </div>
      </div>
      {user.blocked && (
        <div className="notice">
          Online booking is restricted for this account. Please visit the salon
          for assistance. You can still review or cancel existing appointments
          within the policy.
        </div>
      )}
      <div className="actions" style={{ marginBottom: 25 }}>
        <Link className="button" href="/book">
          Book your next visit ↗
        </Link>
      </div>
      {rows.length ? (
        <div className="appointment-list">
          {rows.map((a) => (
            <article className="panel appointment-card" key={a.id}>
              <div>
                <span className={`badge ${a.status}`}>
                  {a.status.replace("_", " ")}
                </span>
                <h3>{a.service_name}</h3>
                <p>
                  {salonDate(a.start_at)} · {salonDate(a.end_at, "h:mm a")}
                </p>
                <p>With {a.technician_name}</p>
              </div>
              {a.status === "confirmed" && a.is_future && (
                <div className="actions">
                  <Link
                    href={`/book?edit=${a.id}`}
                    className="button secondary"
                  >
                    Reschedule
                  </Link>
                  <CancelButton appointment={{ ...a, notes: "" }} />
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>Your next color is waiting.</h2>
          <p>
            You haven’t booked an online appointment yet. Staff-entered
            appointments are managed by the salon.
          </p>
        </div>
      )}
    </main>
  );
}
