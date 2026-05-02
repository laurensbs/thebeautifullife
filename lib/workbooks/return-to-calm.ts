import type { Workbook, Translatable } from "./types";

const t = (nl: string, en: string): Translatable => ({ nl, en });
const ta = (nl: string[], en: string[]): Translatable<string[]> => ({ nl, en });

export const RETURN_TO_CALM: Workbook = {
  slug: "return-to-calm",
  title: t("Return to Calm", "Return to Calm"),
  scriptTitle: t("the calm within", "the calm within"),
  brand: t("Return to Calm", "Return to Calm"),
  imageUrl: "https://u.cubeupload.com/laurensbos/werkboekreturntocalm.png",
  imageAlt: t(
    "Return to Calm — een rustig, intiem moment",
    "Return to Calm — a quiet, intimate moment"
  ),
  cover: {
    eyebrow: t("A Workbook", "A Workbook"),
    title: ta(["Return to", "Calm"], ["Return to", "Calm"]),
    script: t("the calm within", "the calm within"),
    sub: t("De eerste stap terug naar jezelf", "The first step back to yourself"),
    scriptSub: t(
      "the beginning of your beautiful life",
      "the beginning of your beautiful life"
    ),
    author: "Marion Lubach",
    role: t("your creative lifestyle mentor", "your creative lifestyle mentor"),
  },
  pages: [
    // Page 2 — Welcome
    {
      number: 2,
      layout: "centered",
      blocks: [
        { type: "kicker", text: t("welcome", "welcome") },
        { type: "title", text: t("Even stilstaan", "Pause for a moment"), size: "lg" },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: ta(
            [
              "Dit is jouw moment om even stil te staan.",
              "Niet omdat het moet —\nmaar omdat je voelt dat het zo niet langer gaat.",
              "Je hoeft het nog niet te weten.\nJe hoeft het niet perfect te doen.",
            ],
            [
              "This is your moment to simply pause.",
              "Not because you have to —\nbut because you feel this isn't sustainable any longer.",
              "You don't have to know yet.\nYou don't have to do it perfectly.",
            ]
          ),
        },
        {
          type: "scriptLine",
          text: t(
            "Je mag eerst…\nterug naar jezelf.",
            "You may first…\ncome back to yourself."
          ),
          size: 30,
        },
      ],
    },

    // Page 3 — Dit is jouw moment
    {
      number: 3,
      layout: "centered",
      blocks: [
        { type: "eyebrow", text: t("a pause", "a pause") },
        {
          type: "title",
          text: t("Dit is jouw moment", "This is your moment"),
          size: "lg",
          lines: ta(["Dit is jouw", "moment"], ["This is your", "moment"]),
        },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: ta(
            [
              "Dit werkboek is van jou.",
              "Je hoeft nergens heen.\nJe hoeft niets te bewijzen.",
              "Neem dit moment serieus —\ndit kan het begin zijn van iets nieuws.",
            ],
            [
              "This workbook is yours.",
              "You don't need to be anywhere.\nYou don't need to prove anything.",
              "Take this moment seriously —\nthis can be the beginning of something new.",
            ]
          ),
        },
        { type: "spacer", height: 32 },
        {
          type: "breath",
          text: t("adem in.\nadem uit.", "breathe in.\nbreathe out."),
        },
      ],
    },

    // Page 4 — Hoe gebruik je dit
    {
      number: 4,
      blocks: [
        { type: "kicker", text: t("how to use", "how to use") },
        {
          type: "title",
          text: t("Hoe gebruik je dit werkboek", "How to use this workbook"),
          size: "md",
          lines: ta(
            ["Hoe gebruik je", "dit werkboek"],
            ["How to use", "this workbook"]
          ),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          airy: true,
          paragraphs: ta(
            [
              "Gebruik dit werkboek in jouw tempo.\nNeem de tijd. Lees niet alles in één keer.",
              "Voel wat binnenkomt.\nSchrijf wat er opkomt.",
              "Er zijn geen goede of foute antwoorden.\nDit is geen test.\nDit is een ontmoeting met jezelf.",
            ],
            [
              "Use this workbook at your own pace.\nTake your time. Don't read it all in one sitting.",
              "Feel what lands.\nWrite what arises.",
              "There are no right or wrong answers.\nThis isn't a test.\nThis is a meeting with yourself.",
            ]
          ),
        },
        {
          type: "audioCue",
          text: t(
            "Neem hier even de tijd om het eerste moment van rust te beluisteren voordat je verder gaat.",
            "Take a moment here to listen to the first moment of calm before moving on."
          ),
        },
      ],
    },

    // Page 5 — Waar sta je nu
    {
      number: 5,
      blocks: [
        { type: "kicker", text: t("check-in", "check-in") },
        {
          type: "title",
          text: t("Waar sta je op dit moment?", "Where are you right now?"),
          size: "md",
          lines: ta(
            ["Waar sta je", "op dit moment?"],
            ["Where are you", "right now?"]
          ),
        },
        { type: "rule", align: "left" },
        { type: "audioCue", text: t("Moment van rust", "A moment of calm") },
        {
          type: "lead",
          paragraphs: ta(
            ["Schrijf zonder nadenken op wat er in je leeft:"],
            ["Write down without thinking what's alive in you:"]
          ),
        },
        {
          type: "questions",
          items: ta(
            [
              "Hoe voel ik me de laatste tijd?",
              "Waar ben ik moe van?",
              "Wat voelt zwaar?",
              "Wat klopt er niet meer?",
            ],
            [
              "How have I been feeling lately?",
              "What am I tired of?",
              "What feels heavy?",
              "What no longer fits?",
            ]
          ),
        },
        {
          type: "field",
          key: "p5_check_in",
          placeholder: t("Laat hier je woorden landen…", "Let your words land here…"),
          size: "lg",
        },
      ],
    },

    // Page 6 — Vertragen
    {
      number: 6,
      layout: "centered",
      blocks: [
        { type: "kicker", text: t("slow down", "slow down") },
        { type: "title", text: t("Vertragen", "Slowing down"), size: "lg" },
        { type: "audioCue", text: t("Terug naar rust", "Back to calm") },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: ta(
            ["Je hoeft niet sneller.\nJe hoeft niet meer."],
            ["You don't need to be faster.\nYou don't need to do more."]
          ),
        },
        {
          type: "scriptLine",
          text: t(
            "Wat je nodig hebt…\nis minder.",
            "What you need…\nis less."
          ),
          size: 32,
        },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: ta(
            [
              "Minder ruis.\nMinder moeten.\nMinder druk.",
              "Zodat je weer kunt voelen\nwat er echt speelt.",
            ],
            [
              "Less noise.\nLess pressure.\nLess obligation.",
              "So you can feel again\nwhat's truly going on.",
            ]
          ),
        },
      ],
    },

    // Page 7 — Oefening Vertragen
    {
      number: 7,
      blocks: [
        { type: "kicker", text: t("oefening", "exercise") },
        { type: "title", text: t("Terug naar rust", "Back to calm"), size: "md" },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Neem 5 minuten.\nLeg alles weg.\nSluit je ogen.\nAdem rustig in en uit.",
              "En stel jezelf deze vraag:",
            ],
            [
              "Take 5 minutes.\nPut everything aside.\nClose your eyes.\nBreathe slowly in and out.",
              "And ask yourself this question:",
            ]
          ),
        },
        {
          type: "scriptLine",
          text: t(
            "Hoe voel ik me echt,\nonder alles wat ik doe?",
            "How do I really feel,\nbeneath everything I do?"
          ),
          size: 28,
        },
        {
          type: "lead",
          paragraphs: ta(
            ["Schrijf daarna op wat er naar boven komt:"],
            ["Then write down what surfaces:"]
          ),
        },
        {
          type: "field",
          key: "p7_under_it_all",
          placeholder: t("Wat komt er naar boven…", "What's surfacing…"),
          size: "md",
        },
      ],
    },

    // Page 8 — Helderheid
    {
      number: 8,
      blocks: [
        { type: "kicker", text: t("clarity", "clarity") },
        {
          type: "title",
          text: t("Wat klopt er niet meer?", "What no longer fits?"),
          size: "md",
          lines: ta(["Wat klopt er", "niet meer?"], ["What no longer", "fits?"]),
        },
        { type: "rule", align: "left" },
        { type: "audioCue", text: t("Helder zien", "Seeing clearly") },
        {
          type: "lead",
          paragraphs: ta(
            ["Wees eerlijk naar jezelf:"],
            ["Be honest with yourself:"]
          ),
        },
        {
          type: "questions",
          items: ta(
            [
              "Wat kost mij energie?",
              "Waar zeg ik “ja” terwijl ik “nee” voel?",
              "Wat voelt niet meer als mij?",
            ],
            [
              "What drains my energy?",
              "Where do I say “yes” while I feel “no”?",
              "What no longer feels like me?",
            ]
          ),
        },
        {
          type: "field",
          key: "p8_doesnt_fit",
          placeholder: t("Schrijf zonder filter…", "Write without filtering…"),
          size: "lg",
        },
      ],
    },

    // Page 9 — Wat verlang je
    {
      number: 9,
      blocks: [
        { type: "kicker", text: t("desire", "desire") },
        {
          type: "title",
          text: t("Wat verlang je eigenlijk?", "What do you actually long for?"),
          size: "md",
          lines: ta(
            ["Wat verlang je", "eigenlijk?"],
            ["What do you", "long for?"]
          ),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(["_Als alles mogelijk was…_"], ["_If anything were possible…_"]),
        },
        {
          type: "questions",
          items: ta(
            [
              "Hoe zou mijn leven eruitzien?",
              "Hoe zou ik me voelen op een normale dag?",
              "Wat zou ik vaker doen?",
              "Wat zou ik loslaten?",
            ],
            [
              "What would my life look like?",
              "How would I feel on an ordinary day?",
              "What would I do more often?",
              "What would I let go of?",
            ]
          ),
        },
        {
          type: "field",
          key: "p9_desire",
          placeholder: t("Droom hier even hardop…", "Dream out loud here…"),
          size: "lg",
        },
      ],
    },

    // Page 10 — Jouw kompas
    {
      number: 10,
      layout: "centered",
      blocks: [
        { type: "kicker", text: t("your compass", "your compass") },
        {
          type: "title",
          text: t("Jouw gevoel als kompas", "Your feeling as compass"),
          size: "md",
          lines: ta(["Jouw gevoel", "als kompas"], ["Your feeling", "as compass"]),
        },
        { type: "audioCue", text: t("Terug naar jezelf", "Back to yourself") },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: ta(
            [
              "Je hoeft het niet logisch te maken.\nJe hoeft het niet te verklaren.",
              "Je mag leren vertrouwen op:",
            ],
            [
              "You don't have to make it logical.\nYou don't have to explain it.",
              "You may learn to trust:",
            ]
          ),
        },
        {
          type: "scriptLine",
          text: t(
            "wat goed voelt\nwat licht voelt\nwat rustig voelt",
            "what feels good\nwhat feels light\nwhat feels calm"
          ),
          size: 30,
        },
        {
          type: "lead",
          center: true,
          paragraphs: ta(
            ["Dat is jouw richting."],
            ["That is your direction."]
          ),
        },
      ],
    },

    // Page 11 — Herken jezelf weer
    {
      number: 11,
      blocks: [
        { type: "kicker", text: t("remember", "remember") },
        {
          type: "title",
          text: t("Herken jezelf weer", "Recognize yourself again"),
          size: "md",
          lines: ta(["Herken jezelf", "weer"], ["Recognize yourself", "again"]),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            ["_Wanneer voel jij je het meest jezelf?_"],
            ["_When do you feel most yourself?_"]
          ),
        },
        {
          type: "questions",
          items: ta(
            ["Wat doe je dan?", "Met wie ben je?", "Waar ben je?"],
            ["What are you doing?", "Who are you with?", "Where are you?"]
          ),
        },
        {
          type: "field",
          key: "p11_yourself",
          placeholder: t(
            "De momenten waarop je adem dieper wordt…",
            "The moments when your breath deepens…"
          ),
          size: "lg",
        },
      ],
    },

    // Page 12 — Begin klein
    {
      number: 12,
      blocks: [
        { type: "kicker", text: t("begin small", "begin small") },
        { type: "title", text: t("Begin klein", "Begin small"), size: "md" },
        { type: "audioCue", text: t("Zacht vooruit", "Softly forward") },
        { type: "rule", align: "left" },
        {
          type: "lead",
          airy: true,
          paragraphs: ta(
            [
              "Je hoeft je leven niet vandaag te veranderen.",
              "Je hoeft alleen…\néén kleine stap te zetten\ndie beter voelt dan gisteren.",
            ],
            [
              "You don't have to change your life today.",
              "You only need…\nto take one small step\nthat feels better than yesterday.",
            ]
          ),
        },
        {
          type: "lead",
          paragraphs: ta(
            ["_Wat is één kleine stap die ik vandaag kan zetten?_"],
            ["_What is one small step I can take today?_"]
          ),
        },
        {
          type: "field",
          key: "p12_one_step",
          placeholder: t(
            "Eén stap. Klein. Mogelijk. Vandaag.",
            "One step. Small. Possible. Today."
          ),
          size: "sm",
        },
      ],
    },

    // Page 13 — Zacht vooruit
    {
      number: 13,
      blocks: [
        { type: "kicker", text: t("soft forward", "soft forward") },
        { type: "title", text: t("Zacht vooruit", "Softly forward"), size: "md" },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(["Maak het concreet:"], ["Make it concrete:"]),
        },
        {
          type: "questions",
          items: ta(
            [
              "Wat wil ik de komende tijd anders doen?",
              "Waar wil ik meer ruimte voor maken?",
              "Wat laat ik los?",
            ],
            [
              "What do I want to do differently going forward?",
              "What do I want to make more space for?",
              "What am I letting go of?",
            ]
          ),
        },
        {
          type: "field",
          key: "p13_direction",
          placeholder: t("Schrijf je richting…", "Write your direction…"),
          size: "lg",
        },
      ],
    },

    // Page 14 — Tot zover
    {
      number: 14,
      layout: "centered",
      blocks: [
        { type: "kicker", text: t("closing", "closing") },
        { type: "title", text: t("Tot zover", "For now"), size: "lg" },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: ta(
            [
              "Je hoeft niet alles te weten.",
              "Je hoeft alleen\nte blijven luisteren.",
            ],
            [
              "You don't have to know everything.",
              "You only have to\nkeep listening.",
            ]
          ),
        },
        {
          type: "scriptLine",
          text: t("Naar jezelf.", "To yourself."),
          size: 32,
        },
        {
          type: "lead",
          center: true,
          paragraphs: ta(
            ["Dit is nog maar het begin."],
            ["This is just the beginning."]
          ),
        },
        {
          type: "audioCue",
          text: t(
            "Neem dit moment nog één keer rustig voor jezelf.",
            "Take this moment one more time, gently, for yourself."
          ),
        },
      ],
    },

    // Page 15 — Even stilstaan
    {
      number: 15,
      blocks: [
        { type: "kicker", text: t("mini check-in", "mini check-in") },
        {
          type: "title",
          text: t("Even stilstaan", "Pause for a moment"),
          size: "md",
        },
        { type: "rule", align: "left" },
        {
          type: "questions",
          items: ta(
            [
              "Hoe voel je je nu?",
              "Wat is er veranderd sinds je begon?",
              "Wat neem je mee vanaf hier?",
            ],
            [
              "How do you feel now?",
              "What has changed since you started?",
              "What do you take with you from here?",
            ]
          ),
        },
        {
          type: "field",
          key: "p15_check_out",
          placeholder: t("Voel even na…", "Sit with it for a moment…"),
          size: "xl",
        },
      ],
    },

    // Page 16 — Doorstroom
    {
      number: 16,
      layout: "centered",
      blocks: [
        { type: "kicker", text: t("what's next", "what's next") },
        {
          type: "title",
          text: t(
            "Voel je dat er meer in zit?",
            "Do you feel there's more in this?"
          ),
          size: "md",
          lines: ta(
            ["Voel je dat er", "meer in zit?"],
            ["Do you feel there's", "more in this?"]
          ),
        },
        { type: "rule", align: "center" },
        {
          type: "lead",
          center: true,
          airy: true,
          paragraphs: ta(
            [
              "Voel je dat je hier verder in wilt?\nDat er meer in zit —\nmaar je het niet alleen wilt doen?",
              "Dan is dit het moment om verder te bouwen.\nOp jouw tempo. Op jouw manier.",
            ],
            [
              "Do you feel like going further with this?\nThat there's more here —\nbut you don't want to do it alone?",
              "Then this is the moment to build on.\nAt your pace. In your way.",
            ]
          ),
        },
        {
          type: "ctaCard",
          eyebrow: t("✿ The Beautiful Life", "✿ The Beautiful Life"),
          title: t("Van inzicht naar leven", "From insight to living"),
          body: t(
            "Drie paden, één doel: een leven dat past bij wie jij echt bent.\nOntdek welk pad bij jou past — wanneer jij eraan toe bent.",
            "Three paths, one goal: a life that fits who you really are.\nDiscover which path is yours — when you're ready."
          ),
        },
        {
          type: "signature",
          name: "Marion Lubach",
          role: t(
            "your creative lifestyle mentor",
            "your creative lifestyle mentor"
          ),
        },
      ],
    },
  ],
};
