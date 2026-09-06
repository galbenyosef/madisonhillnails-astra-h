import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin || process.env.SITE_INDEXABLE !== "true") return [];
  return ["", "/privacy", "/policies"].map((path) => ({
    url: `${origin}${path}`,
    changeFrequency: "monthly" as const,
    priority: path ? 0.3 : 1,
  }));
}
