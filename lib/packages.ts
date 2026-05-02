export type PackageSlug = "ikigai" | "alignment" | "experience";

export type PackageStatus =
  // Pakket 1 (Ikigai) workflow
  | "aangemeld"
  | "betaald"
  | "vragenlijst_ingevuld"
  | "geleverd"
  // Pakket 2 (Alignment) extra
  | "call_gepland"
  | "plan_geleverd"
  // Pakket 3 (Experience) extra
  | "kennismaking_gepland"
  | "loopt"
  | "afgerond"
  // Generic
  | "geannuleerd";

export const PACKAGES: Record<
  PackageSlug,
  {
    slug: PackageSlug;
    number: 1 | 2 | 3;
    name: string;
    nameLines: [string, string?];
    kicker: string;
    tagline: string;
    priceLabel: string;
    priceCents: number;
    accent: "sage" | "tan" | "gold";
    quote: string;
    features: string[];
    statusFlow: PackageStatus[];
  }
> = {
  ikigai: {
    slug: "ikigai",
    number: 1,
    name: "The Ikigai Story",
    nameLines: ["The Ikigai Story"],
    kicker: "Package 1",
    tagline: "Ontdek wie je bent, wat je wilt en waar je naartoe gaat.",
    priceLabel: "€97",
    priceCents: 9700,
    accent: "sage",
    quote: "Helderheid is de eerste stap naar verandering.",
    features: [
      "Wie ben ik, werkelijk?",
      "Hoe ziet mijn ideale leven eruit?",
      "Wat zijn mijn doelen & dromen?",
      "Wat geeft mij energie?",
      "Ontdek je Ikigai",
      "Helderheid & richting in 3–5 stappen",
    ],
    statusFlow: ["aangemeld", "betaald", "vragenlijst_ingevuld", "geleverd"],
  },
  alignment: {
    slug: "alignment",
    number: 2,
    name: "From Insight to Alignment",
    nameLines: ["From Insight", "to Alignment"],
    kicker: "Package 2",
    tagline:
      "Bouw structuur, creëer rust en ontwerp een leven dat je ondersteunt.",
    priceLabel: "€397",
    priceCents: 39700,
    accent: "tan",
    quote: "Een leven dat bij jou past, niet andersom.",
    features: [
      "Maak je hoofd leeg & krijg overzicht",
      "Structuur die voor jou werkt",
      "Dagelijkse ritmes & gewoontes",
      "Grenzen stellen & balans vinden",
      "Lichte persoonlijke begeleiding",
      "Een praktisch plan voor je ideale leven",
    ],
    statusFlow: [
      "aangemeld",
      "betaald",
      "vragenlijst_ingevuld",
      "call_gepland",
      "plan_geleverd",
    ],
  },
  experience: {
    slug: "experience",
    number: 3,
    name: "The Beautiful Life Experience",
    nameLines: ["The Beautiful Life", "Experience"],
    kicker: "Package 3",
    tagline:
      "8 dagen transformatie & persoonlijke coaching om je droomleven te bouwen.",
    priceLabel: "€1.997",
    priceCents: 199700,
    accent: "gold",
    quote: "Reset. Reconnect. Recreate your life.",
    features: [
      "8-daagse Beautiful Life Experience",
      "Self-care & wellness pakket",
      "Luxe werkboek",
      "Ontspanning, vrije tijd & ervaringen",
      "1-op-1 persoonlijke coaching",
      "Persoonlijk levensplan",
      "De fundering van je ideale leven",
    ],
    statusFlow: [
      "aangemeld",
      "kennismaking_gepland",
      "betaald",
      "loopt",
      "afgerond",
    ],
  },
};

export const PACKAGE_LIST = [
  PACKAGES.ikigai,
  PACKAGES.alignment,
  PACKAGES.experience,
];

export const STATUS_LABELS: Record<PackageStatus, string> = {
  aangemeld: "Aangemeld",
  betaald: "Betaald",
  vragenlijst_ingevuld: "Vragenlijst ingevuld",
  geleverd: "Geleverd",
  call_gepland: "Call gepland",
  plan_geleverd: "Plan geleverd",
  kennismaking_gepland: "Kennismaking gepland",
  loopt: "Loopt",
  afgerond: "Afgerond",
  geannuleerd: "Geannuleerd",
};

export function isPackageSlug(v: unknown): v is PackageSlug {
  return v === "ikigai" || v === "alignment" || v === "experience";
}
