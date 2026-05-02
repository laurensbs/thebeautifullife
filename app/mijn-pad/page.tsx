import { redirect } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";
import { getClientSession } from "@/lib/client-auth";
import {
  PACKAGES,
  STATUS_LABELS,
  isPackageSlug,
  type PackageStatus,
  type PackageSlug,
} from "@/lib/packages";
import { getWorkbook, workbookFieldKeys, PACKAGE_WORKBOOKS } from "@/lib/workbooks";
import {
  Heart,
  CheckCircle,
  CircleDot,
  Mail,
  Phone,
  CalendarClock,
  Video,
  BookOpen,
  ArrowRight,
  Sparkles,
  LogOut,
} from "lucide-react";

export const dynamic = "force-dynamic";

type SubmissionRow = {
  id: number;
  first_name: string;
  contact: string;
  phone: string | null;
  package: string | null;
  status: string;
  created_at: string;
  paid_at: string | null;
  amount_cents: number | null;
  scheduled_at: string | null;
  zoom_meeting_url: string | null;
  questionnaire_completed: boolean;
};

type WorkbookRow = {
  workbook_slug: string;
  access_token: string;
  last_seen_at: string | null;
  filled_count: number;
};

const fmtDate = (s: string | null) =>
  s
    ? new Date(s).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

const fmtDateTime = (s: string | null) =>
  s
    ? new Date(s).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const euros = (cents: number | null) =>
  cents == null
    ? "—"
    : `€${(cents / 100).toLocaleString("nl-NL", {
        minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
      })}`;

