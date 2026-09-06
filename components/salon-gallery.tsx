import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const photographs = [
  {
    file: "salon-mint-chocolate",
    title: "Mint, with a twist.",
    alt: "Mint, chocolate brown, and polka-dot almond nails by Madison Hill Nails",
    post: "Dc7V_RUNYvq",
    width: 3024,
    height: 2607,
  },
  {
    file: "salon-pink-waves",
    title: "A softer kind of statement.",
    alt: "Pink and yellow nails with flowing stripes and white palm details by Madison Hill Nails",
    post: "DbEhQ4dxSRQ",
    width: 3072,
    height: 4096,
  },
  {
    file: "salon-pink-yellow",
    title: "Hello, sunshine.",
    alt: "Pink French tips, yellow accent nails, and delicate white details by Madison Hill Nails",
    post: "DbOMGqqRXX8",
    width: 2160,
    height: 2029,
  },
  {
    file: "salon-yellow-floral",
    title: "The little details.",
    alt: "Yellow French tips with white floral details by Madison Hill Nails",
    post: "DaF-Ngtx0N6",
    width: 1635,
    height: 1641,
  },
];

export function SalonGallery() {
  return (
    <section
      id="gallery"
      className="salon-gallery edit-wrap"
      aria-labelledby="gallery-title"
    >
      <div className="salon-gallery-heading">
        <div>
          <span className="edit-label">THE GALLERY / MADE AT MADISON HILL</span>
          <h2 id="gallery-title">
            Our work.
            <br />
            <em>Your next idea.</em>
          </h2>
        </div>
        <div className="gallery-intro">
          <p>
            A few favorites from our salon.
            <br />
            Find a detail, a color, a little inspiration.
          </p>
          <a
            className="edit-text-link"
            href="https://www.instagram.com/madisonhillnails/"
            target="_blank"
            rel="noreferrer"
          >
            Follow @madisonhillnails <ArrowUpRight size={18} />
            <span className="sr-only"> (opens a new tab)</span>
          </a>
        </div>
      </div>
      <div className="salon-gallery-grid">
        {photographs.map((photo, i) => (
          <figure className="salon-gallery-item" key={photo.file}>
            <a
              className="gallery-photo-link"
              href={`https://www.instagram.com/p/${photo.post}/`}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${photo.title} on Instagram (opens a new tab)`}
            >
              <Image
                src={`/images/${photo.file}.jpg`}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 540px) 100vw, (max-width: 900px) 45vw, 24vw"
              />
              <span className="gallery-view">
                <ArrowUpRight size={22} aria-hidden="true" />
              </span>
            </a>
            <figcaption>
              <span className="gallery-number">0{i + 1}</span>
              <span>{photo.title}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="gallery-footnote">
        Real nail work from Madison Hill Nails. Ask us about current shades and
        design availability.
      </p>
    </section>
  );
}
