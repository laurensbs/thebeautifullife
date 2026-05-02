"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Locale } from "@/lib/i18n/types";

export default function LanguageSwitcher({
  current,
  variant = "header",
}: {
  current: Locale;
  variant?: "header" | "footer" | "mobile";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const setLocale = async (locale: Locale) => {
    if (locale === current || pending) return;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    startTransition(() => {
      router.refresh();
    });
  };

  const baseLink = "transition tracking-[0.22em] uppercase text-[11px]";

  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase">
        <button
          onClick={() => setLocale("nl")}
          className={`transition ${current === "nl" ? "text-ink font-medium" : "text-muted/70 hover:text-tan"}`}
          aria-current={current === "nl"}
        >
          NL
        </button>
        <span className="text-tan/40">·</span>
        <button
          onClick={() => setLocale("en")}
          className={`transition ${current === "en" ? "text-ink font-medium" : "text-muted/70 hover:text-tan"}`}
          aria-current={current === "en"}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        onClick={() => setLocale("nl")}
        className={`${baseLink} ${current === "nl" ? "text-tan font-medium" : variant === "footer" ? "text-muted hover:text-tan" : "text-ink-soft hover:text-tan"}`}
        aria-current={current === "nl"}
      >
        NL
      </button>
      <span className={variant === "footer" ? "text-muted/40" : "text-tan/40"}>·</span>
      <button
        onClick={() => setLocale("en")}
        className={`${baseLink} ${current === "en" ? "text-tan font-medium" : variant === "footer" ? "text-muted hover:text-tan" : "text-ink-soft hover:text-tan"}`}
        aria-current={current === "en"}
      >
        EN
      </button>
    </span>
  );
}
