import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    rules:
      process.env.SITE_INDEXABLE === "true"
        ? {
            userAgent: "*",
            allow: "/",
            disallow: [
              "/admin",
              "/appointments",
              "/account",
              "/login",
              "/book",
              "/api/",
            ],
          }
        : { userAgent: "*", disallow: "/" },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
