"use client";

import { motion } from "framer-motion";

export default function PageLoader({
  label,
}: {
  label?: string;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-page">
      <div className="flex flex-col items-center gap-5">
        {/* Brand-mark with gentle pulse */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <motion.span
            animate={{
              scale: [1, 1.06, 1],
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-flex w-16 h-16 rounded-full bg-sage items-center justify-center shadow-[0_8px_24px_rgba(124,136,103,0.25)]"
          >
            <span className="font-script text-white text-4xl leading-none -mt-1">
              B
            </span>
          </motion.span>

          {/* Soft halo */}
          <motion.span
            aria-hidden
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-sage/30 -z-10"
          />
        </motion.div>

        {/* Hartjes-divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center gap-2.5 text-tan"
        >
          <span className="h-px w-10 bg-tan/55" />
          <span className="text-xs">♡</span>
          <span className="h-px w-10 bg-tan/55" />
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-script text-tan text-2xl"
        >
          {label ?? "een moment…"}
        </motion.p>
      </div>
    </div>
  );
}