export default async function MijnPad() {
  const session = await getClientSession();
  if (!session) redirect("/mijn-pad/login");

  const subs = (await sql`
    SELECT id, first_name, contact, phone, package, status, created_at, paid_at,
           amount_cents, scheduled_at, zoom_meeting_url, questionnaire_completed
    FROM submissions
    WHERE id = ANY(${session.submissionIds}::int[])
    ORDER BY created_at DESC
  `) as unknown as SubmissionRow[];

  const wbRows = (await sql`
    SELECT wa.workbook_slug, wa.access_token, wa.last_seen_at,
      (SELECT COUNT(*) FROM workbook_answers wn
        WHERE wn.access_id = wa.id AND COALESCE(LENGTH(TRIM(wn.value)), 0) > 0) AS filled_count
    FROM workbook_access wa
    WHERE wa.submission_id = ANY(${session.submissionIds}::int[])
  `) as unknown as WorkbookRow[];

  const wbBySlug = new Map<string, WorkbookRow[]>();
  for (const w of wbRows) {
    const slug = String(w.workbook_slug);
    if (!wbBySlug.has(slug)) wbBySlug.set(slug, []);
    wbBySlug.get(slug)!.push(w);
  }

  const isTestMode = process.env.PAYMENTS_TEST_MODE !== "false";

  // Pick the first contact info we can find for the profile card.
  const profile = subs[0] ?? null;

  return (
    <main className="max-w-[1100px] mx-auto px-5 sm:px-6 pt-6 sm:pt-8 pb-16 sm:pb-20">
      {/* Header */}
      <div className="bg-page-soft rounded-[6px] px-6 py-7 sm:px-12 sm:py-11 shadow-[0_18px_48px_rgba(60,50,30,0.08)] mb-7 sm:mb-8 relative overflow-hidden">
        <div className="absolute top-6 right-6 flex items-center gap-2">
          {isTestMode && (
            <span className="text-[10px] tracking-[0.18em] uppercase bg-amber-100 text-amber-800 border border-amber-300 px-2 py-1 rounded">
              Test-modus
            </span>
          )}
          <a
            href="/api/client/logout"
            className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-ink-soft hover:text-tan transition px-2 py-1"
          >
            <LogOut size={12} /> Uit
          </a>
        </div>

        <p className="font-script text-tan text-3xl">welkom terug,</p>
        <h1 className="font-serif font-medium text-3xl sm:text-4xl tracking-[0.06em] uppercase mt-1 text-ink">
          {session.firstName}
        </h1>

        <div className="my-5 flex items-center gap-2.5 text-tan">
          <span className="h-px w-12 bg-tan/55" />
          <span className="text-sm">♡</span>
          <span className="h-px w-12 bg-tan/55" />
        </div>

        <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md">
          Hier vind je jouw pad — de pakketten waarop je bent ingeschreven, je
          werkboeken, en alles wat we samen gaande hebben.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6 sm:gap-7 items-start">
        {/* Left column — paths */}
        <div className="space-y-5">
          <h2 className="font-serif font-medium tracking-[0.22em] uppercase text-sm text-ink mb-1">
            Mijn pad
          </h2>

          {subs.length === 0 && (
            <div className="bg-page-soft rounded-[6px] px-8 py-10 text-center text-ink-soft">
              <Sparkles className="text-tan mx-auto mb-3" size={22} />
              <p className="font-script text-tan text-2xl">Nog geen pakket gestart.</p>
              <p className="mt-2 text-sm">
                <Link href="/" className="underline hover:text-tan">
                  Bekijk de drie paden
                </Link>{" "}
                en kies wanneer jij eraan toe bent.
              </p>
            </div>
          )}

          {subs.map((sub) => {
            const slug = isPackageSlug(sub.package) ? sub.package : null;
            const pkg = slug ? PACKAGES[slug] : null;

            // In test-mode beschouwen we elke aanmelding als "betaald".
            const effectiveStatus = (
              isTestMode && sub.status === "aangemeld" && pkg
                ? "betaald"
                : sub.status
            ) as PackageStatus;

            const flow = pkg
              ? pkg.statusFlow
              : (["aangemeld"] as PackageStatus[]);

            const slugWorkbooks = pkg
              ? Array.from(wbBySlug.entries()).filter(([, rows]) =>
                  rows.some(
                    (r) =>
                      r.workbook_slug &&
                      session.submissionIds.includes(sub.id)
                  )
                )
              : [];

            return (
              <article
                key={sub.id}
                className="bg-page-soft rounded-[6px] shadow-[0_18px_48px_rgba(60,50,30,0.08)] overflow-hidden"
              >
                {/* Top band, color-coded per package */}
                <div
                  className={`h-1 w-full ${
                    pkg?.accent === "sage"
                      ? "bg-sage"
                      : pkg?.accent === "tan"
                        ? "bg-tan"
                        : pkg?.accent === "gold"
                          ? "bg-gold"
                          : "bg-line"
                  }`}
                />

                <div className="px-5 py-6 sm:px-9 sm:py-9">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-script text-tan text-xl">
                        {pkg?.kicker ?? "Aanmelding"}
                      </p>
                      <h3 className="font-serif font-medium text-xl sm:text-2xl tracking-[0.08em] uppercase text-ink mt-1">
                        {pkg?.name ?? "—"}
                      </h3>
                      <p className="text-[11px] tracking-[0.18em] uppercase text-muted mt-2">
                        Aangemeld {fmtDate(sub.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-2xl text-ink">
                        {euros(sub.amount_cents ?? pkg?.priceCents ?? null)}
                      </p>
                      <p
                        className={`text-[11px] tracking-[0.16em] uppercase mt-1 ${
                          sub.paid_at || effectiveStatus === "betaald"
                            ? "text-sage-deep"
                            : "text-muted"
                        }`}
                      >
                        {sub.paid_at || effectiveStatus === "betaald"
                          ? "Voldaan"
                          : "Open"}
                        {isTestMode &&
                          (sub.paid_at || effectiveStatus === "betaald") && (
                            <span className="ml-1 normal-case tracking-normal text-amber-700">
                              (test)
                            </span>
                          )}
                      </p>
                    </div>
                  </div>

                  {/* Status timeline */}
                  {pkg && (
                    <div className="mt-7">
                      <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">
                        Voortgang
                      </p>
                      <ol className="flex flex-wrap items-center gap-x-1 gap-y-3">
                        {flow.map((step, i) => {
                          const idx = flow.indexOf(effectiveStatus);
                          const myIdx = i;
                          const reached = idx >= 0 && myIdx <= idx;
                          const current = step === effectiveStatus;
                          return (
                            <li
                              key={step}
                              className="flex items-center gap-1.5"
                            >
                              <span
                                className={`flex items-center justify-center rounded-full w-6 h-6 text-[10px] ${
                                  current
                                    ? pkg.accent === "sage"
                                      ? "bg-sage text-white"
                                      : pkg.accent === "tan"
                                        ? "bg-tan text-white"
                                        : "bg-gold text-white"
                                    : reached
                                      ? "bg-tan/15 text-tan border border-tan/40"
                                      : "bg-page text-muted border border-line"
                                }`}
                              >
                                {reached ? (
                                  current ? (
                                    <CircleDot size={11} />
                                  ) : (
                                    <CheckCircle size={11} />
                                  )
                                ) : (
                                  i + 1
                                )}
                              </span>
                              <span
                                className={`text-[11px] ${current ? "text-ink font-medium" : reached ? "text-ink-soft" : "text-muted"}`}
                              >
                                {STATUS_LABELS[step]}
                              </span>
                              {i < flow.length - 1 && (
                                <span className="hidden sm:inline-block w-5 h-px bg-line mx-1" />
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  )}

                  {/* Scheduled & Zoom */}
                  {(sub.scheduled_at || sub.zoom_meeting_url) && (
                    <div className="mt-6 grid sm:grid-cols-2 gap-3">
                      {sub.scheduled_at && (
                        <InfoRow
                          icon={<CalendarClock size={14} className="text-tan" />}
                          label="Geplande call"
                          value={fmtDateTime(sub.scheduled_at)}
                        />
                      )}
                      {sub.zoom_meeting_url && (
                        <InfoRow
                          icon={<Video size={14} className="text-tan" />}
                          label="Zoom-link"
                          value={
                            <a
                              href={sub.zoom_meeting_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-tan underline break-all"
                            >
                              {sub.zoom_meeting_url}
                            </a>
                          }
                        />
                      )}
                    </div>
                  )}

                  {/* Workbooks for this package */}
                  <PackageWorkbooks
                    pkgSlug={slug}
                    workbookRows={wbRows.filter(
                      (w) => session.submissionIds.includes(sub.id)
                    )}
                  />

                  {/* Vragenlijst (alleen pakket 1) */}
                  {pkg?.slug === "ikigai" && !sub.questionnaire_completed && (
                    <Link
                      href={`/vragenlijst`}
                      className="mt-5 inline-flex items-center gap-1.5 text-tan hover:text-tan/80 text-sm group"
                    >
                      Vul je reflectievragenlijst in
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-0.5 transition"
                      />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Right column — profile */}
        <aside className="space-y-5">
          <h2 className="font-serif font-medium tracking-[0.22em] uppercase text-sm text-ink mb-1">
            Mijn gegevens
          </h2>
          <div className="bg-page-soft rounded-[6px] px-5 py-6 sm:px-7 sm:py-7 shadow-[0_18px_48px_rgba(60,50,30,0.08)] space-y-4">
            <p className="font-script text-tan text-2xl">{session.firstName}</p>
            <div className="space-y-3">
              <InfoRow
                icon={<Mail size={13} className="text-tan" />}
                label="E-mail"
                value={session.email}
              />
              {profile?.phone && (
                <InfoRow
                  icon={<Phone size={13} className="text-tan" />}
                  label="Telefoon"
                  value={profile.phone}
                />
              )}
            </div>
            <p className="text-[11px] text-muted leading-relaxed pt-3 border-t border-line/40">
              Wijzigingen doorgeven? Mail{" "}
              <a
                href="mailto:contact@thebeautifullife.nl"
                className="text-tan underline"
              >
                contact@thebeautifullife.nl
              </a>
              .
            </p>
          </div>

          <div className="bg-page-dark rounded-[6px] px-5 py-6 sm:px-7 sm:py-7">
            <p className="font-script text-sage-deep text-2xl mb-2">
              ✿ The Beautiful Life
            </p>
            <p className="text-ink-soft text-sm leading-[1.85]">
              Wil je een ander pad starten? Bekijk de drie pakketten en kies wanneer
              jij eraan toe bent.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 mt-4 text-tan hover:text-tan/80 text-sm group"
            >
              Bekijk de pakketten
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition"
              />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex-none">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted">
          {label}
        </p>
        <div className="text-ink text-sm break-words">{value}</div>
      </div>
    </div>
  );
}

function PackageWorkbooks({
  pkgSlug,
  workbookRows,
}: {
  pkgSlug: PackageSlug | null;
  workbookRows: WorkbookRow[];
}) {
  if (!pkgSlug) return null;
  const slugs = PACKAGE_WORKBOOKS[pkgSlug] ?? [];
  if (slugs.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2 flex items-center gap-1.5">
        <BookOpen size={11} /> Werkboek
      </p>
      <div className="space-y-2">
        {slugs.map((s) => {
          const wb = getWorkbook(s);
          if (!wb) return null;
          const total = workbookFieldKeys(wb).length;
          const row = workbookRows.find((r) => r.workbook_slug === s);
          const filled = row ? Number(row.filled_count) : 0;
          const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
          return (
            <div
              key={s}
              className="bg-page rounded-md px-4 py-3 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-serif text-ink text-[15px]">{wb.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 bg-line/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-tan rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-tan w-20 text-right font-medium">
                    {filled}/{total} velden
                  </span>
                </div>
              </div>
              <Link
                href={
                  row?.access_token
                    ? `/werkboek/${s}?token=${row.access_token}`
                    : `/werkboek/login?slug=${s}`
                }
                className="text-[11px] tracking-[0.18em] uppercase bg-ink hover:brightness-110 text-white px-3 py-2 rounded transition"
              >
                Open
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
