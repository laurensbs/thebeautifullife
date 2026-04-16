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
  { id: 1, x: "8%", delay: 0, duration: 18, size: 16, rotation: 45, opacity: 0.07 },
  { id: 2, x: "22%", delay: 4, duration: 22, size: 12, rotation: -30, opacity: 0.05 },
  { id: 3, x: "45%", delay: 2, duration: 20, size: 14, rotation: 60, opacity: 0.06 },
  { id: 4, x: "68%", delay: 6, duration: 24, size: 10, rotation: -45, opacity: 0.05 },
  { id: 5, x: "85%", delay: 1, duration: 19, size: 18, rotation: 30, opacity: 0.07 },
  { id: 6, x: "35%", delay: 8, duration: 21, size: 11, rotation: -60, opacity: 0.04 },
  { id: 7, x: "55%", delay: 5, duration: 23, size: 13, rotation: 15, opacity: 0.06 },
  { id: 8, x: "92%", delay: 3, duration: 17, size: 15, rotation: -20, opacity: 0.05 },
];

export default function FloatingLeaves() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          style={{ left: leaf.x, top: "-5%" }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(leaf.rotation) * 40, 0, Math.sin(leaf.rotation) * -30, 0],
            rotate: [0, leaf.rotation, -leaf.rotation / 2, leaf.rotation * 0.8, 0],
          }}
          transition={{
            y: { duration: leaf.duration, repeat: Infinity, ease: "linear", delay: leaf.delay },
            x: { duration: leaf.duration * 0.6, repeat: Infinity, ease: "easeInOut", delay: leaf.delay },
            rotate: { duration: leaf.duration * 0.8, repeat: Infinity, ease: "easeInOut", delay: leaf.delay },
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
