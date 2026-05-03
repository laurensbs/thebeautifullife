/**
 * Hulpfunctie om de site-fonts (Cormorant Garamond, Pinyon Script) te laden
 * voor next/og ImageResponse.
 *
 * Gebruikt Node runtime + fs.readFileSync om TTF direct van disk te lezen.
 * Edge runtime + fetch naar /fonts/ faalt op Vercel door domein-redirects
 * (apex → www) waardoor de font-fetch een lege body retourneert.
 *
 * TTF (niet WOFF2) — next/og's font decoder accepteert alleen TTF/OTF.
 */

import fs from "node:fs";
import path from "node:path";

const cache = new Map<string, ArrayBuffer>();

function loadFont(filename: string): ArrayBuffer {
  if (cache.has(filename)) return cache.get(filename)!;
  const filePath = path.join(process.cwd(), "public", "fonts", filename);
  const buffer = fs.readFileSync(filePath);
  // Node Buffer → standalone ArrayBuffer (sliced om de exacte view te krijgen)
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
  cache.set(filename, arrayBuffer);
  return arrayBuffer;
}

export function loadOgFonts() {
  const cormorant = loadFont("cormorant-regular.ttf");
  const cormorantMedium = loadFont("cormorant-medium.ttf");
  const pinyon = loadFont("pinyon-regular.ttf");
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
