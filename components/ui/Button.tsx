"use client";

import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({ children, className = "", type = "button" }: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`w-full bg-accent text-white font-sans font-semibold tracking-[0.15em] text-sm py-4 px-8 rounded-lg
        transition-colors duration-300 ease-out
        hover:bg-[#a07850] hover:shadow-lg
        focus-visible:outline-accent
        uppercase cursor-pointer ${className}`}
    >
      {children}
    </motion.button>
  );
}
