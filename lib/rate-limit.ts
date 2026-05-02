import { NextRequest, NextResponse } from "next/server";

/**
 * In-memory rate-limiter — sliding window per (key, route).
 *
 * Beperkingen:
 * - Werkt alleen binnen één Node-proces. Voor productie met meerdere
 *   instances is Upstash/Redis nodig. Voor de huidige Vercel-stijl
 *   deploy met enkele region is dit voldoende.
 * - State leeft in module-scope; reset bij cold start.
 *
 * Gebruik in een route handler:
 *
 *   const limited = await checkRateLimit(request, {
 *     bucket: "subscribe",
 *     max: 5,
 *     windowMs: 60_000,
 *   });
 *   if (limited) return limited;
 */

type Bucket = {
  count: number;
  resetAt: number;
};

const STORE = new Map<string, Bucket>();

// Cleanup elke 5 minuten — voorkomt geheugenlek.
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60_000;
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [k, v] of STORE) {
    if (v.resetAt < now) STORE.delete(k);
  }
}

export function getClientIp(request: NextRequest): string {
  // Probeer in volgorde: x-forwarded-for, x-real-ip, fallback "unknown".
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export type RateLimitOptions = {
  bucket: string; // bv. "subscribe", "client-login"
  max: number; // max aantal in venster
  windowMs: number; // venster in ms
  identifier?: string; // override IP (bv. e-mailadres bij login)
};

/**
 * Returnt null als de request mag, of een NextResponse 429 als het
 * over het limiet is.
 */
export async function checkRateLimit(
  request: NextRequest,
  opts: RateLimitOptions
): Promise<NextResponse | null> {
  maybeCleanup();
  const id = opts.identifier ?? getClientIp(request);
  const key = `${opts.bucket}:${id}`;
  const now = Date.now();
  const cur = STORE.get(key);

  if (!cur || cur.resetAt < now) {
    STORE.set(key, { count: 1, resetAt: now + opts.windowMs });
    return null;
  }

  if (cur.count < opts.max) {
    cur.count += 1;
    return null;
  }

  const retryAfter = Math.max(1, Math.ceil((cur.resetAt - now) / 1000));
  return NextResponse.json(
    {
      error:
        "Te veel verzoeken. Probeer het over een paar minuten opnieuw. / Too many requests. Please try again in a few minutes.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(opts.max),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(cur.resetAt / 1000)),
      },
    }
  );
}
