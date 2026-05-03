import type { Metadata } from "next";
import { LOCALES, type Locale } from "./i18n/types";

function normalizeSiteUrl(raw: string | undefined): string {
  const fallback = "https://thebeautifullife.nl";
  if (!raw) return fallback;
  let v = raw.trim().replace(/\/$/, "");
  if (!v) return fallback;
  // Voeg protocol toe als het mist (bv. "thebeautifullife.vercel.app")
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  // Valideer; als het nog steeds geen geldige URL is, val terug.
  try {
    return new URL(v).origin;
  } catch {
    return fallback;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

const HREFLANG_MAP: Record<Locale, string> = {
  nl: "nl-NL",
  en: "en",
};

// Build alternates.languages map for a given canonical path.
// We use the same path for all locales (cookie-based locale switch).
export function buildAlternates(path: string) {
  const canonical = `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[HREFLANG_MAP[l]] = canonical;
  }
  languages["x-default"] = canonical;
  return { canonical, languages };
}

export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  ogImage?: string;
  noindex?: boolean;
}): Metadata {
  const { canonical, languages } = buildAlternates(opts.path);
  const ogLocale = opts.locale === "nl" ? "nl_NL" : "en_US";
  return {
    title: opts.title,
    description: opts.description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical, languages },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: canonical,
      type: "website",
      locale: ogLocale,
      siteName: "The Beautiful Life",
      images: opts.ogImage ? [{ url: opts.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: opts.ogImage ? [opts.ogImage] : undefined,
    },
    robots: opts.noindex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: { index: false, follow: false },
        }
      : { index: true, follow: true },
  };
}

// JSON-LD helpers
export const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Beautiful Life",
  alternateName: "The Beautiful Life Coaching Collective",
  url: SITE_URL,
  email: "contact@thebeautifullife.nl",
  founder: {
    "@type": "Person",
    name: "Marion Lubach",
    jobTitle: "Creative Lifestyle Mentor",
  },
  sameAs: ["https://instagram.com/thebeautifullife"],
};

export const PERSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marion Lubach",
  jobTitle: "Creative Lifestyle Mentor",
  worksFor: {
    "@type": "Organization",
    name: "The Beautiful Life",
    url: SITE_URL,
  },
  url: SITE_URL,
};

export function serviceLd({
  name,
  description,
  priceCents,
  slug,
  locale,
}: {
  name: string;
  description: string;
  priceCents: number;
  slug: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "The Beautiful Life",
      url: SITE_URL,
    },
    serviceType: "Life coaching",
    inLanguage: locale,
    url: `${SITE_URL}/pakket/${slug}`,
    offers: {
      "@type": "Offer",
      price: (priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/pakket/${slug}`,
    },
  };
}

export function jsonLd(data: object | object[]): string {
  return JSON.stringify(Array.isArray(data) ? data : [data]);
}

/**
 * Product schema voor pakketten — geeft Google rijke kaarten met prijs,
 * beschikbaarheid en afbeelding in de zoekresultaten. Gebruikt naast
 * serviceLd() voor extra dekking.
 */
export function productLd({
  name,
  description,
  priceCents,
  slug,
  imageUrl,
  locale,
}: {
  name: string;
  description: string;
  priceCents: number;
  slug: string;
  imageUrl?: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: imageUrl ? [imageUrl] : undefined,
    brand: {
      "@type": "Brand",
      name: "The Beautiful Life",
    },
    inLanguage: locale,
    url: `${SITE_URL}/pakket/${slug}`,
    offers: {
      "@type": "Offer",
      price: (priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/pakket/${slug}`,
      seller: {
        "@type": "Organization",
        name: "The Beautiful Life",
      },
    },
  };
}

/**
 * FAQPage schema — Google kan de FAQ-vragen direct in zoekresultaten tonen.
 */
export function faqPageLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };
}

/**
 * BreadcrumbList — helpt Google de site-hiërarchie begrijpen.
 */
export function breadcrumbLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path === "/" ? "" : c.path}`,
    })),
  };
}

/**
 * WebSite schema met SearchAction — kan sitelinks searchbox triggeren in Google.
 */
export const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Beautiful Life",
  url: SITE_URL,
  inLanguage: ["nl-NL", "en"],
  publisher: {
    "@type": "Organization",
    name: "The Beautiful Life",
  },
};
