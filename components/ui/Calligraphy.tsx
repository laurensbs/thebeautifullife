"use client";

import { motion } from "framer-motion";

/**
 * Calligraphy — geeft script-tekst een geschreven-wordt-effect.
 *
 * Hoe: tekst wordt normaal gerenderd (Pinyon Script blijft Pinyon
 * Script), maar zit onder een wipe-mask die langzaam van links naar
 * rechts opent. Dat geeft het visuele effect van een pen die de
 * letters tekent — zonder dat we per-letter SVG-paden nodig hebben.
 *
 * Een fijn detail: een zachte tan-onderlijn die mee-tekent terwijl
 * de mask opent. Voelt als een pen die over papier glijdt.
 *
 * Triggert via whileInView (one-shot).
 */
export default function Calligraphy({
  text,
  as = "span",
  className,
  duration,
  durationPerChar = 0.08,
  delay = 0,
  underline = false,
}: {
  text: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
  /** Total duration. Als niet gezet: durationPerChar × text.length, min 0.8s. */
  duration?: number;
  durationPerChar?: number;
  delay?: number;
  /** Zachte pen-onderlijn die mee-tekent. Default true. */
  underline?: boolean;
}) {
  const Tag =
    as === "p"
      ? motion.p
      : as === "h1"
        ? motion.h1
        : as === "h2"
          ? motion.h2
          : as === "h3"
            ? motion.h3
            : motion.span;

  const totalDuration =
    duration ?? Math.max(0.8, text.length * durationPerChar);

  return (
    <Tag
      className={className}
      style={{ position: "relative", display: "inline-block" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10px" }}
      aria-label={text}
    >
      {/* Onzichtbare ghost — bepaalt de breedte/hoogte zodat layout klopt */}
      <span aria-hidden style={{ visibility: "hidden", whiteSpace: "pre" }}>
        {text}
      </span>

      {/* De zichtbare tekst, gemaskeerd door een wipe die opent van links naar rechts */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          whiteSpace: "pre",
          display: "inline-block",
          // Mask die zich naar rechts opent — geeft het "geschreven" effect
        }}
        variants={{
          hidden: { clipPath: "inset(0 100% 0 0)" },
          visible: { clipPath: "inset(0 0% 0 0)" },
        }}
        transition={{
          duration: totalDuration,
          delay,
          ease: [0.45, 0.05, 0.55, 0.95], // gelijkmatige pen-snelheid
        }}
      >
        {text}
      </motion.span>

      {/* Zachte pen-onderlijn die mee-tekent (subtle) */}
      {underline && (
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "0.06em",
            height: "1px",
            background: "currentColor",
            opacity: 0.18,
            transformOrigin: "left center",
            pointerEvents: "none",
          }}
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1 },
          }}
          transition={{
            duration: totalDuration,
            delay,
            ease: [0.45, 0.05, 0.55, 0.95],
          }}
        />
      )}
    </Tag>
  );
}
