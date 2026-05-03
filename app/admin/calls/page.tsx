"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  CalendarClock,
  RefreshCw,
  Video,
  Check,
  X,
  CreditCard,
  Loader2,
  Phone,
  ChevronDown,
} from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";
import HeartDraw from "@/components/ui/HeartDraw";
import BrandLogo from "@/components/ui/BrandLogo";

type Booking = {
  id: number;
  submission_id: number | null;
  contact_email: string;
  contact_name: string;
  contact_phone: string | null;
  booking_type: string;
  scheduled_at: string;
  duration_min: number;
  price_cents: number;
  status: string;
  paid_at: string | null;
  meeting_url: string | null;
  notes: string | null;
  created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  reserved: "Gereserveerd",
  confirmed: "Bevestigd",
  paid: "Betaald",
  completed: "Afgerond",
  cancelled: "Geannuleerd",
  declined: "Afgewezen",
};

const STATUS_TINT: Record<string, string> = {
  reserved: "bg-tan/15 text-tan",
  confirmed: "bg-sage/15 text-sage-deep",
  paid: "bg-sage/15 text-sage-deep",
  completed: "bg-page-dark text-ink-soft",
  cancelled: "bg-red-50 text-red-700",
  declined: "bg-red-50 text-red-700",
};

export default function CallsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);

  const fetchData = useCallback(
    async (refresh = false) => {
      if (refresh) setRefreshing(true);
      try {
        const res = await fetch("/api/admin/bookings");
        if (res.status === 401) {
          router.push("/admin");
          return;
        }
        const data = await res.json();
        setBookings(data.bookings ?? []);
      } catch {
        router.push("/admin");
      }
      setLoading(false);
      setRefreshing(false);
    },
    [router]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const patch = async (id: number, body: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...data.booking } : b))
      );
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString("nl-NL", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const euros = (cents: number) =>
    `€${(cents / 100).toLocaleString("nl-NL", {
      minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    })}`;

  const upcoming = bookings.filter(
    (b) =>
      new Date(b.scheduled_at).getTime() > Date.now() &&
      b.status !== "cancelled" &&
      b.status !== "declined"
  );
  const past = bookings.filter(
    (b) =>
      new Date(b.scheduled_at).getTime() <= Date.now() ||
      b.status === "cancelled" ||
      b.status === "declined"
  );

  if (loading) return <PageLoader label="calls worden geladen…" />;

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-page/90 backdrop-blur-md border-b border-line/40">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" linkTo="/admin/dashboard" />
            <span className="text-[10px] tracking-[0.22em] uppercase text-muted border border-line rounded-full px-2 py-0.5">
              admin
            </span>
          </div>
          <nav className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/admin/dashboard"
              className="text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition-colors px-2 py-1.5"
            >
              Inzendingen
            </Link>
            <Link
              href="/admin/klanten"
              className="text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition-colors px-2 py-1.5"
            >
              Klanten
            </Link>
            <Link
              href="/admin/calls"
              className="text-[11px] tracking-[0.22em] uppercase text-tan font-medium px-2 py-1.5"
            >
              Calls
            </Link>
            <Link
              href="/admin/werkboeken"
              className="text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition-colors px-2 py-1.5"
            >
              Werkboeken
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition-colors px-2 py-1.5 ml-1"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Uit</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-6 pt-6 sm:pt-8 pb-16">
        {/* Welcome card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-7 sm:px-12 sm:py-10 shadow-[0_18px_48px_rgba(60,50,30,0.08)] mb-6 sm:mb-8 relative"
        >
          <button
            onClick={() => fetchData(true)}
            className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-tan hover:bg-page-dark/40 transition"
            aria-label="Vernieuwen"
          >
            <motion.span
              animate={refreshing ? { rotate: 360 } : {}}
              transition={{
                duration: 1,
                repeat: refreshing ? Infinity : 0,
                ease: "linear",
              }}
              className="block"
            >
              <RefreshCw size={16} />
            </motion.span>
          </button>

          <p className="font-script text-tan text-3xl">de calls,</p>
          <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-1 text-ink">
            in beheer
          </h1>
          <div className="my-5 flex items-center gap-2.5 text-tan">
            <span className="h-px w-12 bg-tan/55" />
            <HeartDraw size={14} />
            <span className="h-px w-12 bg-tan/55" />
          </div>
          <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md">
            Aankomende reserveringen — bevestig, plak de Teams-link, markeer
            als betaald, of annuleer.
          </p>
        </motion.div>

        <Section
          title="Aankomend"
          bookings={upcoming}
          openId={openId}
          setOpenId={setOpenId}
          patch={patch}
          fmtDate={fmtDate}
          euros={euros}
          accent="bg-tan"
        />

        {past.length > 0 && (
          <div className="mt-8">
            <Section
              title="Voorbij & afgesloten"
              bookings={past}
              openId={openId}
              setOpenId={setOpenId}
              patch={patch}
              fmtDate={fmtDate}
              euros={euros}
              accent="bg-line"
            />
          </div>
        )}
      </main>
    </div>
  );

  function Section({
    title,
    bookings,
    openId,
    setOpenId,
    patch,
    fmtDate,
    euros,
    accent,
  }: {
    title: string;
    bookings: Booking[];
    openId: number | null;
    setOpenId: (n: number | null) => void;
    patch: (id: number, body: Record<string, unknown>) => Promise<void>;
    fmtDate: (s: string) => string;
    euros: (c: number) => string;
    accent: string;
  }) {
    return (
      <div>
        <h2 className="font-serif font-medium tracking-[0.22em] uppercase text-sm text-ink mb-3">
          {title}{" "}
          <span className="font-sans text-muted text-[11px] ml-2">
            {bookings.length}
          </span>
        </h2>
        {bookings.length === 0 ? (
          <div className="bg-page-soft rounded-[6px] px-6 py-8 text-center text-ink-soft text-sm">
            Niets in deze categorie.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b, i) => {
              const open = openId === b.id;
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="bg-page-soft rounded-[6px] shadow-[0_8px_24px_rgba(60,50,30,0.04)] hover:shadow-[0_18px_48px_rgba(60,50,30,0.08)] transition-shadow overflow-hidden relative"
                >
                  <span
                    className={`absolute left-0 top-0 bottom-0 w-0.5 ${accent}`}
                  />
                  <button
                    onClick={() => setOpenId(open ? null : b.id)}
                    className="w-full text-left px-4 sm:px-5 py-4 flex items-center gap-3.5"
                  >
                    <div className="flex-none w-10 h-10 rounded-full bg-tan/15 text-tan flex items-center justify-center">
                      <CalendarClock size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif text-ink text-[15px] capitalize">
                          {fmtDate(b.scheduled_at)}
                        </span>
                        <span
                          className={`text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 rounded ${STATUS_TINT[b.status] ?? "bg-page-dark text-muted"}`}
                        >
                          {STATUS_LABEL[b.status] ?? b.status}
                        </span>
                      </div>
                      <p className="font-sans text-ink-soft/85 text-xs mt-0.5">
                        {b.contact_name} ·{" "}
                        <a
                          href={`mailto:${b.contact_email}`}
                          className="hover:text-tan transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {b.contact_email}
                        </a>
                        {b.contact_phone && (
                          <>
                            {" · "}
                            <span className="inline-flex items-center gap-0.5">
                              <Phone size={10} className="text-muted" />
                              {b.contact_phone}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1 mr-1">
                      <span
                        className={`text-[12px] font-medium ${b.paid_at ? "text-sage-deep" : "text-muted"}`}
                      >
                        {euros(b.price_cents)}
                      </span>
                      <span className="text-[10px] text-muted">
                        {b.duration_min} min
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} className="text-muted" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-5 pb-5 border-t border-line/40 pt-4 space-y-3">
                          <BookingDetail
                            b={b}
                            patch={patch}
                            euros={euros}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

function BookingDetail({
  b,
  patch,
  euros,
}: {
  b: Booking;
  patch: (id: number, body: Record<string, unknown>) => Promise<void>;
  euros: (c: number) => string;
}) {
  const [zoom, setZoom] = useState(b.meeting_url ?? "");
  const [notes, setNotes] = useState(b.notes ?? "");
  const [savingZoom, setSavingZoom] = useState(false);

  const action = async (status: string) => {
    await patch(b.id, { status });
  };

  return (
    <div className="space-y-4 text-sm">
      {/* Status actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => action("confirmed")}
          disabled={b.status === "confirmed"}
          className="text-[11px] tracking-[0.18em] uppercase bg-sage hover:brightness-95 text-white px-3 py-1.5 rounded transition disabled:opacity-40 inline-flex items-center gap-1"
        >
          <Check size={11} /> Bevestig
        </button>
        <button
          onClick={() => action("paid")}
          disabled={!!b.paid_at}
          className="text-[11px] tracking-[0.18em] uppercase bg-sage-deep hover:brightness-95 text-white px-3 py-1.5 rounded transition disabled:opacity-40 inline-flex items-center gap-1"
        >
          <CreditCard size={11} />{" "}
          {b.paid_at ? "Betaald" : "Markeer betaald"}
        </button>
        <button
          onClick={() => action("completed")}
          className="text-[11px] tracking-[0.18em] uppercase border border-line text-ink-soft hover:border-tan hover:text-tan px-3 py-1.5 rounded transition"
        >
          Afgerond
        </button>
        <button
          onClick={() => action("cancelled")}
          className="text-[11px] tracking-[0.18em] uppercase border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition inline-flex items-center gap-1 ml-auto"
        >
          <X size={11} /> Annuleer
        </button>
      </div>

      {/* Teams-link */}
      <div>
        <label className="font-sans text-[10px] text-muted tracking-[0.18em] uppercase mb-1.5 flex items-center gap-1.5">
          <Video size={11} /> Teams-link
        </label>
        <div className="flex gap-1.5">
          <input
            type="url"
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            placeholder="https://teams.microsoft.com/…"
            className="flex-1 bg-white/70 border border-line rounded-md px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
          />
          <button
            onClick={async () => {
              setSavingZoom(true);
              await patch(b.id, { meeting_url: zoom || null });
              setSavingZoom(false);
            }}
            disabled={savingZoom}
            className="px-3 py-1.5 rounded-md bg-tan text-white text-[11px] hover:brightness-95 inline-flex items-center gap-1"
          >
            {savingZoom ? <Loader2 size={11} className="animate-spin" /> : null}
            Opslaan
          </button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="font-sans text-[10px] text-muted tracking-[0.18em] uppercase mb-1.5">
          Notities
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if ((b.notes ?? "") !== notes) patch(b.id, { notes });
          }}
          placeholder="Alleen voor jou zichtbaar."
          className="w-full bg-white/70 border border-line rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30 resize-y"
        />
      </div>

      <p className="text-[10px] text-muted">
        Aangemaakt {new Date(b.created_at).toLocaleString("nl-NL")} ·{" "}
        {euros(b.price_cents)}
      </p>
    </div>
  );
}
