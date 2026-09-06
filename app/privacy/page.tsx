export const metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <main id="main" className="app-page prose">
      <span className="eyebrow">YOUR INFORMATION</span>
      <h1>A little care for your privacy.</h1>
      <p>
        This notice describes the website’s intended booking features. Online
        booking remains closed until the salon completes setup and reviews this
        notice.
      </p>
      <h2>What the booking system uses</h2>
      <p>
        When you create an account or book, the system uses your name, email,
        contact phone number, appointment details, and account-security
        information. Passwords are hashed. The website does not collect
        credit-card details or payments.
      </p>
      <h2>Why it is used</h2>
      <p>
        Account information supports login, email verification, appointment
        management, and abuse prevention. Authorized staff can access
        appointment information to manage the salon schedule. Phone numbers are
        contact details; text verification and text reminders are not enabled.
      </p>
      <h2>Cookies and service providers</h2>
      <p>
        Essential cookies keep you signed in and support account security. The
        initial website does not include advertising trackers or third-party
        social-media embeds. The planned hosting providers are Netlify and
        Supabase, with email delivery to be configured before launch. Opening
        directions takes you to Google Maps, which has its own privacy
        practices.
      </p>
      <h2>Email and your choices</h2>
      <p>
        Verification and account-recovery emails support account access.
        Appointment emails relate to visits you book; they are not a newsletter
        signup. Marketing email is not part of this release.
      </p>
      <h2>Help with your information</h2>
      <p>
        For help correcting or deleting your information, visit Madison Hill
        Nails at 349 Main St, Madison, NJ 07940. A verified contact channel and
        the salon’s data-retention schedule must be added to this notice before
        public booking opens.
      </p>
    </main>
  );
}
