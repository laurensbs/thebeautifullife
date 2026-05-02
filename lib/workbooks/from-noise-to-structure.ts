import type { Workbook } from "./types";

// Skeleton voor het Alignment-werkboek. Inhoud wordt later aangevuld door Marion.
export const FROM_NOISE_TO_STRUCTURE: Workbook = {
  slug: "from-noise-to-structure",
  title: "From Noise to Structure",
  scriptTitle: "the calm of clarity",
  brand: "From Noise to Structure",
  cover: {
    eyebrow: "A Workbook",
    title: ["From Noise", "to Structure"],
    script: "the calm of clarity",
    sub: "Bouw structuur, vind balans",
    scriptSub: "your life, gently designed",
    author: "Marion Lubach",
    role: "your creative lifestyle mentor",
  },
  pages: [
    {
      number: 2,
      layout: "centered",
      blocks: [
        { type: "kicker", text: "welcome" },
        { type: "title", text: "Even ademen", size: "lg" },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: [
            "Dit werkboek is in de maak.",
            "Marion vult het binnenkort met de oefeningen\ndie horen bij Pakket 2 — From Insight to Alignment.",
          ],
        },
      ],
    },
  ],
};
