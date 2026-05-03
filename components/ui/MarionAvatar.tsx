import Image from "next/image";

/**
 * Klein cirkelvormig portret van Marion. Hergebruik op alle plekken
 * waar de site "Marion" noemt (footer signoff, bedankt-pagina,
 * vragenlijst-done, boek-call, PersonalRecommendation).
 *
 * Image-URL is dezelfde als in AboutMarion-sectie zodat Next/Image
 * één keer cached.
 */
export default function MarionAvatar({
  size = 48,
  accent = "tan",
  className,
}: {
  size?: number;
  accent?: "tan" | "sage";
  className?: string;
}) {
  const borderClass =
    accent === "sage" ? "border-sage/40" : "border-tan/40";
  return (
    <span
      className={`relative inline-block rounded-full overflow-hidden border ${borderClass} shadow-[0_4px_12px_rgba(60,50,30,0.10)] flex-none ${className ?? ""}`}
      style={{ width: size, height: size }}
      aria-hidden={false}
    >
      <Image
        src="https://u.cubeupload.com/laurensbos/fea64f52c39c42939293.jpeg"
        alt="Marion Lubach"
        fill
        sizes={`${size}px`}
        className="object-cover object-center"
      />
    </span>
  );
}
