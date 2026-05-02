"use client";

import HeartDraw from "./HeartDraw";

/**
 * HeartDivider — de "lijn · hart · lijn" combo die overal op de site
 * voorkomt. Het hartje tekent zichzelf wanneer het in beeld komt.
 *
 * - align="center" of "left"
 * - long voor langere lijnen
 * - tone bepaalt de kleur (default tan)
 */
export default function HeartDivider({
  align = "center",
  long = false,
  tone = "tan",
  className,
  size = 14,
}: {
  align?: "center" | "left";
  long?: boolean;
  tone?: "tan" | "sage" | "ink";
  className?: string;
  size?: number;
}) {
  const colorClass =
    tone === "sage" ? "text-sage" : tone === "ink" ? "text-ink" : "text-tan";
  const lineColor =
    tone === "sage" ? "bg-sage/55" : tone === "ink" ? "bg-ink/55" : "bg-tan/55";
  const justify = align === "left" ? "justify-start" : "justify-center";
  const lineW = long ? "w-20" : "w-12 sm:w-14";

  return (
    <div
      className={`flex items-center gap-2.5 ${colorClass} ${justify} ${className ?? ""}`}
    >
      <span className={`h-px ${lineW} ${lineColor}`} />
      <HeartDraw size={size} duration={1.6} fill />
      {align !== "left" && <span className={`h-px ${lineW} ${lineColor}`} />}
    </div>
  );
}
