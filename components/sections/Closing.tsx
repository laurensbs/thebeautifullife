"use client";

import { motion } from "framer-motion";

export default function Closing() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="text-center px-3 mt-11"
    >
      <p className="font-sans text-[13px] tracking-[0.36em] uppercase text-ink">
        Your Life. Your Choice. Your Beautiful Story.
      </p>
      <p className="font-script text-3xl sm:text-4xl text-ink mt-2.5">
        Let&apos;s create your beautiful life together.
        <span className="text-tan ml-1.5">♡</span>
      </p>
    </motion.section>
  );
}
