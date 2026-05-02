import Link from "next/link";
import { Mail } from "lucide-react";

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

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 sm:mt-24 bg-page-dark border-t border-line/40">
      <div className="max-w-[1180px] mx-auto px-6 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2 max-w-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-8 h-8 rounded-full bg-sage flex items-center justify-center">
                <span className="font-script text-white text-lg leading-none -mt-0.5">
                  B
                </span>
              </span>
              <span className="font-serif text-ink text-[14px] tracking-wide">
                The Beautiful Life
              </span>
            </div>
            <p className="font-script text-tan text-2xl mb-2">
              the beginning of your beautiful life
            </p>
            <p className="text-ink-soft text-sm leading-[1.85]">
              Voor vrouwen die verlangen naar rust, balans en een leven dat
              goed voelt en moeiteloos begint te stromen.
            </p>
          </div>

          {/* Nav column */}
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted mb-4">
              Ontdek
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/pakket/ikigai"
                  className="text-ink-soft hover:text-tan transition"
                >
                  The Ikigai Story
                </Link>
              </li>
              <li>
                <Link
                  href="/pakket/alignment"
                  className="text-ink-soft hover:text-tan transition"
                >
                  From Insight to Alignment
                </Link>
              </li>
              <li>
                <Link
                  href="/pakket/experience"
                  className="text-ink-soft hover:text-tan transition"
                >
                  The Beautiful Life Experience
                </Link>
              </li>
              <li className="pt-3 mt-3 border-t border-line/40">
                <Link
                  href="/mijn-pad"
                  className="text-ink-soft hover:text-tan transition"
                >
                  Mijn pad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted mb-4">
              Contact
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:contact@thebeautifullife.nl"
                  className="text-ink-soft hover:text-tan transition flex items-center gap-2"
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
                  className="text-ink-soft hover:text-tan transition flex items-center gap-2"
                >
                  <span className="text-tan"><InstagramIcon /></span>
                  @thebeautifullife
                </a>
              </li>
            </ul>

            <p className="font-script text-tan text-xl mt-6">liefs, Marion</p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 pt-6 border-t border-line/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] text-muted">
          <p>© {year} The Beautiful Life · Marion Lubach</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-tan transition">
              Privacy
            </Link>
            <span className="text-muted/40">·</span>
            <span className="tracking-[0.22em] uppercase">
              NL <span className="text-tan/40">·</span> EN
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
