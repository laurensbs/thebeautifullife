import { ImageResponse } from "next/og";

/**
 * Visitekaartje achterzijde — zelfde formaat als voorzijde.
 *
 * Layout: contactgegevens, gecentreerd, met dezelfde tan-strips zodat
 * voor- en achterkant visueel bij elkaar horen.
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
          background: "#F1EBE0",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Tan accent strip top (kleiner dan voor) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "#B6906A",
            opacity: 0.5,
          }}
        />
        {/* Tan accent strip bottom (groter) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 12,
            background: "#B6906A",
          }}
        />

        {/* Eyebrow script-stijl */}
        <div
          style={{
            fontSize: 38,
            color: "#B6906A",
            fontStyle: "italic",
            marginBottom: 6,
          }}
        >
          let&apos;s connect,
        </div>

        {/* Hartjes-divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#B6906A",
            marginBottom: 38,
          }}
        >
          <div style={{ width: 70, height: 1, background: "#B6906A" }} />
          <div style={{ fontSize: 22, lineHeight: 1 }}>♡</div>
          <div style={{ width: 70, height: 1, background: "#B6906A" }} />
        </div>

        {/* Contactblok */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          {/* Website */}
          <div
            style={{
              fontSize: 32,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#2A2A28",
              fontWeight: 500,
            }}
          >
            thebeautifullife.nl
          </div>

          {/* Email + IG in twee kolommen */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 36,
              fontSize: 22,
              color: "#4A4A45",
            }}
          >
            <span>contact@thebeautifullife.nl</span>
            <span style={{ color: "#B6906A" }}>·</span>
            <span>@thebeautifullife</span>
          </div>
        </div>

        {/* Footer met KvK + sub-tagline */}
        <div
          style={{
            position: "absolute",
            bottom: 38,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#2A2A28",
              opacity: 0.85,
              fontStyle: "italic",
            }}
          >
            the beginning of your beautiful life
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8A8270",
            }}
          >
            KvK 72639970
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
