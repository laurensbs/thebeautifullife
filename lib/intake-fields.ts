import type { IntakeField } from "@/components/intake/IntakeForm";
import type { PackageSlug } from "./packages";

export const BASE_FIELDS: IntakeField[] = [
  {
    name: "firstName",
    label: "Voornaam",
    type: "text",
    required: true,
    placeholder: "Hoe mag ik je noemen?",
  },
  {
    name: "contact",
    label: "E-mailadres",
    type: "email",
    required: true,
    placeholder: "naam@voorbeeld.nl",
  },
  {
    name: "phone",
    label: "Telefoonnummer",
    type: "tel",
    placeholder: "+31 6 …",
    hint: "Optioneel, maar handig als Marion contact opneemt voor de planning.",
  },
];

export const PACKAGE_INTAKE: Record<PackageSlug, IntakeField[]> = {
  ikigai: [
    {
      name: "biggest_question",
      label: "Wat is je grootste vraag aan jezelf op dit moment?",
      type: "textarea",
      required: true,
      rows: 3,
      placeholder: "Bijv. wie ben ik nu echt, los van wat anderen verwachten?",
    },
    {
      name: "current_clarity",
      label: "Hoe helder voelt je richting nu?",
      type: "scale",
      required: true,
    },
    {
      name: "discovered_via",
      label: "Hoe ken je The Beautiful Life?",
      type: "select",
      options: ["Instagram", "Via een vriend(in)", "Google", "Anders"],
    },
  ],

  alignment: [
    {
      name: "life_situation",
      label: "Beschrijf kort je huidige levenssituatie",
      type: "textarea",
      required: true,
      rows: 3,
      placeholder: "Werk, gezin, woonsituatie — wat je relevant vindt.",
    },
    {
      name: "biggest_wish",
      label: "Wat zou er over 6 maanden anders mogen zijn?",
      type: "textarea",
      required: true,
      rows: 3,
    },
    {
      name: "energy_level",
      label: "Hoeveel energie ervaar je in een gemiddelde week?",
      type: "scale",
      required: true,
    },
    {
      name: "balance_level",
      label: "Hoe zit het met je balans tussen geven en ontvangen?",
      type: "scale",
      required: true,
    },
    {
      name: "preferred_call_window",
      label: "Wanneer ben je doorgaans goed bereikbaar voor een call?",
      type: "select",
      required: true,
      options: [
        "Doordeweeks overdag",
        "Doordeweeks 's avonds",
        "Weekend overdag",
        "Flexibel",
      ],
    },
  ],

  experience: [
    {
      name: "address",
      label: "Adres (voor het wellness pakket)",
      type: "text",
      required: true,
      placeholder: "Straat, huisnummer, postcode, woonplaats",
    },
    {
      name: "preferred_start",
      label: "Gewenste startperiode",
      type: "select",
      required: true,
      options: [
        "Komende 4 weken",
        "Binnen 1–2 maanden",
        "Binnen 3–6 maanden",
        "Nog flexibel",
      ],
    },
    {
      name: "diet_allergies",
      label: "Dieetwensen of allergieën",
      type: "textarea",
      rows: 2,
      placeholder: "Vegetarisch, glutenvrij, allergieën, etc. — of 'geen'.",
    },
    {
      name: "motivation",
      label: "Wat maakt dat je nu kiest voor 8 dagen volledig voor jezelf?",
      type: "textarea",
      required: true,
      rows: 5,
      placeholder:
        "Neem hier rustig de tijd. Hoe meer Marion vooraf van je weet, hoe persoonlijker de ervaring.",
    },
    {
      name: "emergency_contact",
      label: "Noodcontact (naam + telefoon)",
      type: "text",
      required: true,
      hint: "Iemand die we kunnen bereiken tijdens de Experience.",
    },
  ],
};
