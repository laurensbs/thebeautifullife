"use client";

import { motion } from "framer-motion";

/**
 * Calligraphy — tekst letter-voor-letter laten verschijnen, alsof
 * iemand het langzaam schrijft. Bedoeld voor Pinyon Script-elementen.
 *
 * - Animeert via whileInView, één keer (once: true)
 * - Spaties krijgen geen animatie maar wel ruimte
 * - Per-letter delay = durationPerChar × index
 *
 * Gebruik:
 *   <Calligraphy as="p" className="font-script text-tan text-3xl"
 *                text="welkom terug" />
 *
 * Of wikkel rond een variabele tekst:
 *   <Calligraphy text={tr(DICT.foo, locale)} className="font-script ..." />
 */
export default function Calligraphy({
  text,
  as = "span",
  className,
  durationPerChar = 0.12,
  delay = 0,
}: {
  text: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
  durationPerChar?: number;
  delay?: number;
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

  // Splits tekst in characters (incl. spaties).
  const chars = Array.from(text);

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      aria-label={text}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: durationPerChar,
            delayChildren: delay,
          },
        },
      }}
    >
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{
            display: "inline-block",
            // Zorg dat spaties zichtbare ruimte houden tijdens animatie.
            whiteSpace: "pre",
          }}
          variants={{
            hidden: { opacity: 0, y: 6, filter: "blur(2px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {c}
        </motion.span>
      ))}
    </Tag>
  );
}
