import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

/**
 * Visitekaartje voorzijde — 89×59 mm (= 85×55 mm trim + 2 mm bleed).
 * 300 DPI: 1051×697 px.
 *
 * Stijl-uitgangspunten (matchen de website):
 * - Cream pagina (#F6F1E7), tan accent (#B6906A), ink (#2A2A28)
 * - Echt Cormorant Garamond + Pinyon Script (via /lib/og-fonts)
 * - Veel ademruimte, gecentreerde compositie
 * - "Life" in Pinyon — dé visuele anker van het brand
 *
 * Compositie: minimal en luxe. Logo + portret + tagline. Niet meer.
 * Adres en contact staan op de achterkant.
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
          background: "#F6F1E7",
          fontFamily: "Cormorant",
          position: "relative",
          padding: 64,
        }}
      >
        {/* Tan accent strip onder, loopt door tot in bleed */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#B6906A",
          }}
        />

        {/* Gestapeld logo — gecentreerd, écht in huisstijl */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#4A4A45",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            The
          </div>
          <div
            style={{
              fontSize: 64,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#2A2A28",
              fontWeight: 500,
              lineHeight: 1,
              marginTop: 6,
            }}
          >
            Beautiful
          </div>
          <div
            style={{
              fontFamily: "Pinyon",
              fontSize: 110,
              color: "#2A2A28",
              opacity: 0.85,
              lineHeight: 0.9,
              marginTop: -4,
            }}
          >
            Life
          </div>
        </div>

        {/* Hartjes-divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 24,
            color: "#B6906A",
          }}
        >
          <div style={{ width: 60, height: 1, background: "#B6906A", opacity: 0.6 }} />
          <div style={{ fontSize: 18, lineHeight: 1 }}>♡</div>
          <div style={{ width: 60, height: 1, background: "#B6906A", opacity: 0.6 }} />
        </div>

        {/* Belofte */}
        <div
          style={{
            fontSize: 26,
            color: "#4A4A45",
            fontStyle: "italic",
            marginTop: 18,
          }}
        >
          rust, helderheid en richting
        </div>
      </div>
    ),
    { ...SIZE, fonts }
  );
}
