import type { PackageSlug } from "./packages";

export type AnswerInput = {
  questionId: number;
  text: string | null;
  scale: number | null;
};

/**
 * Bepaal welk pakket het beste past op basis van de vragenlijst-antwoorden
 * van een klant. Pure heuristiek — geen LLM, geen API-calls.
 *
 * Logica:
 * - Lage rust/duidelijkheid scores (1-4) → urgent, klein eerste pakket = ikigai (€97)
 * - Middelmatige scores + behoefte aan structuur → alignment (€397)
 * - Diepe transformatie-vraag of hoge scores op alle assen → experience (€1997)
 * - Default fallback: ikigai (laagste drempel)
 *
 * Returns ook een korte persoonlijke "reden" die in de UI getoond wordt.
 */
export function recommendPackage(answers: AnswerInput[]): {
  slug: PackageSlug;
  reason: string;
} {
  const scales = answers
    .map((a) => a.scale)
    .filter((s): s is number => typeof s === "number" && s > 0);

  const avgScale =
    scales.length > 0
      ? scales.reduce((a, b) => a + b, 0) / scales.length
      : null;

  const allText = answers
    .map((a) => (a.text ?? "").toLowerCase())
    .join(" ");

  // Sleutelwoorden die wijzen op diepere transformatie-behoefte
  const deepWords = [
    "burn-out",
    "burnout",
    "uitgeput",
    "vastgelopen",
    "compleet vast",
    "alles veranderen",
    "transformatie",
    "opnieuw beginnen",
    "weet niet meer wie",
  ];
  const structureWords = [
    "structuur",
    "ritme",
    "gewoontes",
    "balans",
    "grenzen",
    "overzicht",
    "rust in mijn hoofd",
  ];
  const clarityWords = [
    "richting",
    "wie ben ik",
    "wat wil ik",
    "doelen",
    "dromen",
    "ikigai",
    "duidelijkheid",
  ];

  const wantsDeep = deepWords.some((w) => allText.includes(w));
  const wantsStructure = structureWords.some((w) => allText.includes(w));
  const wantsClarity = clarityWords.some((w) => allText.includes(w));

  // Sterke transformatie-signaal of gemiddelde scale heel laag (≤3) én meerdere assen genoemd:
  if (wantsDeep && avgScale !== null && avgScale <= 4) {
    return {
      slug: "experience",
      reason:
        "Op basis van wat je deelde voel ik dat je toe bent aan een echte reset — geen losse stappen, maar acht dagen volledig uit je dagelijkse leven met persoonlijke begeleiding.",
    };
  }

  // Middelmatige scores of behoefte aan structuur → alignment
  if (wantsStructure || (avgScale !== null && avgScale >= 4 && avgScale <= 6)) {
    return {
      slug: "alignment",
      reason:
        "Je weet vaak wel wat je wilt — het ontbreekt aan structuur en ritme. Dit pakket bouwt die fundering met je, met lichte begeleiding van Marion.",
    };
  }

  // Helderheid zoekend, of geen sterke signalen → ikigai (toegankelijke start)
  if (wantsClarity || avgScale === null || avgScale >= 7) {
    return {
      slug: "ikigai",
      reason:
        "Je staat vooral aan het begin van iets — laat dit pakket je helderheid geven over wie je bent, wat je wilt, en welke kant je opbeweegt. Een zachte eerste stap.",
    };
  }

  // Default fallback
  return {
    slug: "ikigai",
    reason:
      "Een zachte eerste stap die helderheid brengt over wat je écht wilt — en waar je naartoe beweegt.",
  };
}
