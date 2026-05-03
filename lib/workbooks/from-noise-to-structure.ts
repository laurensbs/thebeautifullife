import type { Workbook, Translatable } from "./types";

const t = (nl: string, en: string): Translatable => ({ nl, en });
const ta = (nl: string[], en: string[]): Translatable<string[]> => ({ nl, en });

export const FROM_NOISE_TO_STRUCTURE: Workbook = {
  slug: "from-noise-to-structure",
  title: t("Return to Calm — The Deeper Path", "Return to Calm — The Deeper Path"),
  scriptTitle: t("the deeper path", "the deeper path"),
  brand: t("Return to Calm", "Return to Calm"),
  imageUrl: "https://u.cubeupload.com/laurensbos/noisetostructure.png",
  imageAlt: t(
    "From Noise to Structure — een verdiepend werkboek",
    "From Noise to Structure — a deeper workbook"
  ),
  cover: {
    eyebrow: t("Werkboek · Deel II", "Workbook · Volume II"),
    title: ta(["Return to", "Calm"], ["Return to", "Calm"]),
    script: t("the deeper path", "the deeper path"),
    sub: t(
      "Een verdiepend werkboek voor wie écht thuiskomt",
      "A deeper workbook for those who truly come home"
    ),
    scriptSub: t("Tools · Reflecties · Rituelen", "Tools · Reflections · Rituals"),
    author: "Marion Lubach",
    role: t("jouw creatief levensmentor", "your creative lifestyle mentor"),
  },
  pages: [
    // ─── PAGE 2 — Welkom (brief) ────────────────────────────────────
    {
      number: 2,
      chapter: t("Welkom", "Welcome"),
      blocks: [
        { type: "kicker", text: t("a letter to you", "a letter to you") },
        {
          type: "title",
          text: t("Welkom terug bij jezelf", "Welcome back to yourself"),
          size: "md",
          lines: ta(
            ["Welkom terug", "bij jezelf"],
            ["Welcome back", "to yourself"]
          ),
        },
        { type: "rule", align: "left" },
        {
          type: "letter",
          paragraphs: ta(
            [
              "Lieve jij,",
              "Als je deel één hebt doorlopen, weet je inmiddels hoe het voelt om even stil te staan. Dit werkboek gaat een laag dieper. Niet harder, niet sneller — alleen eerlijker.",
              "Je vindt hier reflecties, oefeningen en kleine tools die je een week, een maand of een seizoen lang kunt gebruiken. Pak wat je nodig hebt. Laat de rest rusten tot een ander moment.",
              'Beloof jezelf één ding: lees niet om "klaar" te zijn. Lees om jezelf op te merken.',
            ],
            [
              "Dear you,",
              "If you've been through volume one, you know what it feels like to pause. This workbook goes one layer deeper. Not harder, not faster — just more honest.",
              "Inside you'll find reflections, exercises and small tools you can use for a week, a month or a whole season. Take what you need. Let the rest rest, until another moment.",
              'Promise yourself one thing: don\'t read to be "done". Read to notice yourself.',
            ]
          ),
          signoff: t("— Marion", "— Marion"),
        },
      ],
    },

    // ─── PAGE 3 — Hoe gebruik je dit ────────────────────────────────
    {
      number: 3,
      chapter: t("Welkom", "Welcome"),
      blocks: [
        { type: "kicker", text: t("how to use", "how to use") },
        { type: "title", text: t("Vier ritmes", "Four rhythms"), size: "md" },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Dit werkboek werkt het beste als je het in vier ritmes gebruikt — niet als een takenlijst, maar als seizoenen die elkaar afwisselen.",
            ],
            [
              "This workbook works best in four rhythms — not as a checklist, but as seasons that take turns.",
            ]
          ),
        },
        {
          type: "calloutList",
          tone: "cream",
          items: [
            {
              label: t("01 · Lees", "01 · Read"),
              body: t(
                "Begin met de tekst van een hoofdstuk. Lees langzaam. Niet alles in één keer.",
                "Start with the text of a chapter. Read slowly. Not all at once."
              ),
            },
            {
              label: t("02 · Voel", "02 · Feel"),
              body: t(
                "Sluit het boek. Loop, adem, drink iets warms. Geef wat je las de tijd om te landen.",
                "Close the book. Walk, breathe, drink something warm. Let what you read settle."
              ),
            },
            {
              label: t("03 · Schrijf", "03 · Write"),
              body: t(
                "Pak de pen en beantwoord de vragen. Niet mooi. Niet correct. Eerlijk.",
                "Take the pen and answer the questions. Not pretty. Not correct. Honest."
              ),
            },
            {
              label: t("04 · Integreer", "04 · Integrate"),
              body: t(
                "Kies één klein iets dat deze week verandert door wat je schreef.",
                "Pick one small thing this week that changes because of what you wrote."
              ),
            },
          ],
        },
        {
          type: "audioCue",
          text: t(
            "Begin met het eerste audiomoment voordat je verdergaat.",
            "Start with the first audio moment before you continue."
          ),
        },
      ],
    },

    // ─── PAGE 4 — Maak een plek ─────────────────────────────────────
    {
      number: 4,
      chapter: t("Welkom", "Welcome"),
      blocks: [
        { type: "kicker", text: t("your space", "your space") },
        {
          type: "title",
          text: t("Maak een plek voor jezelf", "Make a space for yourself"),
          size: "md",
          lines: ta(
            ["Maak een plek", "voor jezelf"],
            ["Make a space", "for yourself"]
          ),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Een fysieke plek helpt. Niet ingewikkeld — gewoon een hoek, een stoel, een kussen. Iets dat zegt: _hier ben ik bij mezelf_.",
            ],
            [
              "A physical space helps. Nothing complicated — just a corner, a chair, a cushion. Something that says: _here I am with myself_.",
            ]
          ),
        },
        {
          type: "eyebrow",
          text: t(
            "Vink aan wat je hebt voorbereid",
            "Tick what you've prepared"
          ),
        },
        {
          type: "checks",
          key: "ns_p4_space",
          columns: 2,
          items: ta(
            [
              "Een vaste plek (stoel, hoek, kussen)",
              "Telefoon op stil of in andere kamer",
              "Iets warms te drinken",
              "Pen en het werkboek",
              "Een kaars, plant of betekenisvol object",
              "Zachte muziek of stilte (jouw keuze)",
              "Een deken of sjaal",
              "Een tijdslot van minimaal 20 minuten",
            ],
            [
              "A fixed spot (chair, corner, cushion)",
              "Phone on silent or in another room",
              "Something warm to drink",
              "Pen and this workbook",
              "A candle, plant or meaningful object",
              "Soft music or silence (your choice)",
              "A blanket or shawl",
              "A time slot of at least 20 minutes",
            ]
          ),
        },
        {
          type: "callout",
          tone: "sage",
          label: t("Tip", "Tip"),
          body: t(
            "Markeer het begin van je sessie met een klein gebaar — een diepe ademteug, drie seconden ogen dicht, of een kaars aansteken. Je brein leert: hier vertraag ik.",
            "Mark the start of your session with a small gesture — a deep breath, three seconds with closed eyes, lighting a candle. Your brain learns: here I slow down."
          ),
        },
      ],
    },

    // ─── PAGE 5 — Innerlijk weerbericht ─────────────────────────────
    {
      number: 5,
      chapter: t("Welkom", "Welcome"),
      blocks: [
        { type: "kicker", text: t("check-in", "check-in") },
        {
          type: "title",
          text: t("Innerlijk weerbericht", "Inner weather report"),
          size: "md",
          lines: ta(["Innerlijk", "weerbericht"], ["Inner weather", "report"]),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Voordat je dieper gaat, een nulmeting. Geen oordeel — alleen een momentopname. Geef elk gebied een score van 1 tot 10.",
            ],
            [
              "Before you go deeper, a baseline. No judgment — just a snapshot. Give each area a score from 1 to 10.",
            ]
          ),
        },
        {
          type: "scaleGroup",
          items: [
            { key: "ns_p5_body", label: t("Lichaam", "Body") },
            { key: "ns_p5_head", label: t("Hoofd", "Head") },
            { key: "ns_p5_heart", label: t("Hart", "Heart") },
            { key: "ns_p5_energy", label: t("Energie", "Energy") },
            { key: "ns_p5_calm", label: t("Rust", "Calm") },
          ],
        },
        {
          type: "lead",
          paragraphs: ta(
            ["_Wat valt je op aan deze scores?_"],
            ["_What do you notice about these scores?_"]
          ),
        },
        {
          type: "field",
          key: "ns_p5_notes",
          placeholder: t(
            "Schrijf je eerste indruk…",
            "Write your first impression…"
          ),
          size: "sm",
        },
      ],
    },

    // ─── PAGE 6 — PART I divider ────────────────────────────────────
    {
      number: 6,
      layout: "part",
      partRoman: t("Part One", "Part One"),
      partTitle: t("Vertragen", "Slowing down"),
      partScript: t("slow down", "slow down"),
      partLead: t(
        "Je zenuwstelsel weet de weg al. Je hoeft het alleen ruimte te geven om die weg weer te lopen.",
        "Your nervous system already knows the way. You only need to give it room to walk it again."
      ),
      blocks: [],
    },

    // ─── PAGE 7 — De prijs van druk ─────────────────────────────────
    {
      number: 7,
      chapter: t("Part One · Vertragen", "Part One · Slowing down"),
      blocks: [
        { type: "kicker", text: t("reflection", "reflection") },
        {
          type: "title",
          text: t("De prijs van druk", "The cost of busy"),
          size: "md",
          lines: ta(["De prijs", "van druk"], ["The cost", "of busy"]),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              '"Druk" is een gewoonte geworden, geen noodzaak. Voordat je gaat vertragen, mag je eerlijk kijken naar wat het je heeft gekost.',
            ],
            [
              '"Busy" has become a habit, not a necessity. Before you slow down, you may honestly look at what it has cost you.',
            ]
          ),
        },
        {
          type: "questions",
          items: ta(
            [
              "Wat heb ik gemist terwijl ik druk was?",
              "Welk deel van mij is stil geworden?",
              "Wat zegt mijn lichaam mij al een tijdje?",
              'Waar gebruik ik "druk" als excuus om iets te ontwijken?',
            ],
            [
              "What did I miss while being busy?",
              "Which part of me has gone quiet?",
              "What has my body been telling me for a while?",
              'Where do I use "busy" as an excuse to avoid something?',
            ]
          ),
        },
        {
          type: "field",
          key: "ns_p7_busy",
          placeholder: t("Schrijf zonder zelfoordeel…", "Write without self-judgment…"),
          size: "md",
        },
        {
          type: "callout",
          tone: "tan",
          label: t("Inzicht", "Insight"),
          body: t(
            "Druk zijn voelt productief, maar is vaak vermijding. Vraag jezelf vandaag één keer: _wat zou ik voelen als ik nu niets deed?_",
            "Being busy feels productive, but often it's avoidance. Ask yourself once today: _what would I feel if I did nothing right now?_"
          ),
        },
      ],
    },

    // ─── PAGE 8 — Energie-audit ─────────────────────────────────────
    {
      number: 8,
      chapter: t("Part One · Vertragen", "Part One · Slowing down"),
      blocks: [
        { type: "kicker", text: t("audit", "audit") },
        { type: "title", text: t("Energie-audit", "Energy audit"), size: "md" },
        { type: "rule", align: "left" },
        { type: "audioCue", text: t("Terug naar rust", "Back to calm") },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Maak twee lijsten. Niet uitgebreid — eerst snel en eerlijk. Mensen, taken, plekken, gewoontes, gedachten.",
            ],
            [
              "Make two lists. Not exhaustive — first quick and honest. People, tasks, places, habits, thoughts.",
            ]
          ),
        },
        {
          type: "twoCol",
          left: {
            head: t("Wat trekt energie", "What drains energy"),
            field: {
              key: "ns_p8_drains",
              placeholder: t("Wat voelt zwaar of leeg…", "What feels heavy or empty…"),
              size: "md",
            },
          },
          right: {
            head: t("Wat geeft energie", "What gives energy"),
            field: {
              key: "ns_p8_gives",
              placeholder: t("Wat voelt licht en vol…", "What feels light and full…"),
              size: "md",
            },
          },
        },
        {
          type: "callout",
          tone: "sage",
          label: t("Volgende stap", "Next step"),
          body: t(
            "Kies één ding uit de linker kolom dat je deze week 30% kleiner maakt. En één uit de rechter kolom dat je 30% groter maakt.",
            "Pick one thing in the left column you'll make 30% smaller this week. And one in the right column you'll make 30% bigger."
          ),
        },
      ],
    },

    // ─── PAGE 9 — Zenuwstelsel 101 ──────────────────────────────────
    {
      number: 9,
      chapter: t("Part One · Vertragen", "Part One · Slowing down"),
      blocks: [
        { type: "kicker", text: t("understand yourself", "understand yourself") },
        {
          type: "title",
          text: t("Je zenuwstelsel kort uitgelegd", "Your nervous system, briefly"),
          size: "md",
          lines: ta(
            ["Je zenuwstelsel", "kort uitgelegd"],
            ["Your nervous system", "briefly"]
          ),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Onrust is geen karakterfout — het is een lichaam dat te lang in alarm staat. Drie staten om te kennen:",
            ],
            [
              "Restlessness isn't a character flaw — it's a body that's been on alert too long. Three states to know:",
            ]
          ),
        },
        {
          type: "calloutList",
          tone: "cream",
          items: [
            {
              label: t("01 · Activatie (vechten / vluchten)", "01 · Activation (fight / flight)"),
              body: t(
                "Hartslag omhoog, gedachten snel, ongeduldig, prikkelbaar, moeilijk stilzitten.",
                "Heart rate up, thoughts fast, impatient, irritable, hard to sit still."
              ),
            },
            {
              label: t("02 · Bevriezing (uitschakeling)", "02 · Freeze (shutdown)"),
              body: t(
                "Moe, leeg, somber, geen motivatie, scrollen zonder iets te voelen, uitstellen.",
                "Tired, empty, low, no motivation, scrolling without feeling, procrastinating."
              ),
            },
            {
              label: t("03 · Rust (verbinding)", "03 · Calm (connection)"),
              body: t(
                "Adem laag in de buik, spieren ontspannen, contact met jezelf en anderen, helder kunnen denken.",
                "Breath low in the belly, muscles relaxed, in contact with yourself and others, clear thinking."
              ),
            },
          ],
        },
        {
          type: "lead",
          paragraphs: ta(
            ["_Welke staat herken je het meest van de afgelopen week?_"],
            ["_Which state do you recognise most from the past week?_"]
          ),
        },
        { type: "field", key: "ns_p9_state", size: "sm" },
      ],
    },

    // ─── PAGE 10 — 5-4-3-2-1 ────────────────────────────────────────
    {
      number: 10,
      chapter: t("Part One · Vertragen", "Part One · Slowing down"),
      blocks: [
        { type: "kicker", text: t("tool 01", "tool 01") },
        {
          type: "title",
          text: t("5 · 4 · 3 · 2 · 1 Aarden", "5 · 4 · 3 · 2 · 1 Grounding"),
          size: "md",
          lines: ta(["5 · 4 · 3 · 2 · 1", "Aarden"], ["5 · 4 · 3 · 2 · 1", "Grounding"]),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Een eeuwenoude oefening om binnen drie minuten terug te keren in je lichaam. Vooral fijn als je hoofd vol is of je hartslag te hoog.",
            ],
            [
              "An ancient exercise to return to your body within three minutes. Especially helpful when your head is full or your heart rate is high.",
            ]
          ),
        },
        {
          type: "callout",
          tone: "tan",
          label: t("Hoe het werkt", "How it works"),
          body: t(
            "Benoem in jezelf, langzaam:\n**5** dingen die je _ziet_\n**4** dingen die je _kunt aanraken_\n**3** dingen die je _hoort_\n**2** dingen die je _ruikt_\n**1** ding dat je _proeft_",
            "Name to yourself, slowly:\n**5** things you _see_\n**4** things you _can touch_\n**3** things you _hear_\n**2** things you _smell_\n**1** thing you _taste_"
          ),
        },
        {
          type: "lead",
          paragraphs: ta(
            ["_Doe het nu. Wat veranderde er in je lichaam?_"],
            ["_Do it now. What changed in your body?_"]
          ),
        },
        { type: "field", key: "ns_p10_grounding", size: "sm" },
        {
          type: "callout",
          tone: "sage",
          label: t("Wanneer inzetten", "When to use"),
          body: t(
            "Onderweg in de auto · voor een lastig gesprek · 's nachts wakker · vlak voor je werkt · op een drukke dag in een toiletruimte.",
            "In the car · before a difficult conversation · awake at night · just before you work · on a busy day in a bathroom."
          ),
        },
      ],
    },

    // ─── PAGE 11 — Box-ademhaling ───────────────────────────────────
    {
      number: 11,
      chapter: t("Part One · Vertragen", "Part One · Slowing down"),
      blocks: [
        { type: "kicker", text: t("tool 02", "tool 02") },
        { type: "title", text: t("Box-ademhaling", "Box breathing"), size: "md" },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Gebruikt door artsen, atleten en mensen die hun zenuwstelsel snel willen kalmeren. Vier zijden, vier tellen.",
            ],
            [
              "Used by doctors, athletes and anyone who wants to calm their nervous system quickly. Four sides, four counts.",
            ]
          ),
        },
        {
          type: "callout",
          tone: "tan",
          label: t("De vier tellen", "The four counts"),
          body: t(
            "**1.** Adem 4 tellen rustig in door je neus.\n**2.** Houd je adem 4 tellen vast.\n**3.** Adem 4 tellen langzaam uit.\n**4.** Pauzeer 4 tellen voor de volgende inademing.\n\n_Herhaal 4 tot 6 rondes._",
            "**1.** Breathe in slowly through your nose for 4 counts.\n**2.** Hold for 4 counts.\n**3.** Breathe out slowly for 4 counts.\n**4.** Pause for 4 counts before the next breath.\n\n_Repeat 4 to 6 rounds._"
          ),
        },
        {
          type: "callout",
          tone: "cream",
          label: t("Tip", "Tip"),
          body: t(
            "Te kort? Begin met 3 tellen. Dit is geen wedstrijd. De rust komt door regelmaat, niet door perfectie.",
            "Too short? Start with 3 counts. This isn't a contest. Calm comes from regularity, not perfection."
          ),
        },
      ],
    },

    // ─── PAGE 12 — Body scan ────────────────────────────────────────
    {
      number: 12,
      chapter: t("Part One · Vertragen", "Part One · Slowing down"),
      blocks: [
        { type: "kicker", text: t("tool 03", "tool 03") },
        { type: "title", text: t("Body scan", "Body scan"), size: "md" },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Tien minuten waarin je niets oplost — alleen aanwezig bent. Een oefening om weer in contact te komen met wat je lichaam je vertelt.",
            ],
            [
              "Ten minutes in which you fix nothing — just be present. An exercise to reconnect with what your body is telling you.",
            ]
          ),
        },
        {
          type: "callout",
          tone: "tan",
          label: t("Stap voor stap", "Step by step"),
          body: t(
            "Ga liggen of zit comfortabel. Sluit je ogen. Adem drie keer dieper dan normaal.\n\nRicht je aandacht op je _voeten_ · _onderbenen_ · _knieën_ · _bovenbenen_ · _bekken_ · _buik_ · _borst_ · _schouders_ · _armen en handen_ · _nek_ · _gezicht_ · _kruin_.\n\nBij elk gebied: blijf 30 seconden. Niets veranderen. Alleen opmerken.",
            "Lie down or sit comfortably. Close your eyes. Breathe three times deeper than usual.\n\nMove your attention to your _feet_ · _lower legs_ · _knees_ · _thighs_ · _pelvis_ · _belly_ · _chest_ · _shoulders_ · _arms and hands_ · _neck_ · _face_ · _crown_.\n\nAt each area: stay 30 seconds. Change nothing. Just notice."
          ),
        },
        {
          type: "lead",
          paragraphs: ta(
            ["_Welk lichaamsdeel vroeg het meest om aandacht?_"],
            ["_Which part of your body asked for attention the most?_"]
          ),
        },
        { type: "field", key: "ns_p12_body_part", size: "sm" },
        {
          type: "lead",
          paragraphs: ta(
            ["_Wat probeert het je te vertellen?_"],
            ["_What is it trying to tell you?_"]
          ),
        },
        { type: "field", key: "ns_p12_message", size: "sm" },
      ],
    },

    // ─── PAGE 13 — PART II divider ──────────────────────────────────
    {
      number: 13,
      layout: "part",
      partRoman: t("Part Two", "Part Two"),
      partTitle: t("Helder zien", "See clearly"),
      partScript: t("see clearly", "see clearly"),
      partLead: t(
        "Pas als je vertraagt, kun je zien. En pas als je ziet, kun je kiezen.",
        "Only when you slow down, you can see. And only when you see, you can choose."
      ),
      blocks: [],
    },

    // ─── PAGE 14 — Wheel of life ────────────────────────────────────
    {
      number: 14,
      chapter: t("Part Two · Helder zien", "Part Two · See clearly"),
      blocks: [
        { type: "kicker", text: t("overview", "overview") },
        {
          type: "title",
          text: t("Het wiel van jouw leven", "The wheel of your life"),
          size: "md",
          lines: ta(
            ["Het wiel van", "jouw leven"],
            ["The wheel of", "your life"]
          ),
        },
        { type: "rule", align: "left" },
        { type: "audioCue", text: t("Helder zien", "Seeing clearly") },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Geef elk gebied een score van 1 (leeg) tot 10 (vol). Niet hoe het zou moeten zijn — hoe het nu is.",
            ],
            [
              "Give each area a score from 1 (empty) to 10 (full). Not how it should be — how it is now.",
            ]
          ),
        },
        {
          type: "wheelOfLife",
          key: "ns_p14_wheel",
          items: ta(
            [
              "Werk & doel",
              "Geld & vrijheid",
              "Gezondheid & lichaam",
              "Liefde & relaties",
              "Vrienden & familie",
              "Vrije tijd & spel",
              "Persoonlijke groei",
              "Thuis & omgeving",
            ],
            [
              "Work & purpose",
              "Money & freedom",
              "Health & body",
              "Love & relationships",
              "Friends & family",
              "Leisure & play",
              "Personal growth",
              "Home & environment",
            ]
          ),
        },
      ],
    },

    // ─── PAGE 15 — Wat ik tolereer ──────────────────────────────────
    {
      number: 15,
      chapter: t("Part Two · Helder zien", "Part Two · See clearly"),
      blocks: [
        { type: "kicker", text: t("brain dump", "brain dump") },
        { type: "title", text: t("Wat ik tolereer", "What I tolerate"), size: "md" },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Tolereren kost stille energie. Schrijf alles op wat je accepteert maar eigenlijk niet meer wilt — groot en klein. De rommelige kast. De afspraak die je nooit wilde. De toon waarop iemand met je praat. Alles mag.",
            ],
            [
              "Tolerating costs quiet energy. Write down everything you accept but no longer want — big and small. The messy cupboard. The appointment you never wanted. The tone someone speaks to you in. Anything goes.",
            ]
          ),
        },
        {
          type: "field",
          key: "ns_p15_tolerate",
          placeholder: t("1. …\n2. …\n3. …", "1. …\n2. …\n3. …"),
          size: "lg",
        },
        {
          type: "callout",
          tone: "sage",
          label: t("Volgende stap", "Next step"),
          body: t(
            "Onderstreep er drie. Daarvan kies je er één om deze maand op te lossen, los te laten, of te bespreken.",
            "Underline three. From those, pick one to resolve, release, or address this month."
          ),
        },
      ],
    },

    // ─── PAGE 16 — Verborgen ja's en nee's ──────────────────────────
    {
      number: 16,
      chapter: t("Part Two · Helder zien", "Part Two · See clearly"),
      blocks: [
        { type: "kicker", text: t("honest map", "honest map") },
        {
          type: "title",
          text: t("Verborgen ja's en nee's", "Hidden yeses and noes"),
          size: "md",
          lines: ta(["Verborgen ja's", "en nee's"], ["Hidden yeses", "and noes"]),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Veel uitputting komt niet van wat je doet — maar van het verschil tussen wat je zegt en wat je voelt.",
            ],
            [
              "Much exhaustion doesn't come from what you do — but from the gap between what you say and what you feel.",
            ]
          ),
        },
        {
          type: "twoCol",
          left: {
            head: t("Ik zeg ja, maar voel nee", "I say yes, but feel no"),
            field: {
              key: "ns_p16_yes_no",
              placeholder: t(
                "Welke ja's zijn eigenlijk uitstel of plichtsgevoel?",
                "Which yeses are actually procrastination or duty?"
              ),
              size: "md",
            },
          },
          right: {
            head: t("Ik zeg nee, maar voel ja", "I say no, but feel yes"),
            field: {
              key: "ns_p16_no_yes",
              placeholder: t(
                "Wat hou je tegen omdat je het 'niet zou moeten' willen?",
                "What do you hold back because you 'shouldn't' want it?"
              ),
              size: "md",
            },
          },
        },
        {
          type: "callout",
          tone: "tan",
          label: t("Reflectie", "Reflection"),
          body: t(
            "Wat zou er gebeuren als je deze week één ja terugnam, en één nee uitsprak?",
            "What would happen if this week you took back one yes, and spoke one no?"
          ),
        },
      ],
    },

    // ─── PAGE 17 — Beperkende overtuigingen ─────────────────────────
    {
      number: 17,
      chapter: t("Part Two · Helder zien", "Part Two · See clearly"),
      blocks: [
        { type: "kicker", text: t("reframe", "reframe") },
        {
          type: "title",
          text: t("De oude verhalen onderzoeken", "Examining the old stories"),
          size: "md",
          lines: ta(
            ["De oude verhalen", "onderzoeken"],
            ["Examining the", "old stories"]
          ),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Onze gedachten voelen als waarheid, maar zijn vaak oude beschermingen. Schrijf drie zinnen op die je vaak tegen jezelf zegt — en onderzoek ze.",
            ],
            [
              "Our thoughts feel like truth, but are often old protections. Write three sentences you often say to yourself — and examine them.",
            ]
          ),
        },
        { type: "eyebrow", text: t("01 · De gedachte", "01 · The thought") },
        {
          type: "field",
          key: "ns_p17_thought1",
          placeholder: t("Bijv. 'Ik moet het alleen kunnen.'", "E.g. 'I have to do it alone.'"),
          size: "sm",
        },
        {
          type: "eyebrow",
          text: t(
            "Klopt dit altijd? · Wat zou een zachtere zin zijn?",
            "Is this always true? · What would a gentler sentence be?"
          ),
        },
        {
          type: "field",
          key: "ns_p17_softer1",
          placeholder: t("Een zachtere zin…", "A gentler sentence…"),
          size: "sm",
        },
        { type: "eyebrow", text: t("02 · De gedachte", "02 · The thought") },
        { type: "field", key: "ns_p17_thought2", size: "sm" },
        {
          type: "field",
          key: "ns_p17_softer2",
          placeholder: t("Een zachtere zin…", "A gentler sentence…"),
          size: "sm",
        },
      ],
    },

    // ─── PAGE 18 — PART III divider ─────────────────────────────────
    {
      number: 18,
      layout: "part",
      partRoman: t("Part Three", "Part Three"),
      partTitle: t("Verbinden", "Reconnect"),
      partScript: t("come home", "come home"),
      partLead: t(
        "Wat je zoekt is geen nieuw leven — het is jezelf, terug in beeld.",
        "What you're looking for isn't a new life — it's yourself, back in view."
      ),
      blocks: [],
    },

    // ─── PAGE 19 — Kernwaarden ──────────────────────────────────────
    {
      number: 19,
      chapter: t("Part Three · Verbinden", "Part Three · Reconnect"),
      blocks: [
        { type: "kicker", text: t("your core", "your core") },
        { type: "title", text: t("Jouw kernwaarden", "Your core values"), size: "md" },
        { type: "rule", align: "left" },
        { type: "audioCue", text: t("Terug naar jezelf", "Back to yourself") },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Tap eerst alle waarden aan die resoneren. Kies dan tot er **vijf** overblijven. Dat zijn jouw kompasrichtingen.",
            ],
            [
              "First tap all values that resonate. Then narrow down to **five**. Those are your compass directions.",
            ]
          ),
        },
        {
          type: "valuesPicker",
          key: "ns_p19_values",
          pickCount: 5,
          pickedHead: t("Mijn vijf kernwaarden", "My five core values"),
          pool: ta(
            [
              "rust",
              "vrijheid",
              "creativiteit",
              "familie",
              "gezondheid",
              "groei",
              "liefde",
              "eerlijkheid",
              "avontuur",
              "zekerheid",
              "verbinding",
              "schoonheid",
              "stilte",
              "spel",
              "diepgang",
              "zachtheid",
              "moed",
              "ambacht",
              "natuur",
              "plezier",
              "vertrouwen",
              "loslaten",
              "ritme",
              "zorg",
              "zelfstandigheid",
              "zingeving",
              "spiritualiteit",
              "ruimte",
              "authenticiteit",
              "kwetsbaarheid",
              "doelgericht",
              "trouw",
            ],
            [
              "calm",
              "freedom",
              "creativity",
              "family",
              "health",
              "growth",
              "love",
              "honesty",
              "adventure",
              "security",
              "connection",
              "beauty",
              "silence",
              "play",
              "depth",
              "softness",
              "courage",
              "craft",
              "nature",
              "joy",
              "trust",
              "letting go",
              "rhythm",
              "care",
              "independence",
              "meaning",
              "spirituality",
              "space",
              "authenticity",
              "vulnerability",
              "purpose",
              "loyalty",
            ]
          ),
        },
      ],
    },

    // ─── PAGE 20 — Criticus & Wijsheid ──────────────────────────────
    {
      number: 20,
      chapter: t("Part Three · Verbinden", "Part Three · Reconnect"),
      blocks: [
        { type: "kicker", text: t("two voices", "two voices") },
        {
          type: "title",
          text: t("Criticus & Wijsheid", "Critic & Wisdom"),
          size: "md",
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "In je hoofd wonen twee stemmen. De een is hard en oud, de ander zacht en wijs. Je kunt ze leren herkennen aan hun toon.",
            ],
            [
              "Two voices live in your head. One is harsh and old, the other soft and wise. You can learn to recognize them by their tone.",
            ]
          ),
        },
        {
          type: "twoCol",
          left: {
            head: t("De criticus zegt", "The critic says"),
            field: {
              key: "ns_p20_critic",
              placeholder: t(
                "'Je doet het nooit goed genoeg…'",
                "'You never do it well enough…'"
              ),
              size: "md",
            },
          },
          right: {
            head: t("De wijsheid zegt", "Wisdom says"),
            field: {
              key: "ns_p20_wisdom",
              placeholder: t(
                "'Je mag rusten. Je bent al genoeg.'",
                "'You may rest. You are already enough.'"
              ),
              size: "md",
            },
          },
        },
        {
          type: "callout",
          tone: "sage",
          label: t("Herkenningspunten", "How to tell them apart"),
          body: t(
            'De criticus klinkt urgent, hard, vaak ouderwets. De wijsheid is rustig, traag, vriendelijk. De wijsheid zegt nooit "nu meteen".',
            'The critic sounds urgent, harsh, often old-fashioned. Wisdom is calm, slow, kind. Wisdom never says "right now".'
          ),
        },
      ],
    },

    // ─── PAGE 21 — Brief van toekomstige zelf ───────────────────────
    {
      number: 21,
      chapter: t("Part Three · Verbinden", "Part Three · Reconnect"),
      blocks: [
        { type: "kicker", text: t("letter", "letter") },
        {
          type: "title",
          text: t("Brief van je toekomstige zelf", "Letter from your future self"),
          size: "md",
          lines: ta(
            ["Brief van je", "toekomstige zelf"],
            ["Letter from", "your future self"]
          ),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Stel je een versie van jezelf voor — twee jaar verder. Ze leeft het leven dat je nu nog niet helemaal durft te vragen. Wat zou ze tegen jou zeggen?",
            ],
            [
              "Imagine a version of yourself — two years from now. She lives the life you don't quite dare to ask for yet. What would she say to you?",
            ]
          ),
        },
        {
          type: "field",
          key: "ns_p21_letter",
          placeholder: t(
            "Lieve jij,\n\nIk wil je vertellen…",
            "Dear you,\n\nI want to tell you…"
          ),
          size: "lg",
        },
        {
          type: "callout",
          tone: "cream",
          label: t("Schrijftip", "Writing tip"),
          body: t(
            'Schrijf in de tegenwoordige tijd. Niet "ik zal" — maar "ik ben". Je brein gelooft wat je opschrijft.',
            'Write in the present tense. Not "I will" — but "I am". Your brain believes what you write down.'
          ),
        },
      ],
    },

    // ─── PAGE 22 — PART IV divider ──────────────────────────────────
    {
      number: 22,
      layout: "part",
      partRoman: t("Part Four", "Part Four"),
      partTitle: t("Vormgeven", "Design"),
      partScript: t("design", "design"),
      partLead: t(
        "Een leven dat past, ontwerp je niet in één dag. Je bouwt het, ritme voor ritme.",
        "A life that fits isn't designed in a day. You build it, rhythm by rhythm."
      ),
      blocks: [],
    },

    // ─── PAGE 23 — Een gewone dag ───────────────────────────────────
    {
      number: 23,
      chapter: t("Part Four · Vormgeven", "Part Four · Design"),
      blocks: [
        { type: "kicker", text: t("vision", "vision") },
        {
          type: "title",
          text: t("Een gewone dag over een jaar", "An ordinary day, a year from now"),
          size: "md",
          lines: ta(
            ["Een gewone dag", "over een jaar"],
            ["An ordinary day", "a year from now"]
          ),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Geen droomvakantie of grote prestaties — juist een normale dinsdag, een jaar verder. Beschrijf 'm in detail. Wat hoor je? Wat ruik je? Met wie ben je? Hoe voelt je lichaam?",
            ],
            [
              "Not a dream holiday or grand achievements — just an ordinary Tuesday, a year from now. Describe it in detail. What do you hear? What do you smell? Who are you with? How does your body feel?",
            ]
          ),
        },
        {
          type: "questions",
          items: ta(
            [
              "Hoe word je wakker?",
              "Wat is je eerste uur?",
              "Hoe ziet je werk eruit?",
              "Hoe voelt je middag?",
              "Wat doe je 's avonds?",
              "Met welke gedachte ga je slapen?",
            ],
            [
              "How do you wake up?",
              "What is your first hour?",
              "What does your work look like?",
              "How does your afternoon feel?",
              "What do you do in the evening?",
              "With which thought do you fall asleep?",
            ]
          ),
        },
        {
          type: "field",
          key: "ns_p23_day",
          placeholder: t(
            "Een gewone dinsdag, een jaar verder…",
            "An ordinary Tuesday, a year from now…"
          ),
          size: "lg",
        },
      ],
    },

    // ─── PAGE 24 — Grenzen ──────────────────────────────────────────
    {
      number: 24,
      chapter: t("Part Four · Vormgeven", "Part Four · Design"),
      blocks: [
        { type: "kicker", text: t("boundaries", "boundaries") },
        {
          type: "title",
          text: t("Grenzen — zacht maar duidelijk", "Boundaries — soft but clear"),
          size: "md",
          lines: ta(
            ["Grenzen — zacht", "maar duidelijk"],
            ["Boundaries — soft", "but clear"]
          ),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Een grens is geen muur. Het is een lijn die zegt: _tot hier voel ik me nog mezelf_. Drie scripts om te gebruiken — pas ze aan in je eigen woorden.",
            ],
            [
              "A boundary isn't a wall. It's a line that says: _up to here I still feel like myself_. Three scripts to use — adapt them in your own words.",
            ]
          ),
        },
        {
          type: "calloutList",
          tone: "cream",
          items: [
            {
              label: t("Vriendelijk nee", "Kind no"),
              body: t(
                '"Ik waardeer dat je aan me dacht. Het past nu niet, maar bedankt voor de uitnodiging."',
                '"I appreciate that you thought of me. It doesn\'t fit right now, but thank you for inviting me."'
              ),
            },
            {
              label: t("Tijd terugnemen", "Reclaim time"),
              body: t(
                '"Ik kom hier morgen op terug — ik wil er even rustig over nadenken."',
                '"I\'ll come back to this tomorrow — I want to think it through calmly."'
              ),
            },
            {
              label: t("Onderwerp begrenzen", "Limit the topic"),
              body: t(
                '"Dit voelt voor mij niet de juiste plek om hierover te praten. Kunnen we het ergens anders over hebben?"',
                '"This doesn\'t feel like the right place for me to talk about this. Can we talk about something else?"'
              ),
            },
          ],
        },
        {
          type: "lead",
          paragraphs: ta(
            ["_Welke grens wil jij deze week oefenen — en bij wie?_"],
            ["_Which boundary do you want to practice this week — and with whom?_"]
          ),
        },
        { type: "field", key: "ns_p24_boundary", size: "sm" },
      ],
    },

    // ─── PAGE 25 — Ochtend & avond ──────────────────────────────────
    {
      number: 25,
      chapter: t("Part Four · Vormgeven", "Part Four · Design"),
      blocks: [
        { type: "kicker", text: t("rituals", "rituals") },
        { type: "title", text: t("Ochtend & avond", "Morning & evening"), size: "md" },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              'De manier waarop je een dag opent en sluit, vormt de toon van alles ertussen. Begin klein. Hoeft niet "aesthetic" — moet vooral van jou zijn.',
            ],
            [
              'How you open and close your day shapes the tone of everything in between. Start small. Doesn\'t need to be "aesthetic" — needs to be yours.',
            ]
          ),
        },
        {
          type: "twoCol",
          left: {
            head: t("Ochtend (10 min)", "Morning (10 min)"),
            field: {
              key: "ns_p25_morning_field",
              placeholder: t(
                "Wat past bij jouw ochtend?",
                "What fits your morning?"
              ),
              size: "sm",
            },
          },
          right: {
            head: t("Avond (10 min)", "Evening (10 min)"),
            field: {
              key: "ns_p25_evening_field",
              placeholder: t(
                "Wat past bij jouw avond?",
                "What fits your evening?"
              ),
              size: "sm",
            },
          },
        },
        {
          type: "checks",
          key: "ns_p25_morning_checks",
          columns: 2,
          items: ta(
            [
              "Geen telefoon eerste 30 min",
              "Glas water + raam open",
              "3 diepe ademhalingen",
              "Eén intentie voor vandaag",
              "Korte beweging of rek",
              "Telefoon weg na 21:00",
              "Drie dingen die fijn waren",
              "Eén ding om los te laten",
              "Iets warms drinken",
              "Lichten dimmen",
            ],
            [
              "No phone first 30 min",
              "Glass of water + open window",
              "3 deep breaths",
              "One intention for today",
              "Short movement or stretch",
              "Phone away after 9pm",
              "Three things that were good",
              "One thing to let go",
              "Something warm to drink",
              "Dim the lights",
            ]
          ),
        },
        {
          type: "lead",
          paragraphs: ta(
            ["_Welke twee gewoontes (één 's morgens, één 's avonds) ga je deze week proberen?_"],
            ["_Which two habits (one morning, one evening) will you try this week?_"]
          ),
        },
        { type: "field", key: "ns_p25_two_habits", size: "sm" },
      ],
    },

    // ─── PAGE 26 — PART V divider ───────────────────────────────────
    {
      number: 26,
      layout: "part",
      partRoman: t("Part Five", "Part Five"),
      partTitle: t("Bewegen", "Move"),
      partScript: t("soft forward", "soft forward"),
      partLead: t(
        "Niet groot. Niet snel. Maar van vandaag, en van jou.",
        "Not big. Not fast. But from today, and yours."
      ),
      blocks: [],
    },

    // ─── PAGE 27 — Eén kleine stap ──────────────────────────────────
    {
      number: 27,
      chapter: t("Part Five · Bewegen", "Part Five · Move"),
      blocks: [
        { type: "kicker", text: t("framework", "framework") },
        { type: "title", text: t("Eén kleine stap", "One small step"), size: "md" },
        { type: "rule", align: "left" },
        { type: "audioCue", text: t("Zacht vooruit", "Softly forward") },
        {
          type: "lead",
          paragraphs: ta(
            ["Vier vragen die elke verandering klein en menselijk maken."],
            ["Four questions that make any change small and human."]
          ),
        },
        { type: "eyebrow", text: t("01 · Wat verlang ik écht?", "01 · What do I truly long for?") },
        { type: "field", key: "ns_p27_q1", size: "sm" },
        {
          type: "eyebrow",
          text: t(
            "02 · Wat is het allerkleinste begin daarvan?",
            "02 · What is the smallest possible beginning of that?"
          ),
        },
        { type: "field", key: "ns_p27_q2", size: "sm" },
        {
          type: "eyebrow",
          text: t("03 · Wanneer en waar doe ik dat?", "03 · When and where do I do it?"),
        },
        { type: "field", key: "ns_p27_q3", size: "sm" },
        {
          type: "eyebrow",
          text: t(
            "04 · Hoe vier ik het, ook als het wankel ging?",
            "04 · How do I celebrate, even if it wobbled?"
          ),
        },
        { type: "field", key: "ns_p27_q4", size: "sm" },
      ],
    },

    // ─── PAGE 28 — Habit stacking ───────────────────────────────────
    {
      number: 28,
      chapter: t("Part Five · Bewegen", "Part Five · Move"),
      blocks: [
        { type: "kicker", text: t("tool 04", "tool 04") },
        { type: "title", text: t("Habit stacking", "Habit stacking"), size: "md" },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Plak een nieuwe gewoonte aan een gewoonte die je al hebt. Geen wilskracht nodig — alleen een ankerpunt.",
            ],
            [
              "Stick a new habit onto a habit you already have. No willpower needed — just an anchor point.",
            ]
          ),
        },
        {
          type: "callout",
          tone: "tan",
          label: t("De formule", "The formula"),
          body: t(
            "_Nadat ik **[bestaande gewoonte]** doe, zal ik **[nieuwe gewoonte]** doen._\n\nVoorbeelden:\n· Nadat ik koffie zet, schrijf ik één zin op.\n· Nadat ik mijn tanden poets, doe ik 4 ademhalingen.\n· Nadat ik m'n schoenen aantrek, herhaal ik mijn intentie.",
            "_After I **[existing habit]**, I will **[new habit]**._\n\nExamples:\n· After I make coffee, I write down one sentence.\n· After I brush my teeth, I do 4 breaths.\n· After I put on my shoes, I repeat my intention."
          ),
        },
        {
          type: "lead",
          paragraphs: ta(
            ['_Schrijf drie eigen "stacks":_'],
            ['_Write three of your own "stacks":_']
          ),
        },
        {
          type: "field",
          key: "ns_p28_stack1",
          placeholder: t("Nadat ik …, zal ik …", "After I …, I will …"),
          size: "sm",
        },
        {
          type: "field",
          key: "ns_p28_stack2",
          placeholder: t("Nadat ik …, zal ik …", "After I …, I will …"),
          size: "sm",
        },
        {
          type: "field",
          key: "ns_p28_stack3",
          placeholder: t("Nadat ik …, zal ik …", "After I …, I will …"),
          size: "sm",
        },
      ],
    },

    // ─── PAGE 29 — 30 zachte dagen ──────────────────────────────────
    {
      number: 29,
      chapter: t("Part Five · Bewegen", "Part Five · Move"),
      blocks: [
        { type: "kicker", text: t("commitment", "commitment") },
        {
          type: "title",
          text: t("Dertig zachte dagen", "Thirty soft days"),
          size: "md",
          lines: ta(["Dertig zachte", "dagen"], ["Thirty soft", "days"]),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Kies één gewoonte. Niet vijf. Vink een vakje af voor elke dag dat je 'm hebt gedaan — ook als het maar één minuut was.",
            ],
            [
              "Pick one habit. Not five. Tick a box for every day you did it — even if it was just one minute.",
            ]
          ),
        },
        {
          type: "tracker30",
          key: "ns_p29_tracker",
          habitLabel: t("Mijn ene gewoonte", "My one habit"),
        },
        {
          type: "callout",
          tone: "sage",
          label: t("Belofte aan jezelf", "Promise to yourself"),
          body: t(
            "Mis je een dag — geen oordeel. Mis je twee dagen — terug op de derde. Dit is geen streak. Dit is een relatie.",
            "Miss a day — no judgment. Miss two days — back on the third. This isn't a streak. This is a relationship."
          ),
        },
      ],
    },

    // ─── PAGE 30 — Stemmings-log ────────────────────────────────────
    {
      number: 30,
      chapter: t("Part Five · Bewegen", "Part Five · Move"),
      blocks: [
        { type: "kicker", text: t("notice", "notice") },
        { type: "title", text: t("Stemmings-log", "Mood log"), size: "md" },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Eén week lang, twee keer per dag. Vul in: hoe voel ik me, hoeveel energie heb ik. Patronen worden zichtbaar als je niet hoeft te onthouden.",
            ],
            [
              "One week, twice a day. Note: how I feel, how much energy I have. Patterns become visible when you don't have to remember.",
            ]
          ),
        },
        {
          type: "weekLog",
          key: "ns_p30_weeklog",
          rows: ta(
            ["Ochtend", "Avond", "Energie 1-10"],
            ["Morning", "Evening", "Energy 1-10"]
          ),
          days: ta(
            ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          ),
        },
        {
          type: "lead",
          paragraphs: ta(
            ["_Welke patronen zie je aan het eind van de week?_"],
            ["_What patterns do you see at the end of the week?_"]
          ),
        },
        { type: "field", key: "ns_p30_patterns", size: "sm" },
      ],
    },

    // ─── PAGE 31 — Wat ik nodig heb van anderen ─────────────────────
    {
      number: 31,
      chapter: t("Part Five · Bewegen", "Part Five · Move"),
      blocks: [
        { type: "kicker", text: t("relational map", "relational map") },
        {
          type: "title",
          text: t("Wat ik nodig heb van anderen", "What I need from others"),
          size: "md",
          lines: ta(
            ["Wat ik nodig heb", "van anderen"],
            ["What I need", "from others"]
          ),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Veel mensen weten niet wat ze nodig hebben totdat ze het missen. En veel mensen om jou heen zouden je graag helpen — als ze wisten hóe.",
              "Schrijf het uit, ook al voelt het ongemakkelijk. Je hoeft het niet te delen. Het opschrijven alleen al maakt iets helder.",
            ],
            [
              "Many people don't know what they need until they miss it. And many people around you would gladly help — if they knew how.",
              "Write it out, even if it feels uncomfortable. You don't have to share it. Just writing it down makes something clearer.",
            ]
          ),
        },
        {
          type: "twoCol",
          left: {
            head: t("Wat ik nodig heb", "What I need"),
            field: {
              key: "ns_p31_need",
              placeholder: t(
                "Tijd alleen · een luisterend oor · iemand die niet adviseert · een knuffel zonder vragen…",
                "Time alone · a listening ear · someone who doesn't advise · a hug without questions…"
              ),
              size: "md",
            },
          },
          right: {
            head: t("Wat ik te bieden heb", "What I have to offer"),
            field: {
              key: "ns_p31_offer",
              placeholder: t(
                "Aanwezigheid · een maaltijd · stilte naast iemand · een eerlijk gesprek…",
                "Presence · a meal · silence beside someone · an honest conversation…"
              ),
              size: "md",
            },
          },
        },
        {
          type: "callout",
          tone: "tan",
          label: t("Reflectie", "Reflection"),
          body: t(
            "Wie in jouw leven mag dit weten? Soms is het uitspreken van één behoefte, tegen één mens, het stilste maar diepste werk van een seizoen.",
            "Who in your life may know this? Sometimes speaking one need, to one person, is the quietest yet deepest work of a season."
          ),
        },
      ],
    },

    // ─── PAGE 32 — Mantra's & ankers ────────────────────────────────
    {
      number: 32,
      chapter: t("Part Five · Bewegen", "Part Five · Move"),
      blocks: [
        { type: "kicker", text: t("daily anchors", "daily anchors") },
        {
          type: "title",
          text: t("Zeven mantra's voor zachte dagen", "Seven mantras for soft days"),
          size: "md",
          lines: ta(
            ["Zeven mantra's voor", "zachte dagen"],
            ["Seven mantras for", "soft days"]
          ),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Een mantra is geen afkortrouting naar geluk — het is een zin die je zenuwstelsel langzaam leert dat het veilig is. Lees ze. Onderstreep er één per dag. Zeg 'm hardop voor de spiegel, of zachtjes voor je in slaap valt.",
            ],
            [
              "A mantra isn't a shortcut to happiness — it's a sentence that slowly teaches your nervous system that it is safe. Read them. Underline one each day. Say it out loud in the mirror, or quietly before you fall asleep.",
            ]
          ),
        },
        {
          type: "calloutList",
          tone: "cream",
          items: [
            {
              label: t("Maandag", "Monday"),
              body: t(
                "_Ik mag traag beginnen. Mijn dag wacht op mij, niet andersom._",
                "_I may begin slowly. My day waits for me, not the other way around._"
              ),
            },
            {
              label: t("Dinsdag", "Tuesday"),
              body: t(
                "_Wat ik voel hoeft niet weg. Het mag erbij zijn._",
                "_What I feel doesn't have to go away. It may be here too._"
              ),
            },
            {
              label: t("Woensdag", "Wednesday"),
              body: t(
                "_Ik ben geen taak die afgewerkt moet. Ik ben een mens die geleefd wordt._",
                "_I'm not a task to complete. I'm a human being lived._"
              ),
            },
            {
              label: t("Donderdag", "Thursday"),
              body: t(
                "_Ik mag rusten zonder het verdiend te hebben._",
                "_I may rest without having earned it._"
              ),
            },
            {
              label: t("Vrijdag", "Friday"),
              body: t(
                "_Vandaag mag genoeg zijn, ook als het klein is._",
                "_Today may be enough, even when it is small._"
              ),
            },
            {
              label: t("Zaterdag", "Saturday"),
              body: t(
                "_Mijn ja is alleen waardevol als mijn nee ook bestaat._",
                "_My yes is only valuable if my no also exists._"
              ),
            },
            {
              label: t("Zondag", "Sunday"),
              body: t(
                "_Ik leef niet voor de drukte. Ik leef voor de momenten ertussenin._",
                "_I don't live for the busyness. I live for the moments in between._"
              ),
            },
          ],
        },
        {
          type: "lead",
          paragraphs: ta(
            ["_Welke mantra raakt iets in je vandaag — en waarom?_"],
            ["_Which mantra touches something in you today — and why?_"]
          ),
        },
        { type: "field", key: "ns_p32_mantra", size: "sm" },
      ],
    },

    // ─── PAGE 33 — Seizoens-ritueel ─────────────────────────────────
    {
      number: 33,
      chapter: t("Part Five · Bewegen", "Part Five · Move"),
      blocks: [
        { type: "kicker", text: t("season ritual", "season ritual") },
        {
          type: "title",
          text: t("Maandelijks bij jezelf inchecken", "A monthly check-in with yourself"),
          size: "md",
          lines: ta(
            ["Maandelijks bij", "jezelf inchecken"],
            ["A monthly", "check-in with yourself"]
          ),
        },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Eén keer per maand — dezelfde dag, dezelfde plek, dezelfde thee. Geen prestatie, geen verslag. Alleen vier vragen die je weer naar je middelpunt brengen.",
              "Zet 'm in je agenda. Op de eerste zondag, of de laatste. Niet langer dan twintig minuten.",
            ],
            [
              "Once a month — same day, same spot, same tea. No achievement, no report. Just four questions that bring you back to your center.",
              "Put it in your calendar. On the first Sunday, or the last. No longer than twenty minutes.",
            ]
          ),
        },
        {
          type: "callout",
          tone: "tan",
          label: t("De vier vragen", "The four questions"),
          body: t(
            "**1.** Wat heeft me deze maand het meest gegeven?\n**2.** Wat heeft me het meest gekost?\n**3.** Wat wil ik volgende maand minder doen?\n**4.** Wat wil ik volgende maand zachter doen?",
            "**1.** What gave me the most this month?\n**2.** What cost me the most?\n**3.** What do I want to do less of next month?\n**4.** What do I want to do more gently next month?"
          ),
        },
        {
          type: "eyebrow",
          text: t("Deze maand · korte schets", "This month · a brief sketch"),
        },
        {
          type: "field",
          key: "ns_p33_month",
          placeholder: t(
            "Wat valt je op als je terugkijkt op de afgelopen weken?",
            "What stands out as you look back over the past weeks?"
          ),
          size: "md",
        },
        {
          type: "callout",
          tone: "sage",
          label: t("Belofte", "Promise"),
          body: t(
            "Een ritueel dat één keer per maand terugkomt, doet meer voor je rust dan een retraite van een week. Continuïteit is de stille superkracht van zachtheid.",
            "A ritual that returns once a month does more for your calm than a week-long retreat. Continuity is the quiet superpower of softness."
          ),
        },
      ],
    },

    // ─── PAGE 34 — Even stilstaan + herhaling weerbericht ───────────
    {
      number: 34,
      chapter: t("Integratie", "Integration"),
      blocks: [
        { type: "kicker", text: t("integration", "integration") },
        { type: "title", text: t("Even stilstaan", "Pause for a moment"), size: "md" },
        { type: "rule", align: "left" },
        {
          type: "lead",
          paragraphs: ta(
            [
              "Je bent door iets bijzonders gegaan. Voordat je dit boek dichtdoet — een tweede weerbericht, en drie eerlijke vragen.",
              "_Geef opnieuw elk gebied een score van 1 tot 10. Vergelijk straks met pagina 5._",
            ],
            [
              "You've been through something meaningful. Before you close this book — a second weather report, and three honest questions.",
              "_Give each area a score from 1 to 10 again. Then compare with page 5._",
            ]
          ),
        },
        {
          type: "scaleGroup",
          items: [
            { key: "ns_p34_body", label: t("Lichaam", "Body") },
            { key: "ns_p34_head", label: t("Hoofd", "Head") },
            { key: "ns_p34_heart", label: t("Hart", "Heart") },
            { key: "ns_p34_energy", label: t("Energie", "Energy") },
            { key: "ns_p34_calm", label: t("Rust", "Calm") },
          ],
        },
        {
          type: "questions",
          items: ta(
            [
              "Wat is er zacht veranderd in je dagelijkse leven?",
              "Welk inzicht wil je niet meer vergeten?",
              "Wat is je drie zinnen waardig om mee te nemen?",
            ],
            [
              "What has gently changed in your daily life?",
              "Which insight do you not want to forget?",
              "What is worth three sentences to take with you?",
            ]
          ),
        },
        {
          type: "field",
          key: "ns_p34_integration",
          placeholder: t("Voel even na…", "Sit with it for a moment…"),
          size: "lg",
        },
        {
          type: "callout",
          tone: "tan",
          label: t("Een laatste opmerking", "One last note"),
          body: t(
            "Wat je hier opschrijft, lees je over een jaar terug. Schrijf alsof je een brief aan je toekomstige zelf achterlaat — want dat doe je ook.",
            "What you write here, you'll read back a year from now. Write as if you're leaving a letter for your future self — because you are."
          ),
        },
      ],
    },

    // ─── PAGE 35 — Doorstroom ───────────────────────────────────────
    {
      number: 35,
      layout: "centered",
      chapter: t("Tot ziens", "Until next time"),
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
        { type: "scriptLine", text: t("Naar jezelf.", "To yourself."), size: 32 },
        {
          type: "lead",
          center: true,
          paragraphs: ta(
            ["Dit is nog maar het begin."],
            ["This is just the beginning."]
          ),
        },
        {
          type: "ctaCard",
          eyebrow: t("✿ The Beautiful Life", "✿ The Beautiful Life"),
          title: t("Verder bouwen?", "Ready to build further?"),
          body: t(
            "Drie paden, één doel: een leven dat past bij wie jij echt bent.\nWanneer je klaar bent voor de volgende stap, sta ik er.",
            "Three paths, one goal: a life that fits who you really are.\nWhen you're ready for the next step, I'm here."
          ),
        },
        {
          type: "signature",
          name: "Marion Lubach",
          role: t("jouw creatief levensmentor", "your creative lifestyle mentor"),
        },
      ],
    },
  ],
};
