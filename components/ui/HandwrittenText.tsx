"use client";

import { motion } from "framer-motion";

interface HandwrittenTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  as?: "span" | "p";
}

export default function HandwrittenText({
  children,
  className = "",
  delay = 0,
  duration = 1.2,
  as: Tag = "span",
}: HandwrittenTextProps) {
  return (
    <Tag className={`inline-block relative ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
