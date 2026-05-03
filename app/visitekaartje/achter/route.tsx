import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

/**
 * Visitekaartje achterzijde — 89×59 mm.
 *
 * Hier komen alle harde details: naam, contact, KvK.
 * Marion's signoff bovenaan in Pinyon, contact gecentreerd, KvK fijn onderaan.
 */

// Node runtime — Edge faalt omdat fetch naar /fonts/ door apex→www redirect
// een lege response geeft, waardoor next/og een lege PNG retourneert.
export const runtime = "nodejs";

const SIZE = { width: 1051, height: 697 };

export async function GET() {
  const fonts = loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F1EBE0",
          fontFamily: "Cormorant",
          position: "relative",
          padding: 64,
        }}
      >
        {/* Tan accent strip boven, loopt door tot in bleed */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#B6906A",
          }}
        />

        {/* Eyebrow in Pinyon */}
        <div
          style={{
            fontFamily: "Pinyon",
            fontSize: 60,
            color: "#B6906A",
            lineHeight: 1,
          }}
        >
          let&apos;s stay in touch
        </div>

        {/* Hartjes-divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#B6906A",
            marginTop: 22,
            marginBottom: 36,
          }}
        >
          <div style={{ width: 70, height: 1, background: "#B6906A", opacity: 0.6 }} />
          <div style={{ fontSize: 18, lineHeight: 1 }}>♡</div>
          <div style={{ width: 70, height: 1, background: "#B6906A", opacity: 0.6 }} />
        </div>

        {/* Naam */}
        <div
          style={{
            fontSize: 26,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#2A2A28",
            fontWeight: 500,
          }}
        >
          Marion Lubach
        </div>

        {/* Website prominent */}
        <div
          style={{
            fontSize: 32,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#2A2A28",
            fontWeight: 500,
            marginTop: 24,
          }}
        >
          thebeautifullife.nl
        </div>

        {/* Email + IG */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            fontSize: 22,
            color: "#4A4A45",
            marginTop: 14,
          }}
        >
          <span>contact@thebeautifullife.nl</span>
          <span style={{ color: "#B6906A" }}>·</span>
          <span>@thebeautifullife</span>
        </div>

        {/* KvK fijn onderaan */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            fontSize: 14,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#8A8270",
          }}
        >
          KvK 72639970
        </div>
      </div>
    ),
    { ...SIZE, fonts }
  );
}
