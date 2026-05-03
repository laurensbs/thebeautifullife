/**
 * Hulpfunctie om de site-fonts (Cormorant Garamond, Pinyon Script) te laden
 * voor next/og ImageResponse.
 *
 * TTF (niet WOFF2) — next/og's edge runtime ondersteunt TTF/OTF,
 * de WOFF2-decoder die in production was geprobeerd faalt met
 * 'Unsupported OpenType signature wOF2'.
 *
 * Bestanden staan in /public/fonts/ en worden via een absolute URL opgehaald
 * (zelfde origin als de request). Edge runtime mag fetch() maar geen fs.
 */

const cache = new Map<string, ArrayBuffer>();

async function loadFont(origin: string, filename: string): Promise<ArrayBuffer> {
  const url = `${origin}/fonts/${filename}`;
  if (cache.has(url)) return cache.get(url)!;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font fetch failed: ${url} → ${res.status}`);
  const buf = await res.arrayBuffer();
  cache.set(url, buf);
  return buf;
}

export async function loadOgFonts(origin: string) {
  const [cormorant, cormorantMedium, pinyon] = await Promise.all([
    loadFont(origin, "cormorant-regular.ttf"),
    loadFont(origin, "cormorant-medium.ttf"),
    loadFont(origin, "pinyon-regular.ttf"),
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
