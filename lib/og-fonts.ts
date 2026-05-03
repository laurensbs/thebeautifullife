/**
 * Hulpfuncties om de site-fonts (Cormorant Garamond, Pinyon Script) te laden
 * voor next/og ImageResponse. Via Google Fonts CSS API + WOFF2 → ArrayBuffer.
 *
 * Wordt gebruikt in /api/workbook/pdf en /visitekaartje/* zodat OG-images
 * écht de huisstijl-fonts gebruiken in plaats van Georgia/cursive fallback.
 */

const FONT_URLS = {
  cormorantRegular:
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&display=swap",
  cormorantMedium:
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&display=swap",
  pinyon:
    "https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap",
};

const cache = new Map<string, ArrayBuffer>();

async function fetchFont(cssUrl: string): Promise<ArrayBuffer> {
  if (cache.has(cssUrl)) return cache.get(cssUrl)!;

  // Vraag de CSS op met Chrome user-agent zodat Google WOFF2 teruggeeft
  // (fallback geeft TTF wat next/og niet leest).
  const cssRes = await fetch(cssUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const css = await cssRes.text();

  // Pak eerste woff2-URL uit de CSS
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]woff2['"]\)/);
  if (!match) throw new Error("Kon woff2 URL niet vinden in Google CSS");

  const fontRes = await fetch(match[1]);
  const buf = await fontRes.arrayBuffer();
  cache.set(cssUrl, buf);
  return buf;
}

export async function loadOgFonts() {
  const [cormorant, cormorantMedium, pinyon] = await Promise.all([
    fetchFont(FONT_URLS.cormorantRegular),
    fetchFont(FONT_URLS.cormorantMedium),
    fetchFont(FONT_URLS.pinyon),
  ]);
  return [
    {
      name: "Cormorant",
      data: cormorant,
      style: "normal" as const,
      weight: 400 as const,
    },
    {
      name: "Cormorant",
      data: cormorantMedium,
      style: "normal" as const,
      weight: 500 as const,
    },
    {
      name: "Pinyon",
      data: pinyon,
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}
