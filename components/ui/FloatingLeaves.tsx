"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

interface FloatingLeaf {
  id: number;
  x: string;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  opacity: number;
}

const leaves: FloatingLeaf[] = [
  { id: 1, x: "8%", delay: 0, duration: 32, size: 16, rotation: 45, opacity: 0.05 },
  { id: 2, x: "22%", delay: 6, duration: 38, size: 12, rotation: -30, opacity: 0.04 },
  { id: 3, x: "45%", delay: 4, duration: 35, size: 14, rotation: 60, opacity: 0.045 },
  { id: 4, x: "68%", delay: 10, duration: 40, size: 10, rotation: -45, opacity: 0.04 },
  { id: 5, x: "85%", delay: 2, duration: 34, size: 18, rotation: 30, opacity: 0.05 },
  { id: 6, x: "35%", delay: 14, duration: 36, size: 11, rotation: -60, opacity: 0.035 },
  { id: 7, x: "55%", delay: 8, duration: 42, size: 13, rotation: 15, opacity: 0.045 },
  { id: 8, x: "92%", delay: 5, duration: 30, size: 15, rotation: -20, opacity: 0.04 },
];

export default function FloatingLeaves() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          style={{ left: leaf.x, top: "0%" }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(leaf.rotation) * 40, 0, Math.sin(leaf.rotation) * -30, 0],
            rotate: [0, leaf.rotation, -leaf.rotation / 2, leaf.rotation * 0.8, 0],
          }}
          transition={{
            y: { duration: leaf.duration, repeat: Infinity, ease: "linear", delay: leaf.delay },
            x: { duration: leaf.duration * 0.7, repeat: Infinity, ease: "easeInOut", delay: leaf.delay },
            rotate: { duration: leaf.duration, repeat: Infinity, ease: "easeInOut", delay: leaf.delay },
          }}
        >
          <Leaf
            size={leaf.size}
            strokeWidth={1}
            className="text-accent"
            style={{ opacity: leaf.opacity }}
          />
        </motion.div>
      ))}
    </div>
  );
}
