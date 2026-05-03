/**
 * Booking-business logica + slot-generator.
 *
 * Vast schema voor nu — alle werkdagen 10:00-17:00, hele uren.
 * Later vervangbaar door Google/Microsoft Calendar API.
 */

export const BOOKING_TYPES = {
  one_on_one_60: {
    key: "one_on_one_60",
    title: "1-op-1 call met Marion",
    duration_min: 60,
    price_cents: 12500,
    price_label: "€125",
    description:
      "Een persoonlijke 60-minuten Teams-call met Marion. Stel je vraag, krijg richting, of werk gericht aan iets dat speelt.",
  },
  return_to_calm_30: {
    key: "return_to_calm_30",
    title: "Verdiepingscall — Return to Calm",
    duration_min: 30,
    price_cents: 4900,
    price_label: "€49",
    description:
      "Een persoonlijke 30-minuten Teams-call met Marion om dieper in te gaan op wat je in het werkboek Return to Calm bent tegengekomen. Speciaal voor wie het werkboek heeft (of doorloopt).",
  },
} as const;

export type BookingTypeKey = keyof typeof BOOKING_TYPES;

const WORK_HOURS_START = 10; // 10:00
const WORK_HOURS_END = 17; // laatste slot start om 17:00 → 16:00 voor 60-min

/**
 * Genereert beschikbare slots voor de komende N dagen.
 * Slots starten op het hele uur.
 * Wat al geboekt is (input: bookedTimes Set van ISO-strings) wordt overgeslagen.
 */
export function generateAvailableSlots({
  daysAhead = 21,
  bookedTimes = new Set<string>(),
  durationMin = 60,
  now = new Date(),
}: {
  daysAhead?: number;
  bookedTimes?: Set<string>;
  durationMin?: number;
  now?: Date;
} = {}): { date: string; slots: string[] }[] {
  const result: { date: string; slots: string[] }[] = [];
  const lastSlotHour = WORK_HOURS_END - Math.ceil(durationMin / 60);

  // Begin morgen — vandaag te kort voor klant om voor te bereiden.
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + 1);

  for (let d = 0; d < daysAhead; d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    const dow = date.getDay(); // 0 = zo, 6 = za
    if (dow === 0 || dow === 6) continue; // alleen werkdagen

    const slots: string[] = [];
    for (let h = WORK_HOURS_START; h <= lastSlotHour; h++) {
      const slot = new Date(date);
      slot.setHours(h, 0, 0, 0);
      if (slot.getTime() < now.getTime() + 60 * 60_000) continue; // min 1u vooruit
      const iso = slot.toISOString();
      if (bookedTimes.has(iso)) continue;
      slots.push(iso);
    }

    if (slots.length > 0) {
      result.push({
        date: date.toISOString().slice(0, 10),
        slots,
      });
    }
  }

  return result;
}
