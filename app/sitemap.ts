import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const PUBLIC_PATHS = [
  { path: "/", priority: 1.0, freq: "weekly" as const },
  { path: "/pakket/ikigai", priority: 0.9, freq: "monthly" as const },
  { path: "/pakket/alignment", priority: 0.9, freq: "monthly" as const },
  { path: "/pakket/experience", priority: 0.9, freq: "monthly" as const },
  { path: "/gratis", priority: 0.7, freq: "monthly" as const },
  { path: "/voorwaarden", priority: 0.3, freq: "yearly" as const },
  { path: "/privacy", priority: 0.3, freq: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PUBLIC_PATHS.map(({ path, priority, freq }) => {
    const url = `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;
    return {
      url,
      lastModified: now,
      changeFrequency: freq,
      priority,
      alternates: {
        languages: {
          "nl-NL": url,
          en: url,
          "x-default": url,
        },
      },
    };
  });
}
