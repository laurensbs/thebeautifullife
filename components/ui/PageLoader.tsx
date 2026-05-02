"use client";

import { motion } from "framer-motion";
import HeartDraw from "@/components/ui/HeartDraw";
import BrandLogo from "@/components/ui/BrandLogo";

export default function PageLoader({
  label,
}: {
  label?: string;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-page">
      <div className="flex flex-col items-center gap-5 px-6 text-center">
        {/* Brand-logo gestapeld */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <BrandLogo size="md" align="center" />
        </motion.div>

        {/* Hartjes-divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center gap-2.5 text-tan"
        >
          <span className="h-px w-10 bg-tan/55" />
          <motion.span
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex"
          >
            <HeartDraw size={13} />
          </motion.span>
          <span className="h-px w-10 bg-tan/55" />
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-script text-tan text-2xl"
        >
          {label ?? "een moment…"}
        </motion.p>
      </div>
    </div>
  );
}
