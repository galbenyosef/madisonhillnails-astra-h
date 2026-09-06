import Link from "next/link";
import { ArrowUpRight, Asterisk } from "lucide-react";
import { WhiteHero } from "@/components/white-hero";
import { SalonGallery } from "@/components/salon-gallery";
import { ColorStudio } from "@/components/color-studio";
import { catalog } from "@/lib/data";
import { money } from "@/lib/format";
export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };
export default async function Home() {
  const menu = await catalog();
  const schema = {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    name: "Madison Hill Nails",
    sameAs: ["https://www.instagram.com/madisonhillnails/"],
    description:
      "Nail care, pedicures, and spa treatments in Madison, New Jersey.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "349 Main St",
      addressLocality: "Madison",
      addressRegion: "NJ",
      postalCode: "07940",
      addressCountry: "US",
    },
    ...(process.env.NEXT_PUBLIC_SITE_URL
      ? { url: process.env.NEXT_PUBLIC_SITE_URL }
      : {}),
  };
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="editorial-home">
        <WhiteHero />
        <SalonGallery />
        <section id="ritual" className="edit-manifesto edit-wrap">
          <span className="edit-label">A SMALL RITUAL. A BIG FEELING.</span>
          <h2>
            For the everyday.
            <br />
            For the <em>why not.</em>
            <br />
            For <span className="outlined-word">you.</span>
            <Asterisk aria-hidden="true" />
          </h2>
          <div className="manifesto-foot">
            <span>01 — MAKE TIME</span>
            <p>
              Some things are worth slowing down for. A color you love. A moment
              to reset. That fresh-nails feeling, long after you leave.
            </p>
            <Link href="/book" className="edit-text-link">
              Find your next appointment <ArrowUpRight size={22} />
            </Link>
          </div>
        </section>
        <section id="services" className="edit-menu edit-wrap">
          <div className="edit-section-head">
            <span className="edit-label">THE APPOINTMENT EDIT</span>
            <h2>
              A little time.
              <br />
              <em>Your kind of care.</em>
            </h2>
          </div>
          <div className="edit-menu-layout">
            <div className="menu-aside">
              <span className="edit-label">02 — THE MENU</span>
              <p>
                Nail care, pedicures, and spa treatments. A little time for
                every part of you.
              </p>
              <Link className="button" href="/book">
                Explore appointments <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="menu-rows">
              {menu?.services.length ? (
                menu.services.map((service, i) => (
                  <article className="edit-service" key={service.id}>
                    <span className="service-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <span className="service-category">
                        {service.category}
                      </span>
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                      <span className="service-price">
                        {service.duration_minutes} min ·{" "}
                        {money(service.price_cents)}
                      </span>
                    </div>
                    <Link
                      href={`/book?service=${service.id}`}
                      aria-label={`Book ${service.name}`}
                      className="service-arrow"
                    >
                      <ArrowUpRight />
                    </Link>
                  </article>
                ))
              ) : (
                <>
                  <article className="edit-service">
                    <span className="service-index">01</span>
                    <div>
                      <h3>Nail care.</h3>
                      <p>A fresh color. A little self-expression.</p>
                    </div>
                    <Asterisk aria-hidden="true" />
                  </article>
                  <article className="edit-service">
                    <span className="service-index">02</span>
                    <div>
                      <h3>Pedicures.</h3>
                      <p>A little care for your feet—and time for yourself.</p>
                    </div>
                    <Asterisk aria-hidden="true" />
                  </article>
                  <article className="edit-service">
                    <span className="service-index">03</span>
                    <div>
                      <h3>Spa treatments.</h3>
                      <p>
                        Make space to unwind. Ask us about our current spa menu.
                      </p>
                    </div>
                    <Asterisk aria-hidden="true" />
                  </article>
                  <p className="edit-menu-note">
                    Our online menu is getting its finishing touches. Visit the
                    salon for current services, pricing, and availability.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
        <section id="color" className="edit-color">
          <div className="edit-wrap color-heading">
            <span className="edit-label">03 — THE COLOR STORY</span>
            <h2>
              Life in
              <br />
              <em>full color.</em>
            </h2>
            <p>
              Follow a feeling.
              <br />
              Find your next favorite.
            </p>
          </div>
          <div className="edit-wrap">
            <ColorStudio />
            <p className="art-credit">
              Color samples are for inspiration. Ask us about current shades and
              designs.
            </p>
          </div>
        </section>
        <section className="edit-local edit-wrap">
          <div className="local-address-art" aria-hidden="true">
            <Asterisk />
            <span>YOUR LITTLE CORNER OF MADISON</span>
            <strong>
              Meet you
              <br />
              <em>on Main.</em>
            </strong>
            <span>349 MAIN STREET · MADISON, NJ</span>
          </div>
          <div className="local-copy">
            <span className="edit-label">04 — YOUR NEIGHBORHOOD RITUAL</span>
            <h2>
              A little pause.
              <br />
              <em>
                Right here
                <br />
                in Madison.
              </em>
            </h2>
            <p>
              Between the errands and the everyday, make a little room for
              yourself. From nail care and pedicures to spa treatments, find
              your next moment of relaxation at Madison Hill Nails on Main
              Street.
            </p>
            <Link className="edit-text-link" href="#visit">
              Come on over <ArrowUpRight size={22} />
            </Link>
          </div>
        </section>
        <section id="visit" className="edit-visit edit-wrap">
          <div className="visit-heading">
            <span className="edit-label">YOUR NEXT GOOD NAIL DAY</span>
            <h2>
              See you
              <br />
              <em>on Main.</em>
              <ArrowUpRight aria-hidden="true" />
            </h2>
          </div>
          <div className="visit-details">
            <address>
              Madison Hill Nails
              <br />
              349 Main St
              <br />
              Madison, NJ 07940
            </address>
            <p>
              Visit the salon for current opening hours and walk-in
              availability.
            </p>
            <a
              className="edit-text-link"
              href="https://www.google.com/maps/search/?api=1&query=Madison+Hill+Nails+349+Main+St+Madison+NJ+07940"
              target="_blank"
              rel="noreferrer"
            >
              Get directions <ArrowUpRight size={20} />
              <span className="sr-only"> (opens a new tab)</span>
            </a>
          </div>
          <div className="faq">
            <span className="edit-label">A FEW GOOD THINGS TO KNOW</span>
            <h3>Before your visit.</h3>
            <details>
              <summary>How do I book an appointment?</summary>
              <p>
                Use our booking page to see whether online appointments are
                open. When available, choose a service and time, sign in with a
                verified email, and confirm your appointment.
              </p>
            </details>
            <details>
              <summary>Can I change my appointment?</summary>
              <p>
                Sign in to My appointments to reschedule or cancel. Changes
                close to your visit may require staff assistance; the booking
                policy shows the current cutoff.
              </p>
            </details>
            <details>
              <summary>Do I need to enter a credit card?</summary>
              <p>
                No. This website does not collect payment or credit-card
                details.
              </p>
            </details>
          </div>
        </section>
        <div className="mobile-book">
          <Link className="button" href="/book">
            Book your next mood <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
