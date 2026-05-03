/**
 * Notitie-templates per booking-type. Marion krijgt voor elke call-type
 * exact dezelfde structuur — consistentie tussen sessies.
 *
 * Een template is een lijst velden; elke veld heeft een key (DB-veilig),
 * label (UI), placeholder en optioneel een type (text = textarea, scale = 1-10).
 */

export type CallTemplateField = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "scale";
  rows?: number;
};

export type CallTemplate = {
  key: string;
  title: string;
  description: string;
  fields: CallTemplateField[];
};

export const CALL_TEMPLATES: Record<string, CallTemplate> = {
  one_on_one_60: {
    key: "one_on_one_60",
    title: "1-op-1 sessie (60 min)",
    description:
      "Standaard sessie-template. Gebruik bij elke 60-min call zodat elke sessie consistent gestructureerd is.",
    fields: [
      {
        key: "current_state",
        label: "Hoe is het nu — eerste indruk",
        placeholder:
          "Energie, gezicht, lichaam, eerste woorden. Wat valt op?",
        rows: 3,
      },
      {
        key: "main_topic",
        label: "Wat speelt er — hoofdthema",
        placeholder:
          "Waar wil ze het over hebben? Welk levensgebied / vraag staat centraal?",
        rows: 4,
      },
      {
        key: "scale_calm",
        label: "Score rust 1–10 (begin van de sessie)",
        type: "scale",
      },
      {
        key: "scale_clarity",
        label: "Score helderheid 1–10 (begin van de sessie)",
        type: "scale",
      },
      {
        key: "patterns",
        label: "Patronen die ik zie (overtuigingen, bescherm-mechanismen)",
        placeholder:
          "Wat herhaalt zich? Welke oude verhalen klinken door?",
        rows: 3,
      },
      {
        key: "insights",
        label: "Inzichten tijdens de sessie",
        placeholder:
          "Wat verschuift? Welk moment van besef? Citaat van de klant?",
        rows: 4,
      },
      {
        key: "homework",
        label: "Wat neemt ze mee — kleine stap",
        placeholder:
          "Eén concrete oefening, observatie of micro-actie voor deze week.",
        rows: 3,
      },
      {
        key: "next_step",
        label: "Vervolgstap / volgende afspraak",
        placeholder:
          "Datum, doel, of: 'wachten tot ze terugkomt'.",
        rows: 2,
      },
      {
        key: "marion_notes",
        label: "Mijn eigen observaties (privé)",
        placeholder:
          "Zaken die ik wil onthouden — niet voor de klant.",
        rows: 3,
      },
    ],
  },

  return_to_calm_30: {
    key: "return_to_calm_30",
    title: "Verdiepingscall — Return to Calm (30 min)",
    description:
      "Korte verdieping voor klanten met het werkboek Return to Calm. Focus op één kernvraag.",
    fields: [
      {
        key: "workbook_pages",
        label: "Welke pagina's / oefeningen raakten",
        placeholder:
          "Pagina-nummers of titels die ze noemt. Wat kwam op?",
        rows: 3,
      },
      {
        key: "key_insight",
        label: "Het belangrijkste inzicht van deze 30 min",
        placeholder:
          "Eén zin die de hele call samenvat.",
        rows: 2,
      },
      {
        key: "blockage",
        label: "Wat houdt nog tegen",
        placeholder:
          "Welke stap durft ze nog niet, welk gevoel zit in de weg?",
        rows: 3,
      },
      {
        key: "micro_action",
        label: "Micro-actie voor komende week",
        placeholder:
          "Iets heel kleins. Eén minuut per dag is genoeg.",
        rows: 2,
      },
      {
        key: "follow_up",
        label: "Vervolg — passend pakket?",
        placeholder:
          "Is een Ikigai-traject of Experience nu zinnig? Of laten landen?",
        rows: 2,
      },
    ],
  },
};

export function getCallTemplate(bookingType: string | null | undefined): CallTemplate {
  if (!bookingType) return CALL_TEMPLATES.one_on_one_60;
  return CALL_TEMPLATES[bookingType] ?? CALL_TEMPLATES.one_on_one_60;
}
