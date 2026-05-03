import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

/**
 * Visitekaartje voorzijde — 89×59 mm (= 85×55 mm trim + 2 mm bleed).
 * 300 DPI: 1051×697 px.
 *
 * Compositie: gecentreerd, gebalanceerd. Logo iets boven midden,
 * tagline eronder, klein hartje-SVG als divider, dunne tan-strip onder.
 */

export const runtime = "nodejs";

const SIZE = { width: 1051, height: 697 };

// Inline SVG hartje — Unicode ♡ rendert niet betrouwbaar in Satori.
const HEART_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#B6906A"><path d="M12 21s-8-4.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11-8 11z" opacity="0.85"/></svg>`
)}`;

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
          padding: 60,
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
        {/* Subtiele tan strip boven */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "#B6906A",
            opacity: 0.4,
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
              fontSize: 22,
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
              fontSize: 78,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#2A2A28",
              fontWeight: 500,
              lineHeight: 1,
              marginTop: 8,
            }}
          >
            Beautiful
          </div>
          <div
            style={{
              fontFamily: "Pinyon",
              fontSize: 130,
              color: "#2A2A28",
              opacity: 0.85,
              lineHeight: 0.9,
              marginTop: -6,
            }}
          >
            Life
          </div>
        </div>

        {/* Hartjes-divider met echte SVG */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 28,
          }}
        >
          <div style={{ width: 70, height: 1, background: "#B6906A", opacity: 0.6 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HEART_SVG} width={16} height={16} alt="" />
          <div style={{ width: 70, height: 1, background: "#B6906A", opacity: 0.6 }} />
        </div>

        {/* Belofte */}
        <div
          style={{
            fontSize: 28,
            color: "#4A4A45",
            fontStyle: "italic",
            marginTop: 18,
            letterSpacing: "0.01em",
          }}
        >
          rust, helderheid en richting
        </div>
      </div>
    ),
    { ...SIZE, fonts }
  );
}
