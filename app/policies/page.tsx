import { catalog } from "@/lib/data";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Booking policies",
  alternates: { canonical: "/policies" },
};
export default async function Policies() {
  const data = await catalog();
  return (
    <main id="main" className="app-page prose">
      <span className="eyebrow">BEFORE YOUR VISIT</span>
      <h1>A little planning helps.</h1>
      <h2>Booking an appointment</h2>
      <p>
        Online booking requires an account with a verified email. Your
        appointment is booked only after the website confirms it; selecting a
        time does not reserve it.
      </p>
      <h2>Changes and cancellations</h2>
      {data?.settings.online_booking_enabled ? (
        <>
          <p>{data.settings.policy_text}</p>
          <p>
            You can make online changes or cancellations until{" "}
            {data.settings.cancellation_hours} hours before your appointment.
            After that, please visit the salon for assistance. Staff can help
            manage manually entered appointments.
          </p>
        </>
      ) : (
        <p>
          Online booking is not open yet. The salon’s cancellation window and
          booking rules will appear here once confirmed. Visit the salon for
          current appointment assistance.
        </p>
      )}
      <h2>Payments</h2>
      <p>
        This website does not collect cards, deposits, payments, or automatic
        cancellation fees.
      </p>
      <h2>Availability</h2>
      <p>
        All appointment times use Eastern Time in Madison, New Jersey. If your
        preferred time is unavailable, choose another day or technician. If
        online booking is temporarily unavailable, visit Madison Hill Nails at
        349 Main St, Madison, NJ 07940 for assistance.
      </p>
    </main>
  );
}
