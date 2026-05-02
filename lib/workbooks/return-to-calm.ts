import type { Workbook } from "./types";

export const RETURN_TO_CALM: Workbook = {
  slug: "return-to-calm",
  title: "Return to Calm",
  scriptTitle: "the calm within",
  brand: "Return to Calm",
  cover: {
    eyebrow: "A Workbook",
    title: ["Return to", "Calm"],
    script: "the calm within",
    sub: "De eerste stap terug naar jezelf",
    scriptSub: "the beginning of your beautiful life",
    author: "Marion Lubach",
    role: "your creative lifestyle mentor",
  },
  pages: [
    // Page 2 — Welcome
    {
      number: 2,
      layout: "centered",
      blocks: [
        { type: "kicker", text: "welcome" },
        { type: "title", text: "Even stilstaan", size: "lg" },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: [
            "Dit is jouw moment om even stil te staan.",
            "Niet omdat het moet —\nmaar omdat je voelt dat het zo niet langer gaat.",
            "Je hoeft het nog niet te weten.\nJe hoeft het niet perfect te doen.",
          ],
        },
        { type: "scriptLine", text: "Je mag eerst…\nterug naar jezelf.", size: 30 },
      ],
    },

    // Page 3 — Dit is jouw moment
    {
      number: 3,
      layout: "centered",
      blocks: [
        { type: "eyebrow", text: "a pause" },
        { type: "title", text: "Dit is jouw moment", size: "lg", lines: ["Dit is jouw", "moment"] },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: [
            "Dit werkboek is van jou.",
            "Je hoeft nergens heen.\nJe hoeft niets te bewijzen.",
            "Neem dit moment serieus —\ndit kan het begin zijn van iets nieuws.",
          ],
        },
        { type: "spacer", height: 32 },
        { type: "breath", text: "adem in.\nadem uit." },
      ],
    },

    // Page 4 — Hoe gebruik je dit
    {
      number: 4,
      blocks: [
        { type: "kicker", text: "how to use" },
        { type: "title", text: "Hoe gebruik je dit werkboek", size: "md", lines: ["Hoe gebruik je", "dit werkboek"] },
        { type: "rule", align: "left" },
        {
          type: "lead",
          airy: true,
          paragraphs: [
            "Gebruik dit werkboek in jouw tempo.\nNeem de tijd. Lees niet alles in één keer.",
            "Voel wat binnenkomt.\nSchrijf wat er opkomt.",
            "Er zijn geen goede of foute antwoorden.\nDit is geen test.\nDit is een ontmoeting met jezelf.",
          ],
        },
        {
          type: "audioCue",
          text: "Neem hier even de tijd om het eerste moment van rust te beluisteren voordat je verder gaat.",
        },
      ],
    },

    // Page 5 — Waar sta je nu
    {
      number: 5,
      blocks: [
        { type: "kicker", text: "check-in" },
        { type: "title", text: "Waar sta je op dit moment?", size: "md", lines: ["Waar sta je", "op dit moment?"] },
        { type: "rule", align: "left" },
        { type: "audioCue", text: "Moment van rust" },
        { type: "lead", paragraphs: ["Schrijf zonder nadenken op wat er in je leeft:"] },
        {
          type: "questions",
          items: [
            "Hoe voel ik me de laatste tijd?",
            "Waar ben ik moe van?",
            "Wat voelt zwaar?",
            "Wat klopt er niet meer?",
          ],
        },
        { type: "field", key: "p5_check_in", placeholder: "Laat hier je woorden landen…", size: "lg" },
      ],
    },

    // Page 6 — Vertragen
    {
      number: 6,
      layout: "centered",
      blocks: [
        { type: "kicker", text: "slow down" },
        { type: "title", text: "Vertragen", size: "lg" },
        { type: "audioCue", text: "Terug naar rust" },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: ["Je hoeft niet sneller.\nJe hoeft niet meer."],
        },
        { type: "scriptLine", text: "Wat je nodig hebt…\nis minder.", size: 32 },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: [
            "Minder ruis.\nMinder moeten.\nMinder druk.",
            "Zodat je weer kunt voelen\nwat er echt speelt.",
          ],
        },
      ],
    },

    // Page 7 — Oefening Vertragen
    {
      number: 7,
      blocks: [
        { type: "kicker", text: "oefening" },
        { type: "title", text: "Terug naar rust", size: "md" },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: [
            "Neem 5 minuten.\nLeg alles weg.\nSluit je ogen.\nAdem rustig in en uit.",
            "En stel jezelf deze vraag:",
          ],
        },
        { type: "scriptLine", text: "Hoe voel ik me echt,\nonder alles wat ik doe?", size: 28 },
        { type: "lead", paragraphs: ["Schrijf daarna op wat er naar boven komt:"] },
        { type: "field", key: "p7_under_it_all", placeholder: "Wat komt er naar boven…", size: "md" },
      ],
    },

    // Page 8 — Helderheid
    {
      number: 8,
      blocks: [
        { type: "kicker", text: "clarity" },
        { type: "title", text: "Wat klopt er niet meer?", size: "md", lines: ["Wat klopt er", "niet meer?"] },
        { type: "rule", align: "left" },
        { type: "audioCue", text: "Helder zien" },
        { type: "lead", paragraphs: ["Wees eerlijk naar jezelf:"] },
        {
          type: "questions",
          items: [
            "Wat kost mij energie?",
            "Waar zeg ik “ja” terwijl ik “nee” voel?",
            "Wat voelt niet meer als mij?",
          ],
        },
        { type: "field", key: "p8_doesnt_fit", placeholder: "Schrijf zonder filter…", size: "lg" },
      ],
    },

    // Page 9 — Wat verlang je
    {
      number: 9,
      blocks: [
        { type: "kicker", text: "desire" },
        { type: "title", text: "Wat verlang je eigenlijk?", size: "md", lines: ["Wat verlang je", "eigenlijk?"] },
        { type: "rule", align: "left" },
        { type: "lead", paragraphs: ["_Als alles mogelijk was…_"] },
        {
          type: "questions",
          items: [
            "Hoe zou mijn leven eruitzien?",
            "Hoe zou ik me voelen op een normale dag?",
            "Wat zou ik vaker doen?",
            "Wat zou ik loslaten?",
          ],
        },
        { type: "field", key: "p9_desire", placeholder: "Droom hier even hardop…", size: "lg" },
      ],
    },

    // Page 10 — Jouw kompas
    {
      number: 10,
      layout: "centered",
      blocks: [
        { type: "kicker", text: "your compass" },
        { type: "title", text: "Jouw gevoel als kompas", size: "md", lines: ["Jouw gevoel", "als kompas"] },
        { type: "audioCue", text: "Terug naar jezelf" },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: [
            "Je hoeft het niet logisch te maken.\nJe hoeft het niet te verklaren.",
            "Je mag leren vertrouwen op:",
          ],
        },
        { type: "scriptLine", text: "wat goed voelt\nwat licht voelt\nwat rustig voelt", size: 30 },
        { type: "lead", center: true, paragraphs: ["Dat is jouw richting."] },
      ],
    },

    // Page 11 — Herken jezelf weer
    {
      number: 11,
      blocks: [
        { type: "kicker", text: "remember" },
        { type: "title", text: "Herken jezelf weer", size: "md", lines: ["Herken jezelf", "weer"] },
        { type: "rule", align: "left" },
        { type: "lead", paragraphs: ["_Wanneer voel jij je het meest jezelf?_"] },
        {
          type: "questions",
          items: ["Wat doe je dan?", "Met wie ben je?", "Waar ben je?"],
        },
        {
          type: "field",
          key: "p11_yourself",
          placeholder: "De momenten waarop je adem dieper wordt…",
          size: "lg",
        },
      ],
    },

    // Page 12 — Begin klein
    {
      number: 12,
      blocks: [
        { type: "kicker", text: "begin small" },
        { type: "title", text: "Begin klein", size: "md" },
        { type: "audioCue", text: "Zacht vooruit" },
        { type: "rule", align: "left" },
        {
          type: "lead",
          airy: true,
          paragraphs: [
            "Je hoeft je leven niet vandaag te veranderen.",
            "Je hoeft alleen…\néén kleine stap te zetten\ndie beter voelt dan gisteren.",
          ],
        },
        { type: "lead", paragraphs: ["_Wat is één kleine stap die ik vandaag kan zetten?_"] },
        { type: "field", key: "p12_one_step", placeholder: "Eén stap. Klein. Mogelijk. Vandaag.", size: "sm" },
      ],
    },

    // Page 13 — Zacht vooruit
    {
      number: 13,
      blocks: [
        { type: "kicker", text: "soft forward" },
        { type: "title", text: "Zacht vooruit", size: "md" },
        { type: "rule", align: "left" },
        { type: "lead", paragraphs: ["Maak het concreet:"] },
        {
          type: "questions",
          items: [
            "Wat wil ik de komende tijd anders doen?",
            "Waar wil ik meer ruimte voor maken?",
            "Wat laat ik los?",
          ],
        },
        { type: "field", key: "p13_direction", placeholder: "Schrijf je richting…", size: "lg" },
      ],
    },

    // Page 14 — Tot zover
    {
      number: 14,
      layout: "centered",
      blocks: [
        { type: "kicker", text: "closing" },
        { type: "title", text: "Tot zover", size: "lg" },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: [
            "Je hoeft niet alles te weten.",
            "Je hoeft alleen\nte blijven luisteren.",
          ],
        },
        { type: "scriptLine", text: "Naar jezelf.", size: 32 },
        { type: "lead", center: true, paragraphs: ["Dit is nog maar het begin."] },
        { type: "audioCue", text: "Neem dit moment nog één keer rustig voor jezelf." },
      ],
    },

    // Page 15 — Even stilstaan (mini check-in)
    {
      number: 15,
      blocks: [
        { type: "kicker", text: "mini check-in" },
        { type: "title", text: "Even stilstaan", size: "md" },
        { type: "rule", align: "left" },
        {
          type: "questions",
          items: [
            "Hoe voel je je nu?",
            "Wat is er veranderd sinds je begon?",
            "Wat neem je mee vanaf hier?",
          ],
        },
        { type: "field", key: "p15_check_out", placeholder: "Voel even na…", size: "xl" },
      ],
    },

    // Page 16 — Doorstroom
    {
      number: 16,
      layout: "centered",
      blocks: [
        { type: "kicker", text: "what's next" },
        { type: "title", text: "Voel je dat er meer in zit?", size: "md", lines: ["Voel je dat er", "meer in zit?"] },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: [
            "Voel je dat je hier verder in wilt?\nDat er meer in zit —\nmaar je het niet alleen wilt doen?",
            "Dan is dit het moment om verder te bouwen.\nOp jouw tempo. Op jouw manier.",
          ],
        },
        {
          type: "ctaCard",
          eyebrow: "✿ The Beautiful Life",
          title: "Van inzicht naar leven",
          body:
            "Drie paden, één doel: een leven dat past bij wie jij echt bent.\nOntdek welk pad bij jou past — wanneer jij eraan toe bent.",
        },
        { type: "signature", name: "Marion Lubach", role: "your creative lifestyle mentor" },
      ],
    },
  ],
};
