"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, LogIn, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        const data = await res.json();
        setError(data.error || "Inloggen mislukt");
      }
    } catch {
      setError("Verbindingsfout");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blush flex items-center justify-center">
            <Leaf className="text-accent" size={24} strokeWidth={1.2} />
          </div>
          <h1 className="font-serif text-dark text-2xl font-light">Admin</h1>
          <p className="font-sans text-taupe text-[10px] mt-1 tracking-[0.2em] uppercase">
            THE BEAUTIFUL LIFE
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-5 md:p-8 border border-border/40 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-sans px-4 py-2.5 rounded-xl mb-5 flex items-center gap-2">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-500 rounded-full" />
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block font-sans text-[11px] text-brown mb-1.5 tracking-wider uppercase font-medium">
              Gebruikersnaam
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-page border border-border/60 rounded-xl px-4 py-3 font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-6">
            <label className="block font-sans text-[11px] text-brown mb-1.5 tracking-wider uppercase font-medium">
              Wachtwoord
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-page border border-border/60 rounded-xl px-4 py-3 pr-11 font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-brown p-1 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-3 rounded-xl font-sans text-sm tracking-[0.12em] uppercase flex items-center justify-center gap-2 disabled:opacity-50 transition-colors hover:bg-[#a07850]"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Leaf size={16} />
              </motion.div>
            ) : (
              <>
                Inloggen
                <LogIn size={14} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
