// Each workbook page is a small DSL of blocks.
// The renderer turns this into JSX in components/workbook/WorkbookRenderer.tsx.

export type Block =
  | { type: "kicker"; text: string } // Pinyon script word in tan
  | { type: "eyebrow"; text: string } // small uppercase tracking label
  | { type: "title"; text: string; size?: "xl" | "lg" | "md" | "sm"; lines?: string[] }
  | { type: "rule"; align?: "center" | "left"; long?: boolean }
  | { type: "audioCue"; text: string }
  | { type: "lead"; paragraphs: string[]; center?: boolean; airy?: boolean }
  | { type: "scriptLine"; text: string; size?: number } // Pinyon line within prose
  | { type: "breath"; text: string } // big script "adem in. adem uit."
  | { type: "questions"; items: string[] }
  | {
      type: "field";
      key: string; // unique within page
      placeholder?: string;
      size?: "sm" | "md" | "lg" | "xl";
    }
  | { type: "spacer"; height?: number }
  | { type: "ctaCard"; eyebrow: string; title: string; body: string }
  | { type: "signature"; name: string; role: string };

export type WorkbookPage = {
  number: number; // page number printed
  layout?: "default" | "centered" | "cover";
  brand?: string; // override "Return to Calm" if needed
  blocks: Block[];
};

export type Workbook = {
  slug: string;
  title: string;
  scriptTitle: string; // the Pinyon-script word/phrase under the title
  brand: string; // small top-right brand label per page
  cover: {
    eyebrow: string;
    title: string[]; // ["Return to", "Calm"]
    script: string; // "the calm within"
    sub: string;
    scriptSub: string;
    author: string;
    role: string;
  };
  pages: WorkbookPage[];
};
