"use client";

import { motion } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  scale?: boolean;
}

export default function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  scale = false,
}: FadeInProps) {
  const directionMap = {
    up: { y: 20, x: 0 },
    left: { y: 0, x: -20 },
    right: { y: 0, x: 20 },
    none: { y: 0, x: 0 },
  };
  const { x, y } = directionMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, y, x, scale: scale ? 0.98 : 1 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 1.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
