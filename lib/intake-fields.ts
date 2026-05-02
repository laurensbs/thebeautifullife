import type { IntakeField } from "@/components/intake/IntakeForm";
import type { PackageSlug } from "./packages";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";

export function BASE_FIELDS(locale: Locale): IntakeField[] {
  const f = DICT.intake.fields;
  return [
    {
      name: "firstName",
      label: tr(f.firstName, locale),
      type: "text",
      required: true,
      placeholder: tr(f.firstNamePlaceholder, locale),
    },
    {
      name: "contact",
      label: tr(f.contact, locale),
      type: "email",
      required: true,
      placeholder: tr(f.contactPlaceholder, locale),
    },
    {
      name: "phone",
      label: tr(f.phone, locale),
      type: "tel",
      placeholder: tr(f.phonePlaceholder, locale),
      hint: tr(f.phoneHint, locale),
    },
  ];
}

export function PACKAGE_INTAKE(
  slug: PackageSlug,
  locale: Locale
): IntakeField[] {
  const f = DICT.intake.fields;

  if (slug === "ikigai") {
    return [
      {
        name: "biggest_question",
        label: tr(f.biggestQuestion, locale),
        type: "textarea",
        required: true,
        rows: 3,
        placeholder: tr(f.biggestQuestionPlaceholder, locale),
      },
      {
        name: "current_clarity",
        label: tr(f.currentClarity, locale),
        type: "scale",
        required: true,
      },
      {
        name: "discovered_via",
        label: tr(f.discoveredVia, locale),
        type: "select",
        options: [...f.discoveredViaOptions[locale]],
      },
    ];
  }

  if (slug === "alignment") {
    return [
      {
        name: "life_situation",
        label: tr(f.lifeSituation, locale),
        type: "textarea",
        required: true,
        rows: 3,
        placeholder: tr(f.lifeSituationPlaceholder, locale),
      },
      {
        name: "biggest_wish",
        label: tr(f.biggestWish, locale),
        type: "textarea",
        required: true,
        rows: 3,
      },
      {
        name: "energy_level",
        label: tr(f.energyLevel, locale),
        type: "scale",
        required: true,
      },
      {
        name: "balance_level",
        label: tr(f.balanceLevel, locale),
        type: "scale",
        required: true,
      },
      {
        name: "preferred_call_window",
        label: tr(f.preferredCallWindow, locale),
        type: "select",
        required: true,
        options: [...f.callWindowOptions[locale]],
      },
    ];
  }

  // experience
  return [
    {
      name: "address",
      label: tr(f.address, locale),
      type: "text",
      required: true,
      placeholder: tr(f.addressPlaceholder, locale),
    },
    {
      name: "preferred_start",
      label: tr(f.preferredStart, locale),
      type: "select",
      required: true,
      options: [...f.startOptions[locale]],
    },
    {
      name: "diet_allergies",
      label: tr(f.dietAllergies, locale),
      type: "textarea",
      rows: 2,
      placeholder: tr(f.dietAllergiesPlaceholder, locale),
    },
    {
      name: "motivation",
      label: tr(f.motivation, locale),
      type: "textarea",
      required: true,
      rows: 5,
      placeholder: tr(f.motivationPlaceholder, locale),
    },
    {
      name: "emergency_contact",
      label: tr(f.emergencyContact, locale),
      type: "text",
      required: true,
      hint: tr(f.emergencyContactHint, locale),
    },
  ];
}
