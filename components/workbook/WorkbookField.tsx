"use client";

import { useEffect, useRef, useState } from "react";

type SaveState = "idle" | "saving" | "saved";

export default function WorkbookField({
  fieldKey,
  initialValue,
  placeholder,
  size,
  onSaveStateChange,
}: {
  fieldKey: string;
  initialValue: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onSaveStateChange?: (s: SaveState) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaved = useRef<string>(initialValue);

  // auto-grow
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const min = parseInt(getComputedStyle(el).minHeight || "0", 10);
    el.style.height = Math.max(el.scrollHeight, min) + "px";
  }, [value]);

  // debounced save
  useEffect(() => {
    if (value === lastSaved.current) return;
    onSaveStateChange?.("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/workbook/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ field_key: fieldKey, value }),
        });
        if (res.ok) {
          lastSaved.current = value;
          onSaveStateChange?.("saved");
        } else {
          onSaveStateChange?.("idle");
        }
      } catch {
        onSaveStateChange?.("idle");
      }
    }, 800);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, fieldKey]);

  const sizeCls =
    size === "xl"
      ? "wb-field--xl"
      : size === "lg"
        ? "wb-field--lg"
        : size === "md"
          ? "wb-field--md"
          : "wb-field--sm";

  return (
    <textarea
      ref={ref}
      className={`wb-field ${sizeCls}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      spellCheck
    />
  );
}
