"use client";

import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

const particles: Particle[] = [
  { id: 1, x: "12%", y: "15%", size: 2, delay: 0, duration: 5, drift: -15 },
  { id: 2, x: "28%", y: "40%", size: 1.5, delay: 2.5, duration: 6, drift: 10 },
  { id: 3, x: "65%", y: "25%", size: 2.5, delay: 1, duration: 4.5, drift: -12 },
  { id: 4, x: "80%", y: "60%", size: 1.5, delay: 3.5, duration: 5.5, drift: 8 },
  { id: 5, x: "45%", y: "70%", size: 2, delay: 5, duration: 6.5, drift: -18 },
  { id: 6, x: "92%", y: "35%", size: 1, delay: 4, duration: 5, drift: 14 },
  { id: 7, x: "5%", y: "80%", size: 2, delay: 6, duration: 4, drift: -10 },
  { id: 8, x: "55%", y: "50%", size: 1.5, delay: 7, duration: 5.5, drift: 12 },
  { id: 9, x: "35%", y: "90%", size: 2, delay: 3, duration: 6, drift: -16 },
  { id: 10, x: "75%", y: "10%", size: 1.5, delay: 8, duration: 5, drift: 10 },
];

export default function AmbientParticles() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0, 0.25, 0.12, 0.3, 0],
            y: [0, p.drift, p.drift * 0.5, p.drift * 1.2, 0],
            x: [0, p.drift * 0.3, -p.drift * 0.2, p.drift * 0.4, 0],
            scale: [0.5, 1, 0.8, 1.1, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
