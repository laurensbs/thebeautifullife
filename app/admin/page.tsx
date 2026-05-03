"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import BrandLogo from "@/components/ui/BrandLogo";
import HeartDivider from "@/components/ui/HeartDivider";
import HeartDraw from "@/components/ui/HeartDraw";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Auto-redirect als al ingelogd
  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => {
        if (res.ok) {
          router.replace("/admin/dashboard");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Inloggen mislukt");
      }
    } catch {
      setError("Verbindingsfout");
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <Loader2 className="text-tan animate-spin" size={26} strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px]"
      >
        <div className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-10 sm:px-12 sm:py-14 shadow-[0_18px_48px_rgba(60,50,30,0.08)] relative overflow-hidden">
          <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />

          <div className="text-center mb-7">
            <div className="flex justify-center mb-5">
              <BrandLogo size="md" align="center" />
            </div>
            <p className="font-script text-tan text-2xl">welkom terug,</p>
            <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-1 text-ink">
              Marion
            </h1>
            <p className="text-[10px] tracking-[0.32em] uppercase text-muted mt-3">
              admin
            </p>
            <HeartDivider className="mt-4" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-page-dark/60 border border-tan/30 rounded-md px-4 py-3 flex items-start gap-2.5"
              >
                <span className="text-tan flex-none mt-0.5">
                  <HeartDraw size={12} />
                </span>
                <p className="text-[13px] text-ink-soft leading-snug">{error}</p>
              </motion.div>
            )}

            <div>
              <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
                Gebruikersnaam
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/70 border border-line rounded-md px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
                required
                autoComplete="username"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
                Wachtwoord
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/70 border border-line rounded-md px-4 py-3 pr-11 font-sans text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-tan p-1 transition-colors"
                  aria-label={showPass ? "Verberg wachtwoord" : "Toon wachtwoord"}
                >
                  {showPass ? (
                    <EyeOff size={16} strokeWidth={1.5} />
                  ) : (
                    <Eye size={16} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-6 py-3.5 rounded-[3px] bg-ink hover:brightness-110 text-white font-sans text-xs tracking-[0.22em] uppercase transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Bezig…
                </>
              ) : (
                <>
                  Inloggen
                  <LogIn size={13} strokeWidth={1.6} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[10px] tracking-[0.22em] uppercase text-muted">
          alleen voor Marion
        </p>
      </motion.div>
    </div>
  );
}
