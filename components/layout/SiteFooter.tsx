import Link from "next/link";
import { Mail } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";
import Calligraphy from "@/components/ui/Calligraphy";
import HeartDivider from "@/components/ui/HeartDivider";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function SiteFooter({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 sm:mt-20 lg:mt-24 px-5 sm:px-6 pb-8">
      <div className="max-w-[1180px] mx-auto">
        {/* Cream-card met afgeronde bovenhoeken — matcht portaal/landing stijl */}
        <div className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] shadow-[0_18px_48px_rgba(60,50,30,0.08)] overflow-hidden">
          {/* Brand / tagline — centered op mobiel + tablet, links op desktop */}
          <div className="px-6 py-10 sm:px-12 sm:py-12 text-center lg:text-left">
            <p className="font-serif text-ink text-[14px] tracking-[0.18em] uppercase">
              The Beautiful Life
            </p>
            <Calligraphy
              as="p"
              className="font-script text-tan text-2xl sm:text-3xl mt-2"
              text={tr(DICT.footer.tagline, locale)}
              durationPerChar={0.04}
            />

            <HeartDivider
              className="mt-5 mb-6 lg:!justify-start"
            />

            <p className="text-ink-soft text-sm leading-[1.85] max-w-md mx-auto lg:mx-0">
              {tr(DICT.footer.intro, locale)}
            </p>
          </div>

          {/* Navigation columns */}
          <div className="border-t border-line/40 px-6 py-9 sm:px-12 sm:py-10 grid grid-cols-1 sm:grid-cols-2 gap-9 sm:gap-12 text-center sm:text-left">
            <div>
              <p className="text-[11px] tracking-[0.22em] uppercase text-muted mb-4">
                {tr(DICT.footer.discover, locale)}
              </p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/pakket/ikigai"
                    className="text-ink-soft hover:text-tan transition"
                  >
                    {tr(DICT.packages.name.ikigai, locale)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pakket/alignment"
                    className="text-ink-soft hover:text-tan transition"
                  >
                    {tr(DICT.packages.name.alignment, locale)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pakket/experience"
                    className="text-ink-soft hover:text-tan transition"
                  >
                    {tr(DICT.packages.name.experience, locale)}
                  </Link>
                </li>
                <li className="pt-3 mt-3 border-t border-line/40">
                  <Link
                    href="/mijn-pad"
                    className="text-ink-soft hover:text-tan transition"
                  >
                    {tr(DICT.nav.myPath, locale)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gratis"
                    className="text-sage-deep hover:text-tan transition"
                  >
                    {tr(DICT.free.title, locale)}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] tracking-[0.22em] uppercase text-muted mb-4">
                {tr(DICT.footer.contact, locale)}
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="mailto:contact@thebeautifullife.nl"
                    className="text-ink-soft hover:text-tan transition inline-flex items-center gap-2"
                  >
                    <Mail size={14} className="text-tan" />
                    contact@thebeautifullife.nl
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/thebeautifullife"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-soft hover:text-tan transition inline-flex items-center gap-2"
                  >
                    <span className="text-tan">
                      <InstagramIcon />
                    </span>
                    @thebeautifullife
                  </a>
                </li>
              </ul>

              <Calligraphy
                as="p"
                className="font-script text-tan text-xl mt-7"
                text={tr(DICT.footer.signoff, locale)}
                durationPerChar={0.07}
              />
            </div>
          </div>

          {/* Bottom strip */}
          <div className="bg-page-dark/40 border-t border-line/40 px-6 py-5 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-muted text-center sm:text-left">
            <p>© {year} The Beautiful Life · Marion Lubach</p>
            <div className="flex items-center gap-4 sm:gap-5">
              <Link href="/privacy" className="hover:text-tan transition">
                {tr(DICT.footer.privacy, locale)}
              </Link>
              <span className="text-muted/40">·</span>
              <LanguageSwitcher current={locale} variant="footer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
