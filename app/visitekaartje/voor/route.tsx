import { ImageResponse } from "next/og";

/**
 * Visitekaartje voorzijde — 89×59 mm met 2 mm bleed (= 85×55 mm trim).
 * 300 DPI: 89mm × 11.811 = 1051px breed, 59mm × 11.811 = 697px hoog.
 *
 * Layout:
 * - Cream achtergrond (page-soft)
 * - Tan top-bar voor visuele identiteit
 * - Gestapeld "The Beautiful Life" logo midden-boven
 * - Hartjes-divider
 * - Marion's naam in serif caps
 * - Rol in script (Pinyon-stijl, fallback italic serif)
 *
 * Trim-zone: alle belangrijke content binnen 1051-118=933 × 697-118=579 px,
 *   ofwel 4mm marge van elke rand. Bleed-zone (achtergrondkleur) loopt door
 *   tot aan de rand zodat snijden zonder witte randjes gaat.
 */

export const runtime = "edge";

const SIZE = { width: 1051, height: 697 };

export async function GET() {
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
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Tan accent strip top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 12,
            background: "#B6906A",
          }}
        />
        {/* Tan accent strip bottom (subtieler) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "#B6906A",
            opacity: 0.5,
          }}
        />

        {/* Gestapeld logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#4A4A45",
              fontWeight: 500,
            }}
          >
            The
          </div>
          <div
            style={{
              fontSize: 96,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#2A2A28",
              fontWeight: 500,
              lineHeight: 1,
              marginTop: 4,
            }}
          >
            Beautiful
          </div>
          <div
            style={{
              fontSize: 156,
              color: "#2A2A28",
              opacity: 0.85,
              fontStyle: "italic",
              lineHeight: 0.9,
              marginTop: -14,
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
            gap: 22,
            marginTop: 36,
            color: "#B6906A",
          }}
        >
          <div style={{ width: 90, height: 1, background: "#B6906A" }} />
          <div style={{ fontSize: 26, lineHeight: 1 }}>♡</div>
          <div style={{ width: 90, height: 1, background: "#B6906A" }} />
        </div>

        {/* Naam */}
        <div
          style={{
            fontSize: 32,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#2A2A28",
            fontWeight: 500,
            marginTop: 24,
          }}
        >
          Marion Lubach
        </div>

        {/* Rol — script-stijl, fallback italic */}
        <div
          style={{
            fontSize: 30,
            color: "#B6906A",
            fontStyle: "italic",
            marginTop: 8,
          }}
        >
          jouw creatief levensmentor
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
