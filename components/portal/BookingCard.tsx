"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Video,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import HeartDraw from "@/components/ui/HeartDraw";

export type PortalBooking = {
  id: number;
  booking_type?: string | null;
  scheduled_at: string;
  duration_min: number;
  price_cents: number;
  status: string;
  paid_at: string | null;
  meeting_url: string | null;
};

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

const STATUS_LABEL: Record<string, string> = {
  reserved: "Gereserveerd",
  confirmed: "Bevestigd",
  paid: "Betaald",
  completed: "Afgerond",
  cancelled: "Geannuleerd",
  declined: "Afgewezen",
};

export default function BookingCard({
  bookings,
}: {
  bookings: PortalBooking[];
}) {
  const upcoming = bookings.filter(
    (b) =>
      new Date(b.scheduled_at).getTime() > Date.now() &&
      b.status !== "cancelled" &&
      b.status !== "declined"
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] shadow-[0_18px_48px_rgba(60,50,30,0.08)] overflow-hidden relative"
    >
      <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />

      <div className="px-6 py-7 sm:px-9 sm:py-9">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-script text-tan text-2xl">één-op-één,</p>
            <h2 className="font-serif font-medium text-xl sm:text-2xl tracking-[0.06em] uppercase mt-1 text-ink">
              Persoonlijke call met Marion
            </h2>
            <div className="mt-3 flex items-center gap-4 text-[11px] tracking-[0.18em] uppercase text-ink-soft flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock size={12} className="text-tan" /> 60 min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Video size={12} className="text-tan" /> Teams
              </span>
              <span className="font-serif text-tan text-base tracking-normal normal-case">
                €125
              </span>
            </div>
          </div>

          {upcoming.length === 0 && (
            <Link
              href="/boek-call"
              className="inline-flex items-center gap-1.5 bg-tan hover:brightness-95 text-white px-5 py-3 rounded-[3px] font-sans text-[11px] tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)] hover:-translate-y-0.5"
            >
              Plan een call <ArrowRight size={12} />
            </Link>
          )}
        </div>

        {upcoming.length === 0 ? (
          <p className="mt-5 text-ink-soft text-[14px] leading-[1.85] max-w-md">
            Stel je vraag, krijg richting, of werk gericht aan iets dat speelt.
            Marion neemt rustig de tijd voor je.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {upcoming.map((b) => (
              <div
                key={b.id}
                className="bg-page rounded-md px-4 py-3 flex items-start gap-3"
              >
                <span className="flex-none mt-1 text-tan">
                  <HeartDraw size={12} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-ink text-[15px] capitalize">
                    {fmtDateTime(b.scheduled_at)}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={`text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 rounded ${
                        b.status === "confirmed" || b.paid_at
                          ? "bg-sage/15 text-sage-deep"
                          : b.status === "reserved"
                            ? "bg-tan/15 text-tan"
                            : "bg-page-dark text-muted"
                      }`}
                    >
                      {b.paid_at ? (
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle size={10} /> Betaald
                        </span>
                      ) : (
                        STATUS_LABEL[b.status] ?? b.status
                      )}
                    </span>
                    {b.meeting_url && (
                      <a
                        href={b.meeting_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] tracking-[0.18em] uppercase text-tan hover:text-ink transition inline-flex items-center gap-1"
                      >
                        <Video size={10} /> Open Teams
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Link
              href="/boek-call"
              className="inline-flex items-center gap-1.5 mt-1 text-tan hover:text-ink text-[11px] tracking-[0.18em] uppercase transition"
            >
              Plan nog een call <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </motion.section>
  );
}
