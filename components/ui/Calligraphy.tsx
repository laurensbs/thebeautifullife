"use client";

import { motion } from "framer-motion";

/**
 * Calligraphy — script-tekst die zichzelf "schrijft".
 *
 * Hoe:
 * 1. Tekst staat normaal in DOM (Pinyon Script blijft Pinyon Script).
 * 2. Een clipPath wipe opent van links naar rechts — letters verschijnen
 *    in dezelfde volgorde als hoe je ze zou schrijven.
 * 3. Een meebewegende pen-marker (tan verticale streep) glijdt synchroon
 *    aan de rechterrand van de wipe. Dat verandert het effect van "fade"
 *    naar "geschreven worden": het oog volgt de pen.
 * 4. Optionele zachte onderlijn die mee-tekent (alsof de pen het papier
 *    raakt).
 *
 * Triggert via whileInView (one-shot).
 */
export default function Calligraphy({
  text,
  as = "span",
  className,
  duration,
  durationPerChar = 0.12,
  delay = 0,
  underline = false,
  pen = true,
}: {
  text: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
  duration?: number;
  durationPerChar?: number;
  delay?: number;
  underline?: boolean;
  pen?: boolean;
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
    duration ?? Math.max(1.0, text.length * durationPerChar);

  return (
    <Tag
      className={className}
      style={{ position: "relative", display: "inline-block" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10px" }}
      aria-label={text}
    >
      {/* Onzichtbare ghost — bepaalt breedte/hoogte voor layout */}
      <span aria-hidden style={{ visibility: "hidden", whiteSpace: "pre" }}>
        {text}
      </span>

      {/* De zichtbare tekst, gemaskeerd door wipe */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          whiteSpace: "pre",
          display: "inline-block",
        }}
        variants={{
          hidden: { clipPath: "inset(0 100% 0 0)" },
          visible: { clipPath: "inset(0 0% 0 0)" },
        }}
        transition={{
          duration: totalDuration,
          delay,
          ease: [0.55, 0.0, 0.45, 1.0], // bijna lineair — pen-snelheid
        }}
      >
        {text}
      </motion.span>

      {/* Pen-marker — verticale tan streep die meeschuift langs de
          rechterrand van de wipe. We animeren `left` van 0% → 100%. */}
      {pen && (
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            top: "12%",
            bottom: "12%",
            width: "2px",
            background: "currentColor",
            opacity: 0,
            borderRadius: "2px",
            pointerEvents: "none",
            boxShadow: "0 0 6px currentColor",
            transform: "translateX(-1px)",
          }}
          variants={{
            hidden: { left: "0%", opacity: 0 },
            visible: { left: "100%", opacity: [0, 0.75, 0.75, 0] },
          }}
          transition={{
            left: {
              duration: totalDuration,
              delay,
              ease: [0.55, 0.0, 0.45, 1.0],
            },
            opacity: {
              duration: totalDuration,
              delay,
              times: [0, 0.05, 0.92, 1],
            },
          }}
        />
      )}

      {/* Zachte onderlijn die mee-tekent */}
      {underline && (
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "0.06em",
            height: "1.5px",
            background: "currentColor",
            opacity: 0.22,
            transformOrigin: "left center",
            pointerEvents: "none",
            borderRadius: "2px",
          }}
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1 },
          }}
          transition={{
            duration: totalDuration,
            delay,
            ease: [0.55, 0.0, 0.45, 1.0],
          }}
        />
      )}
    </Tag>
  );
}
