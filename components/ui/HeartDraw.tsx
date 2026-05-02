"use client";

import { motion } from "framer-motion";

/**
 * HeartDraw — een hartje dat zichzelf tekent met SVG stroke-draw,
 * en daarna langzaam invult.
 *
 * Triggert via whileInView (one-shot). Past bij Pinyon-stijl —
 * een kalligrafische pen die het hartje schetst.
 */
export default function HeartDraw({
  size = 14,
  color = "currentColor",
  duration = 1.4,
  delay = 0,
  fill = true,
  className,
}: {
  size?: number;
  color?: string;
  duration?: number;
  delay?: number;
  fill?: boolean;
  className?: string;
}) {
  // Klassiek hartje als één pad — zacht, niet de standaard Heroicons-vorm.
  const d =
    "M12 21s-7.5-5.2-7.5-11A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7.5 4c0 5.8-7.5 11-7.5 11z";

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10px" }}
      aria-hidden
    >
      <motion.path
        d={d}
        fill={fill ? color : "none"}
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, fillOpacity: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            fillOpacity: fill ? 1 : 0,
            opacity: 1,
          },
        }}
        transition={{
          pathLength: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          fillOpacity: { duration: 0.6, delay: delay + duration * 0.7 },
          opacity: { duration: 0.2, delay },
        }}
      />
    </motion.svg>
  );
}
