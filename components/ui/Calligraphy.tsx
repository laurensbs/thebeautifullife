"use client";

/**
 * Calligraphy — passthrough wrapper voor script-tekst.
 *
 * Eerder probeerde dit component een geschreven-effect te bouwen
 * met wipe-mask + meebewegende pen-marker + onderlijn. Op verzoek
 * is dat verwijderd: script-tekst wordt nu gewoon stil getoond.
 *
 * Component blijft bestaan zodat alle bestaande imports werken
 * zonder verdere refactor.
 */
export default function Calligraphy({
  text,
  as = "span",
  className,
}: {
  text: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
  /** Genegeerd — alle animatie-opties zijn verwijderd. */
  duration?: number;
  durationPerChar?: number;
  delay?: number;
  underline?: boolean;
  pen?: boolean;
}) {
  const Tag = as as "span" | "p" | "h1" | "h2" | "h3";
  return <Tag className={className}>{text}</Tag>;
}
