import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Niet-publieke / persoonlijke routes uitsluiten
        disallow: [
          "/admin",
          "/admin/*",
          "/mijn-pad",
          "/mijn-pad/*",
          "/werkboek",
          "/werkboek/*",
          "/vragenlijst",
          "/bedankt",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
