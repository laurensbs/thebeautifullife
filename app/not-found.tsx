import Link from "next/link";
import HeartDivider from "@/components/ui/HeartDivider";
import BrandLogo from "@/components/ui/BrandLogo";
import { getLocale } from "@/lib/i18n/server";

export const metadata = {
  title: "Pagina niet gevonden — The Beautiful Life",
  robots: { index: false, follow: false },
};

const COPY = {
  nl: {
    eyebrow: "deze pagina bestaat niet",
    title: "Geen zorgen — soms is verdwalen ook een pad",
    body: "De link die je volgde bestaat niet meer, of we hebben iets verplaatst. Klik hieronder om terug te keren.",
    backHome: "Terug naar de site",
    myPath: "Mijn pad",
  },
  en: {
    eyebrow: "this page doesn't exist",
    title: "No worries — sometimes getting lost is a path too",
    body: "The link you followed no longer exists, or we moved something. Click below to return.",
    backHome: "Back to the site",
    myPath: "My path",
  },
} as const;

export default async function NotFound() {
  const locale = await getLocale();
  const t = COPY[locale === "en" ? "en" : "nl"];
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-5 sm:px-6 py-16">
      <div className="max-w-[560px] w-full bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-12 sm:px-12 sm:py-14 shadow-[0_18px_48px_rgba(60,50,30,0.08)] text-center relative overflow-hidden">
        <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />

        <div className="flex justify-center mb-5">
          <BrandLogo size="md" align="center" />
        </div>

        <p className="font-script text-tan text-3xl sm:text-4xl">{t.eyebrow}</p>
        <h1 className="font-serif font-medium text-xl sm:text-2xl tracking-[0.06em] uppercase mt-3 text-ink">
          {t.title}
        </h1>

        <HeartDivider className="my-6" />

        <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md mx-auto">
          {t.body}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-block bg-ink hover:brightness-110 text-white px-7 py-3.5 rounded-[3px] font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
          >
            {t.backHome}
          </Link>
          <Link
            href="/mijn-pad"
            className="inline-block px-6 py-3 rounded-[3px] border border-ink/30 text-ink hover:border-tan hover:text-tan font-sans text-xs tracking-[0.22em] uppercase transition"
          >
            {t.myPath}
          </Link>
        </div>
      </div>
    </main>
  );
}
