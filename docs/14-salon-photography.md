# Salon photography and source record

The owner supplied [Madison Hill Nails on Instagram](https://www.instagram.com/madisonhillnails/) for real nail images during the website build. The public profile identifies itself as Madison Hill Nails. Its visible grid and individual linked posts were inspected in a fresh browser session without login or saved account credentials.

## Selected photographs

The following public nail photos replace generated photography in the current website. The published JPEG files are copied from the largest image candidates exposed by the individual posts' image elements, rather than the cropped social-preview images. No generative edits, recoloring, retouching, or invented nail details were applied.

| Local file | Dimensions | Content and placement | Original post |
| --- | --- | --- | --- |
| `public/images/salon-mint-chocolate.jpg` | 3024 × 2607 | Mint, chocolate, and polka-dot almond nails; gallery and social preview | [Dc7V_RUNYvq](https://www.instagram.com/p/Dc7V_RUNYvq/) |
| `public/images/salon-pink-yellow.jpg` | 2160 × 2029 | Pink French tips, yellow accents, and white details; gallery | [DbOMGqqRXX8](https://www.instagram.com/p/DbOMGqqRXX8/) |
| `public/images/salon-pink-waves.jpg` | 3072 × 4096 | Pink/yellow waves and white palm details; gallery | [DbEhQ4dxSRQ](https://www.instagram.com/p/DbEhQ4dxSRQ/) |
| `public/images/salon-yellow-floral.jpg` | 1635 × 1641 | Yellow tips and white floral details; gallery | [DaF-Ngtx0N6](https://www.instagram.com/p/DaF-Ngtx0N6/) |

The selected source files total approximately 2.1 MB. Metadata inspection found no EXIF blocks. Photos show hands and nail art; no faces, account login state, client appointment records, or customer contact details are included. The owner supplied this account as the image source for the site; the photos are not represented as public-domain or stock assets.

## Presentation

- All four salon photos are now grouped in a dedicated `#gallery` section, with four columns on desktop, two on tablets, and one on narrow phones. Each has a caption and original Instagram post link. Images retain their proportions and show the complete nail designs.
- The hero is now a clean white composition with code-native decorative shapes and subtle parallax; it contains no salon photographs. The gallery stays stationary. See [the current hero/gallery design record](15-white-hero-and-gallery.md).
- Captions identify the photos as the salon's work. The previous generated-imagery disclaimer has been replaced. The separate interactive CSS polish samples remain labeled as inspiration, without promising exact shade availability.
- The footer links to the owner-confirmed profile. NailSalon structured data includes this profile in `sameAs`; the social preview uses an actual salon photograph.
- Photographs are served from local project files using responsive Next/Image optimization. No embedded feed, Instagram JavaScript, external image hotlink, account connection, scheduled importer, or paid service was added.
- Download responses, signed CDN URLs, and browser review artifacts remain in ignored local cache files. Only stable public post/profile links and selected image files belong in GitHub.

The earlier generated PNG files are retained unused as design history. Black NAILS & SPA branding, native scrolling, verified service copy, authentication, scheduling, and the $0 constraint remain in place. Public-profile hours, prices from promotional posts, and additional treatment claims were not imported as live operating data.

## Validation

All eight existing desktop/mobile browser checks passed after the initial photo integration. The subsequent white hero and dedicated gallery update passed ten browser checks, including photo loading, navigation, responsive width, metadata, automated accessibility, and motion behavior; see [current validation](12-validation.md). Desktop and mobile screenshots were inspected with the new images loaded. Original source posts were loaded during retrieval, and the website links use their stable post IDs. Type checking and lint passed. Selected source files were verified as JPEGs without EXIF blocks. Staged/history secret scans run before publication. Live booking configuration and production deployment remain pending separately.
