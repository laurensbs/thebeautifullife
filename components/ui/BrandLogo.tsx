import Link from "next/link";

/**
 * BrandLogo — gestapeld "The / Beautiful / Life" logo, zelfde stijl
 * als in de hero. Compactere varianten voor headers/footers/loaders.
 *
 * - The: Cormorant caps, kleine size, brede letterspacing, ink-soft
 * - Beautiful: Cormorant caps, medium size, ink, font-medium
 * - Life: Pinyon Script, ink/85, lichte negatieve top-margin voor overlap
 */
export default function BrandLogo({
  size = "sm",
  className,
  linkTo,
  align = "left",
}: {
  size?: "sm" | "md";
  className?: string;
  linkTo?: string;
  align?: "left" | "center";
}) {
  const sizes = {
    sm: {
      the: "text-[9px]",
      beautiful: "text-[18px]",
      life: "text-[28px]",
      lifeMt: "-mt-[0.18em]",
    },
    md: {
      the: "text-[11px]",
      beautiful: "text-[22px]",
      life: "text-[36px]",
      lifeMt: "-mt-[0.2em]",
    },
  } as const;
  const s = sizes[size];

  const inner = (
    <span className={`flex flex-col leading-none ${align === "center" ? "items-center" : "items-start"}`}>
      <span
        className={`font-serif uppercase tracking-[0.32em] font-medium text-ink-soft ${s.the}`}
      >
        The
      </span>
      <span
        className={`font-serif uppercase tracking-[0.18em] font-medium text-ink mt-0.5 ${s.beautiful}`}
      >
        Beautiful
      </span>
      <span
        className={`font-script font-normal tracking-[0.02em] text-ink/85 leading-[0.9] ${s.lifeMt} ${s.life}`}
      >
        Life
      </span>
    </span>
  );

  if (linkTo) {
    return (
      <Link
        href={linkTo}
        className={`inline-flex group ${className ?? ""}`}
        aria-label="The Beautiful Life — home"
      >
        {inner}
      </Link>
    );
  }
  return <span className={`inline-flex ${className ?? ""}`}>{inner}</span>;
}
