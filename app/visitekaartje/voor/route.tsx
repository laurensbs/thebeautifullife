import { ImageResponse } from "next/og";

/**
 * Visitekaartje voorzijde — 89×59 mm met 2 mm bleed (= 85×55 mm trim).
 * 300 DPI: 1051×697 px.
 *
 * Asymmetrische layout:
 * - Links: rond Marion-portret (240px) verticaal gecentreerd
 * - Rechts: gestapeld logo + naam + beroep + URL
 *
 * Tan accent-strips boven/onder lopen door tot in bleed-zone.
 * Trim-marge: ±47px (4mm) van elke rand, content blijft binnen safe area.
 */

export const runtime = "edge";

const SIZE = { width: 1051, height: 697 };
const PORTRAIT_URL =
  "https://u.cubeupload.com/laurensbos/06420caa3a384d2ea36b.jpeg";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
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

        {/* LINKS — Marion portret cirkel */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 400,
            height: "100%",
            paddingLeft: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 280,
              height: 280,
              borderRadius: 140,
              overflow: "hidden",
              border: "3px solid #B6906A",
              boxShadow: "0 8px 24px rgba(60,50,30,0.14)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PORTRAIT_URL}
              alt="Marion Lubach"
              width={280}
              height={280}
              style={{
                width: 280,
                height: 280,
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        </div>

        {/* RECHTS — content blok */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 1,
            paddingRight: 60,
            paddingLeft: 12,
          }}
        >
          {/* Gestapeld logo */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                fontSize: 22,
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
                fontSize: 68,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#2A2A28",
                fontWeight: 500,
                lineHeight: 1,
                marginTop: 2,
              }}
            >
              Beautiful
            </div>
            <div
              style={{
                fontSize: 108,
                color: "#2A2A28",
                opacity: 0.85,
                fontStyle: "italic",
                lineHeight: 0.9,
                marginTop: -10,
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
              marginTop: 26,
              color: "#B6906A",
            }}
          >
            <div style={{ width: 60, height: 1, background: "#B6906A" }} />
            <div style={{ fontSize: 22, lineHeight: 1 }}>♡</div>
            <div style={{ width: 60, height: 1, background: "#B6906A" }} />
          </div>

          {/* Naam */}
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#2A2A28",
              fontWeight: 500,
              marginTop: 22,
            }}
          >
            Marion Lubach
          </div>

          {/* Belofte — concreet wat klant krijgt */}
          <div
            style={{
              fontSize: 24,
              color: "#B6906A",
              fontStyle: "italic",
              marginTop: 6,
            }}
          >
            rust, helderheid en richting
          </div>

          {/* Website — CTA */}
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#2A2A28",
              fontWeight: 500,
              marginTop: 22,
            }}
          >
            thebeautifullife.nl
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
