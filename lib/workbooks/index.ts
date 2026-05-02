import type { PackageSlug } from "@/lib/packages";
import type { Workbook } from "./types";
import { RETURN_TO_CALM } from "./return-to-calm";
import { FROM_NOISE_TO_STRUCTURE } from "./from-noise-to-structure";

export const WORKBOOKS: Record<string, Workbook> = {
  "return-to-calm": RETURN_TO_CALM,
  "from-noise-to-structure": FROM_NOISE_TO_STRUCTURE,
};

// Welk werkboek hoort bij welk pakket?
// Pakket 1 (Ikigai)     → Return to Calm
// Pakket 2 (Alignment)  → From Noise to Structure
// Pakket 3 (Experience) → Return to Calm (zachte voorbereiding)
export const PACKAGE_WORKBOOKS: Record<PackageSlug, string[]> = {
  ikigai: ["return-to-calm"],
  alignment: ["from-noise-to-structure"],
  experience: ["return-to-calm"],
};

export function getWorkbook(slug: string): Workbook | null {
  return WORKBOOKS[slug] ?? null;
}

// Verzamelt alle field-keys uit een werkboek (voor de admin: percentage ingevuld)
export function workbookFieldKeys(workbook: Workbook): string[] {
  const keys: string[] = [];
  for (const page of workbook.pages) {
    for (const b of page.blocks) {
      if (b.type === "field") keys.push(b.key);
    }
  }
  return keys;
}
