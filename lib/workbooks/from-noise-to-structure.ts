import type { Workbook, Translatable } from "./types";

const t = (nl: string, en: string): Translatable => ({ nl, en });
const ta = (nl: string[], en: string[]): Translatable<string[]> => ({ nl, en });

export const FROM_NOISE_TO_STRUCTURE: Workbook = {
  slug: "from-noise-to-structure",
  title: t("From Noise to Structure", "From Noise to Structure"),
  scriptTitle: t("the calm of clarity", "the calm of clarity"),
  brand: t("From Noise to Structure", "From Noise to Structure"),
  cover: {
    eyebrow: t("A Workbook", "A Workbook"),
    title: ta(["From Noise", "to Structure"], ["From Noise", "to Structure"]),
    script: t("the calm of clarity", "the calm of clarity"),
    sub: t("Bouw structuur, vind balans", "Build structure, find balance"),
    scriptSub: t("your life, gently designed", "your life, gently designed"),
    author: "Marion Lubach",
    role: t("your creative lifestyle mentor", "your creative lifestyle mentor"),
  },
  pages: [
    {
      number: 2,
      layout: "centered",
      blocks: [
        { type: "kicker", text: t("welcome", "welcome") },
        { type: "title", text: t("Even ademen", "Take a breath"), size: "lg" },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: ta(
            [
              "Dit werkboek is in de maak.",
              "Marion vult het binnenkort met de oefeningen\ndie horen bij Pakket 2 — From Insight to Alignment.",
            ],
            [
              "This workbook is in the making.",
              "Marion will fill it soon with the exercises\nfor Package 2 — From Insight to Alignment.",
            ]
          ),
        },
      ],
    },
  ],
};
