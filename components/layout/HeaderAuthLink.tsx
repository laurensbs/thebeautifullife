"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

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

  // Niet ingelogd of nog niet geladen: gewone "mijn pad" link in nav-stijl
  if (!ready || !firstName) {
    return (
      <Link
        href="/mijn-pad"
        className="text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition relative group"
      >
        {fallbackLabel}
        <span className="absolute left-0 right-0 -bottom-1 h-px bg-tan scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </Link>
    );
  }

  // Ingelogd: prominente link "Het pad van [Naam]"
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="logged-in"
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href="/mijn-pad"
          className="inline-flex items-baseline gap-1.5 text-ink hover:text-tan transition relative group"
        >
          <span className="text-[11px] tracking-[0.22em] uppercase text-ink-soft group-hover:text-tan transition">
            Het pad van
          </span>
          <span className="font-script text-tan text-[20px] leading-none -mb-0.5">
            {capitalize(firstName)}
          </span>
          <span className="absolute left-0 right-0 -bottom-1 h-px bg-tan scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
