"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderAuthLink({
  fallbackLabel,
}: {
  fallbackLabel: string;
}) {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/client/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.ok && data.firstName) setFirstName(String(data.firstName));
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link
      href="/mijn-pad"
      className="text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition relative group inline-flex items-center gap-2"
    >
      <AnimatePresence mode="wait">
        {ready && firstName ? (
          <motion.span
            key="greet"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-script normal-case tracking-normal text-tan text-[15px] leading-none"
          >
            hoi {firstName.toLowerCase()}
          </motion.span>
        ) : null}
      </AnimatePresence>
      <span>{fallbackLabel}</span>
      <span className="absolute left-0 right-0 -bottom-1 h-px bg-tan scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </Link>
  );
}
