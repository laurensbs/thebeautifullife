import type { T } from "./types";

const t = (nl: string, en: string): T => ({ nl, en });

export const DICT = {
  // ============ COMMON ============
  common: {
    backToHome: t("terug naar home", "back to home"),
    back: t("terug", "back"),
    open: t("Open", "Open"),
    save: t("Opslaan", "Save"),
    saving: t("Opslaan…", "Saving…"),
    saved: t("Opgeslagen", "Saved"),
    autoSaved: t("Auto-saved", "Auto-saved"),
    logout: t("Uitloggen", "Log out"),
    login: t("Inloggen", "Log in"),
    loading: t("Laden…", "Loading…"),
    optional: t("optioneel", "optional"),
    yourEmail: t("Je e-mailadres", "Your email"),
    yourName: t("Je naam", "Your name"),
    submit: t("Versturen", "Submit"),
    error: t("Er ging iets mis. Probeer het opnieuw.", "Something went wrong. Please try again."),
    testMode: t("Test-modus", "Test mode"),
    next: t("volgende", "next"),
    prev: t("vorige", "previous"),
  },

  // ============ NAV ============
  nav: {
    packages: t("Pakketten", "Packages"),
    myPath: t("Mijn pad", "My path"),
    workbook: t("Werkboek", "Workbook"),
    menu: t("menu", "menu"),
    closeMenu: t("Sluit menu", "Close menu"),
    openMenu: t("Open menu", "Open menu"),
    home: t("home", "home"),
  },

  // ============ FOOTER ============
  footer: {
    tagline: t("the beginning of your beautiful life", "the beginning of your beautiful life"),
    intro: t(
      "Voor vrouwen die verlangen naar rust, balans en een leven dat goed voelt en moeiteloos begint te stromen.",
      "For women who long for calm, balance, and a life that feels right and starts to flow effortlessly."
    ),
    discover: t("Ontdek", "Discover"),
    contact: t("Contact", "Contact"),
    signoff: t("liefs, Marion", "with love, Marion"),
    privacy: t("Privacy", "Privacy"),
  },

  // ============ HERO ============
  hero: {
    threePaths: t("3 Paths. One Goal.", "3 Paths. One Goal."),
    yourIdealLife: t("Your Ideal Life.", "Your Ideal Life."),
    lead: t(
      "Van helderheid tot transformatie. Ik help je een leven te ontwerpen dat aanvoelt als jouw thuis.",
      "From clarity to transformation. I help you design a life that feels like coming home to yourself."
    ),
    feat: {
      clarity: t("More Clarity", "More Clarity"),
      balance: t("More Balance", "More Balance"),
      freedom: t("More Freedom", "More Freedom"),
      you: t("More You", "More You"),
    },
    imageAlt: t(
      "The Beautiful Life — een vrouw in rust en balans",
      "The Beautiful Life — a woman in calm and balance"
    ),
  },

  // ============ PACKAGES (homepage cards + detail page) ============
  packages: {
    kicker1: t("Package 1", "Package 1"),
    kicker2: t("Package 2", "Package 2"),
    kicker3: t("Package 3", "Package 3"),

    name: {
      ikigai: t("The Ikigai Story", "The Ikigai Story"),
      alignment: t("From Insight to Alignment", "From Insight to Alignment"),
      experience: t("The Beautiful Life Experience", "The Beautiful Life Experience"),
    },
    nameLines: {
      ikigai: { nl: ["The Ikigai Story"], en: ["The Ikigai Story"] },
      alignment: {
        nl: ["From Insight", "to Alignment"],
        en: ["From Insight", "to Alignment"],
      },
      experience: {
        nl: ["The Beautiful Life", "Experience"],
        en: ["The Beautiful Life", "Experience"],
      },
    } as Record<"ikigai" | "alignment" | "experience", { nl: string[]; en: string[] }>,

    tagline: {
      ikigai: t(
        "Ontdek wie je bent, wat je wilt en waar je naartoe gaat.",
        "Discover who you are, what you want, and where you're going."
      ),
      alignment: t(
        "Bouw structuur, creëer rust en ontwerp een leven dat je ondersteunt.",
        "Build structure, create calm, and design a life that supports you."
      ),
      experience: t(
        "8 dagen transformatie & persoonlijke coaching om je droomleven te bouwen.",
        "8 days of transformation & personal coaching to build your dream life."
      ),
    },

    quote: {
      ikigai: t(
        "Helderheid is de eerste stap naar verandering.",
        "Clarity is the first step to change."
      ),
      alignment: t(
        "Een leven dat bij jou past, niet andersom.",
        "A life that fits you, not the other way around."
      ),
      experience: t(
        "Reset. Reconnect. Recreate your life.",
        "Reset. Reconnect. Recreate your life."
      ),
    },

    features: {
      ikigai: {
        nl: [
          "Wie ben ik, werkelijk?",
          "Hoe ziet mijn ideale leven eruit?",
          "Wat zijn mijn doelen & dromen?",
          "Wat geeft mij energie?",
          "Ontdek je Ikigai",
          "Helderheid & richting in 3–5 stappen",
        ],
        en: [
          "Who am I, really?",
          "What does my ideal life look like?",
          "What are my goals & dreams?",
          "What gives me energy?",
          "Discover your Ikigai",
          "Clarity & direction in 3–5 steps",
        ],
      },
      alignment: {
        nl: [
          "Maak je hoofd leeg & krijg overzicht",
          "Structuur die voor jou werkt",
          "Dagelijkse ritmes & gewoontes",
          "Grenzen stellen & balans vinden",
          "Lichte persoonlijke begeleiding",
          "Een praktisch plan voor je ideale leven",
        ],
        en: [
          "Clear your mind & gain perspective",
          "Structure that works for you",
          "Daily rhythms & habits",
          "Set boundaries & find balance",
          "Light personal guidance",
          "A practical plan for your ideal life",
        ],
      },
      experience: {
        nl: [
          "8-daagse Beautiful Life Experience",
          "Self-care & wellness pakket",
          "Luxe werkboek",
          "Ontspanning, vrije tijd & ervaringen",
          "1-op-1 persoonlijke coaching",
          "Persoonlijk levensplan",
          "De fundering van je ideale leven",
        ],
        en: [
          "8-day Beautiful Life Experience",
          "Self-care & wellness package",
          "Luxury workbook",
          "Relaxation, free time & experiences",
          "1-on-1 personal coaching",
          "Personal life plan",
          "The foundation of your ideal life",
        ],
      },
    } as Record<"ikigai" | "alignment" | "experience", { nl: string[]; en: string[] }>,
  },

  // ============ WHAT YOU GET ============
  whatYouGet: {
    title: t("What You Get", "What You Get"),
    items: {
      nl: [
        "Meer helderheid over wie je bent en wat je wilt",
        "Structuur & overzicht in je dagelijks leven",
        "Gewoontes die je energie geven",
        "Meer tijd, vrijheid & vreugde",
        "Een leven dat klopt — van binnen en van buiten",
      ],
      en: [
        "More clarity about who you are and what you want",
        "Structure & overview in your daily life",
        "Habits that give you energy",
        "More time, freedom & joy",
        "A life that feels right — inside and out",
      ],
    },
  },

  // ============ CLOSING ============
  closing: {
    caps: t(
      "Your Life. Your Choice. Your Beautiful Story.",
      "Your Life. Your Choice. Your Beautiful Story."
    ),
    line: t(
      "Let's create your beautiful life together.",
      "Let's create your beautiful life together."
    ),
  },

  // ============ PACKAGE PAGE ============
  pkgPage: {
    whatYouGet: t("Wat je krijgt", "What you get"),
    howItWorks: t("Hoe het werkt", "How it works"),
    enroll: t("Aanmelden", "Enroll"),
    helperIkigai: t(
      "Vul onderstaand formulier in om te starten.",
      "Fill in the form below to get started."
    ),
    helperAlignment: t(
      "Vul onderstaand formulier in om te starten.",
      "Fill in the form below to get started."
    ),
    helperExperience: t(
      "Je vult eerst dit formulier in. Marion neemt daarna persoonlijk contact op.",
      "Fill in this form first. Marion will then personally get in touch."
    ),
    cta: t("Ga verder", "Continue"),
    ctaExperience: t("Verstuur mijn aanmelding", "Send my application"),
    consent: t(
      "Door te versturen ga je akkoord dat Marion contact met je opneemt over dit pakket. Je gegevens worden niet gedeeld met derden.",
      "By submitting, you agree that Marion will contact you about this package. Your details are never shared with third parties."
    ),

    steps: {
      ikigai: {
        nl: [
          "Je rondt je aanmelding af",
          "Je betaalt veilig met iDEAL of creditcard (binnenkort via Mollie)",
          "Je vult de Ikigai-vragenlijst in (~20 min)",
          "Marion stuurt jouw persoonlijke Ikigai-document binnen 5 werkdagen",
        ],
        en: [
          "You complete your enrollment",
          "You pay securely by iDEAL or credit card (Mollie, coming soon)",
          "You complete the Ikigai questionnaire (~20 min)",
          "Marion sends your personal Ikigai document within 5 working days",
        ],
      },
      alignment: {
        nl: [
          "Je rondt je aanmelding af",
          "Je betaalt veilig (binnenkort via Mollie)",
          "Je vult de uitgebreide vragenlijst in",
          "We plannen samen 1–2 calls (Zoom)",
          "Je ontvangt een praktisch plan op maat",
        ],
        en: [
          "You complete your enrollment",
          "You pay securely (Mollie, coming soon)",
          "You complete the in-depth questionnaire",
          "We schedule 1–2 calls together (Zoom)",
          "You receive a practical, tailored plan",
        ],
      },
      experience: {
        nl: [
          "Je rondt je aanmelding af",
          "Marion neemt persoonlijk contact met je op voor een kennismakingsgesprek",
          "Samen bepalen we datum, locatie en wensen",
          "Na bevestiging volgt de betaling",
          "Je 8-daagse Beautiful Life Experience start",
        ],
        en: [
          "You complete your enrollment",
          "Marion personally contacts you for an introductory call",
          "Together we set the dates, location and your wishes",
          "After confirmation, the payment follows",
          "Your 8-day Beautiful Life Experience begins",
        ],
      },
    } as Record<"ikigai" | "alignment" | "experience", { nl: string[]; en: string[] }>,
  },

  // ============ INTAKE FIELDS ============
  intake: {
    fields: {
      firstName: t("Voornaam", "First name"),
      firstNamePlaceholder: t("Hoe mag ik je noemen?", "What may I call you?"),
      contact: t("E-mailadres", "Email"),
      contactPlaceholder: t("naam@voorbeeld.nl", "name@example.com"),
      phone: t("Telefoonnummer", "Phone number"),
      phonePlaceholder: t("+31 6 …", "+31 6 …"),
      phoneHint: t(
        "Optioneel, maar handig als Marion contact opneemt voor de planning.",
        "Optional, but helpful if Marion needs to reach you for scheduling."
      ),

      // Ikigai
      biggestQuestion: t(
        "Wat is je grootste vraag aan jezelf op dit moment?",
        "What is your biggest question to yourself right now?"
      ),
      biggestQuestionPlaceholder: t(
        "Bijv. wie ben ik nu echt, los van wat anderen verwachten?",
        "E.g. who am I really, separate from what others expect?"
      ),
      currentClarity: t(
        "Hoe helder voelt je richting nu?",
        "How clear does your direction feel right now?"
      ),
      discoveredVia: t(
        "Hoe ken je The Beautiful Life?",
        "How did you find The Beautiful Life?"
      ),
      discoveredViaOptions: {
        nl: ["Instagram", "Via een vriend(in)", "Google", "Anders"],
        en: ["Instagram", "Through a friend", "Google", "Other"],
      },

      // Alignment
      lifeSituation: t(
        "Beschrijf kort je huidige levenssituatie",
        "Briefly describe your current life situation"
      ),
      lifeSituationPlaceholder: t(
        "Werk, gezin, woonsituatie — wat je relevant vindt.",
        "Work, family, living situation — whatever you find relevant."
      ),
      biggestWish: t(
        "Wat zou er over 6 maanden anders mogen zijn?",
        "What would you like to be different in 6 months?"
      ),
      energyLevel: t(
        "Hoeveel energie ervaar je in een gemiddelde week?",
        "How much energy do you experience in an average week?"
      ),
      balanceLevel: t(
        "Hoe zit het met je balans tussen geven en ontvangen?",
        "How is your balance between giving and receiving?"
      ),
      preferredCallWindow: t(
        "Wanneer ben je doorgaans goed bereikbaar voor een call?",
        "When are you usually available for a call?"
      ),
      callWindowOptions: {
        nl: [
          "Doordeweeks overdag",
          "Doordeweeks 's avonds",
          "Weekend overdag",
          "Flexibel",
        ],
        en: [
          "Weekdays during the day",
          "Weekday evenings",
          "Weekends during the day",
          "Flexible",
        ],
      },

      // Experience
      address: t(
        "Adres (voor het wellness pakket)",
        "Address (for the wellness package)"
      ),
      addressPlaceholder: t(
        "Straat, huisnummer, postcode, woonplaats",
        "Street, number, postcode, city"
      ),
      preferredStart: t("Gewenste startperiode", "Preferred start period"),
      startOptions: {
        nl: [
          "Komende 4 weken",
          "Binnen 1–2 maanden",
          "Binnen 3–6 maanden",
          "Nog flexibel",
        ],
        en: [
          "Within 4 weeks",
          "Within 1–2 months",
          "Within 3–6 months",
          "Flexible",
        ],
      },
      dietAllergies: t(
        "Dieetwensen of allergieën",
        "Dietary preferences or allergies"
      ),
      dietAllergiesPlaceholder: t(
        "Vegetarisch, glutenvrij, allergieën, etc. — of 'geen'.",
        "Vegetarian, gluten-free, allergies, etc. — or 'none'."
      ),
      motivation: t(
        "Wat maakt dat je nu kiest voor 8 dagen volledig voor jezelf?",
        "What makes you choose 8 days entirely for yourself, right now?"
      ),
      motivationPlaceholder: t(
        "Neem hier rustig de tijd. Hoe meer Marion vooraf van je weet, hoe persoonlijker de ervaring.",
        "Take your time here. The more Marion knows in advance, the more personal the experience."
      ),
      emergencyContact: t(
        "Noodcontact (naam + telefoon)",
        "Emergency contact (name + phone)"
      ),
      emergencyContactHint: t(
        "Iemand die we kunnen bereiken tijdens de Experience.",
        "Someone we can reach during the Experience."
      ),

      // Scale labels
      scaleLow: t("helemaal niet", "not at all"),
      scaleHigh: t("helemaal wel", "completely"),

      choose: t("— kies —", "— choose —"),

      // Generic field validation
      pleaseFill: t(
        "Vul deze vraag in om door te gaan.",
        "Please answer this question to continue."
      ),

      submitting: t("Bezig met verzenden…", "Sending…"),
    },
  },

  // ============ THANK YOU ============
  thanks: {
    word: t("Dankjewel", "Thank you"),
    title: t("Je aanmelding is binnen", "Your enrollment has arrived"),
    next: {
      ikigai: t(
        "Houd je inbox in de gaten — je ontvangt nu twee mails: je persoonlijke reflectievragenlijst, én je werkboek 'Return to Calm' om in jouw eigen tempo in te vullen.",
        "Check your inbox — you'll receive two emails: your personal reflection questionnaire, and your workbook 'Return to Calm' to fill in at your own pace."
      ),
      alignment: t(
        "Je ontvangt zo de bevestiging én je werkboek 'From Noise to Structure' per e-mail. Marion neemt binnen 2 werkdagen contact op om de eerste call te plannen.",
        "You'll receive your confirmation and your workbook 'From Noise to Structure' by email. Marion will contact you within 2 working days to schedule the first call."
      ),
      experience: t(
        "Marion neemt persoonlijk contact met je op voor een kennismakingsgesprek. Je ontvangt alvast je werkboek 'Return to Calm' als zachte voorbereiding.",
        "Marion will personally contact you for an introductory call. You'll receive your workbook 'Return to Calm' as gentle preparation."
      ),
      generic: t(
        "Houd je inbox in de gaten voor de volgende stap.",
        "Check your inbox for the next step."
      ),
    },
    toPortal: t("Naar mijn pad", "To my path"),
    portalNote: t(
      "In jouw eigen portaal \"Mijn pad\" zie je je voortgang, je werkboek en alle afspraken op één plek. Login via je e-mail.",
      "In your personal portal \"My path\" you'll find your progress, your workbook and all appointments in one place. Log in with your email."
    ),
  },

  // ============ CLIENT PORTAL ============
  portal: {
    welcomeBack: t("welkom terug,", "welcome back,"),
    intro: t(
      "Hier vind je jouw pad — de pakketten waarop je bent ingeschreven, je werkboeken, en alles wat we samen gaande hebben.",
      "Here you'll find your path — the packages you're enrolled in, your workbooks, and everything we have going together."
    ),
    myPath: t("Mijn pad", "My path"),
    myDetails: t("Mijn gegevens", "My details"),
    progress: t("Voortgang", "Progress"),
    enrolled: t("Aangemeld", "Enrolled"),
    paid: t("Voldaan", "Paid"),
    open: t("Open", "Open"),
    scheduledCall: t("Geplande call", "Scheduled call"),
    zoomLink: t("Zoom-link", "Zoom link"),
    workbook: t("Werkboek", "Workbook"),
    fields: t("velden", "fields"),
    fillQuestionnaire: t(
      "Vul je reflectievragenlijst in",
      "Complete your reflection questionnaire"
    ),
    email: t("E-mail", "Email"),
    phone: t("Telefoon", "Phone"),
    detailsHint: t(
      "Wijzigingen doorgeven? Mail",
      "Need to change details? Email"
    ),
    askAnotherPath: t(
      "Wil je een ander pad starten? Bekijk de drie pakketten en kies wanneer jij eraan toe bent.",
      "Want to start another path? Browse the three packages and choose when you're ready."
    ),
    seePackages: t("Bekijk de pakketten", "View the packages"),
    noPackagesYet: t("Nog geen pakket gestart.", "No package started yet."),
    seeThreePaths: t(
      "Bekijk de drie paden en kies wanneer jij eraan toe bent.",
      "View the three paths and choose when you're ready."
    ),

    // Login
    loginKicker: t("welkom terug", "welcome back"),
    loginTitle: t("Mijn pad", "My path"),
    loginSent: t("Check je inbox.", "Check your inbox."),
    loginSentBody: t(
      "Als je e-mailadres bekend is hebben we je een persoonlijke link gestuurd.",
      "If your email is registered, we've sent you a personal link."
    ),
    loginValid: t("De link blijft 30 minuten geldig.", "The link is valid for 30 minutes."),
    loginCta: t("Stuur mij de link", "Send me the link"),
    loginNoPassword: t(
      "Geen wachtwoord, geen gedoe. We sturen je een veilige link per mail.",
      "No password, no fuss. We'll email you a secure link."
    ),
    loginErrorExpired: t(
      "Deze link is verlopen. Vraag een nieuwe aan.",
      "This link has expired. Please request a new one."
    ),
    loginErrorInvalid: t(
      "Deze link is niet meer geldig.",
      "This link is no longer valid."
    ),
  },

  // ============ WORKBOOK ============
  workbook: {
    welcomeBack: t("Welkom terug, ", "Welcome back, "),
    backToPortal: t("← Mijn pad", "← My path"),
    print: t("Print / PDF", "Print / PDF"),

    loginTitle: t("Open jouw werkboek", "Open your workbook"),
    loginKicker: t("welkom terug", "welcome back"),
    loginCta: t("Stuur mij de link", "Send me the link"),
    loginInbox: t("Check je inbox.", "Check your inbox."),
    loginInboxBody: t(
      "Als dit e-mailadres bekend is, hebben we je een persoonlijke link gestuurd.",
      "If this email is registered, we've sent you a personal link."
    ),
    loginValid: t("De link blijft 30 minuten geldig.", "The link is valid for 30 minutes."),
    loginNoPassword: t(
      "We sturen je een veilige link. Geen wachtwoord, geen gedoe.",
      "We'll send you a secure link. No password, no fuss."
    ),
    loginErrorExpired: t(
      "Deze link is verlopen. Vraag een nieuwe aan.",
      "This link has expired. Please request a new one."
    ),
    loginErrorInvalid: t(
      "Deze link is niet meer geldig.",
      "This link is no longer valid."
    ),
    loginErrorNoAccess: t(
      "Geen werkboek gevonden bij dit e-mailadres.",
      "No workbook found for this email address."
    ),
  },

  // ============ STATUS LABELS ============
  status: {
    aangemeld: t("Aangemeld", "Enrolled"),
    betaald: t("Betaald", "Paid"),
    vragenlijst_ingevuld: t("Vragenlijst ingevuld", "Questionnaire completed"),
    geleverd: t("Geleverd", "Delivered"),
    call_gepland: t("Call gepland", "Call scheduled"),
    plan_geleverd: t("Plan geleverd", "Plan delivered"),
    kennismaking_gepland: t("Kennismaking gepland", "Intro call scheduled"),
    loopt: t("Loopt", "In progress"),
    afgerond: t("Afgerond", "Completed"),
    geannuleerd: t("Geannuleerd", "Cancelled"),
  },

  // ============ META (SEO) ============
  meta: {
    homeTitle: t(
      "The Beautiful Life — 3 Paden. Eén Doel. Jouw Ideale Leven.",
      "The Beautiful Life — 3 Paths. One Goal. Your Ideal Life."
    ),
    homeDesc: t(
      "Van helderheid tot transformatie. Drie pakketten om een leven te ontwerpen dat aansluit bij wie je bent.",
      "From clarity to transformation. Three packages to design a life that aligns with who you are."
    ),
  },
} as const;

export type Dict = typeof DICT;
