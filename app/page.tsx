import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  MapPin,
  Sparkles,
  Flower2,
  Heart,
} from "lucide-react";
import { ColorStudio, Parallax } from "@/components/color-studio";
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
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="location-tag">
            <span /> YOUR LITTLE CORNER OF MADISON, NJ
          </span>
          <h1>
            Your day.
            <br />A little
            <br />
            <em>brighter.</em>
            <Sparkles className="hero-spark" aria-hidden="true" />
          </h1>
          <p>
            A fresh color. A deep breath. A little time that’s just for you.
            Welcome to Madison Hill Nails.
          </p>
          <div className="hero-actions">
            <Link href="/book" className="button">
              Find your next appointment <ArrowUpRight size={20} />
            </Link>
            <Link href="#services" className="text-link">
              Explore the menu <ArrowDown size={15} />
            </Link>
          </div>
          <div className="hero-location">
            <MapPin size={16} /> 349 Main St · Madison, New Jersey
          </div>
        </div>
        <div className="hero-art">
          <Parallax>
            <Image
              src="/images/color-study.png"
              alt="Cherry red and lilac nail polish in a colorful decorative still life"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 48vw"
            />
          </Parallax>
          <div className="round-sticker">
            <Flower2 size={33} strokeWidth={1.4} />
            <span>
              GOOD COLOR.
              <br />
              GOOD MOOD.
            </span>
          </div>
          <span className="image-caption">A LITTLE COLOR INSPIRATION</span>
        </div>
      </section>
      <div className="ribbon" aria-hidden="true">
        <span>A LITTLE POLISH</span>
        <Flower2 />
        <span>A LITTLE PAUSE</span>
        <Flower2 />
        <span>A WHOLE LOT OF YOU</span>
        <Flower2 />
        <span>A LITTLE POLISH</span>
      </div>
      <section id="services" className="section wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / THE MENU</span>
            <h2>
              Make room for
              <br />
              <em>a little ritual.</em>
            </h2>
          </div>
          <p>
            From your everyday look to your next special occasion, your
            appointment starts here.
          </p>
        </div>
        {menu?.services.length ? (
          <div className="service-grid">
            {menu.services.map((s, i) => (
              <article className={`service-card tone-${i % 3}`} key={s.id}>
                <span className="eyebrow">{s.category}</span>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <div className="service-meta">
                  <span>
                    {s.duration_minutes} min · {money(s.price_cents)}
                  </span>
                  <Link
                    href={`/book?service=${s.id}`}
                    aria-label={`Book ${s.name}`}
                  >
                    <ArrowUpRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="service-grid">
            <article className="service-card tone-0">
              <Flower2 size={36} />
              <h3>The everyday reset.</h3>
              <p>
                Make a little room in your routine for nail care and a fresh
                perspective.
              </p>
              <span className="card-number">01</span>
            </article>
            <article className="service-card tone-1">
              <Sparkles size={36} />
              <h3>A reason to dress up.</h3>
              <p>
                A celebration on the calendar? Bring your ideas for your next
                appointment.
              </p>
              <span className="card-number">02</span>
            </article>
            <article className="service-card tone-2">
              <Heart size={36} />
              <h3>Something just for you.</h3>
              <p>
                That color you keep thinking about. That time you’ve been
                meaning to take.
              </p>
              <span className="card-number">03</span>
            </article>
          </div>
        )}
        {!menu?.services.length && (
          <p className="menu-note">
            Our online service menu is getting its finishing touches. Visit the
            salon for current services, pricing, and availability.
          </p>
        )}
      </section>
      <section id="color" className="color-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / THE COLOR STORY</span>
              <h2>
                Life’s too colorful
                <br />
                for <em>one shade.</em>
              </h2>
            </div>
            <p>
              Feeling bold? Keeping it soft? Play with a little inspiration for
              your next visit.
            </p>
          </div>
          <ColorStudio />
        </div>
      </section>
      <section className="section wrap about-section">
        <div className="about-symbol" aria-hidden="true">
          <Flower2 strokeWidth={0.65} />
          <span>
            TAKE A BREATH.
            <br />
            STAY A LITTLE.
          </span>
        </div>
        <div>
          <span className="eyebrow">03 / HELLO, MADISON</span>
          <h2>
            Your Main Street
            <br />
            <em>me-time.</em>
          </h2>
          <p>
            Some days call for a pop of color. Others call for a quiet moment in
            the middle of it all.
          </p>
          <p>
            Find Madison Hill Nails at 349 Main Street in Madison, New Jersey.
            Come with a color in mind—or a little room for inspiration.
          </p>
          <Link href="#visit" className="text-link">
            Find your way here <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section id="visit" className="section wrap visit-section">
        <div className="visit-card">
          <span className="eyebrow">04 / COME ON OVER</span>
          <h2>
            A little closer
            <br />
            to <em>your next color.</em>
          </h2>
          <address>
            349 Main St
            <br />
            Madison, NJ 07940
          </address>
          <p>
            Visit the salon for current opening hours and walk-in availability.
          </p>
          <a
            className="button"
            href="https://www.google.com/maps/search/?api=1&query=Madison+Hill+Nails+349+Main+St+Madison+NJ+07940"
            target="_blank"
            rel="noreferrer"
          >
            Get directions <ArrowUpRight size={18} />
            <span className="sr-only"> (opens a new tab)</span>
          </a>
        </div>
        <div className="faq">
          <span className="eyebrow">GOOD TO KNOW</span>
          <h3>Before you stop by.</h3>
          <details>
            <summary>How do I book an appointment?</summary>
            <p>
              Use our booking page to see whether online appointments are open.
              When available, choose a service and time, sign in with a verified
              email, and confirm your appointment.
            </p>
          </details>
          <details>
            <summary>Can I change my appointment?</summary>
            <p>
              Sign in to My appointments to reschedule or cancel. Changes close
              to your visit may require staff assistance; the booking policy
              shows the current cutoff.
            </p>
          </details>
          <details>
            <summary>Do I need to enter a credit card?</summary>
            <p>
              No. This website does not collect payment or credit-card details.
            </p>
          </details>
          <details>
            <summary>Where are you located?</summary>
            <p>
              Madison Hill Nails is at 349 Main St, Madison, NJ 07940. Use the
              directions link to plan your visit.
            </p>
          </details>
        </div>
      </section>
      <div className="mobile-book">
        <Link className="button" href="/book">
          Book a little me-time <ArrowUpRight size={18} />
        </Link>
      </div>
    </main>
  );
}
