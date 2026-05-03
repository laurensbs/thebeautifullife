import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

/**
 * Visitekaartje achterzijde — 89×59 mm.
 *
 * 2-koloms layout: rond Marion-portret links (gezicht koppelt naam aan
 * persoon), alle contact-details rechts. KvK fijn onderaan.
 */

// Node runtime — Edge faalt omdat fetch naar /fonts/ door apex→www redirect
// een lege response geeft, waardoor next/og een lege PNG retourneert.
export const runtime = "nodejs";

const SIZE = { width: 1051, height: 697 };
const PORTRAIT_URL =
  "https://u.cubeupload.com/laurensbs/06420caa3a384d2ea36b.jpeg";

export async function GET() {
  const fonts = loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: "#F1EBE0",
          fontFamily: "Cormorant",
          position: "relative",
          padding: "60px 64px",
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

        {/* LINKS — Marion portret */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 280,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 240,
              height: 240,
              borderRadius: 120,
              overflow: "hidden",
              border: "3px solid #B6906A",
              boxShadow: "0 8px 24px rgba(60,50,30,0.14)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PORTRAIT_URL}
              alt="Marion Lubach"
              width={240}
              height={240}
              style={{
                width: 240,
                height: 240,
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
            paddingLeft: 40,
          }}
        >
          {/* Eyebrow in Pinyon */}
          <div
            style={{
              fontFamily: "Pinyon",
              fontSize: 48,
              color: "#B6906A",
              lineHeight: 1,
            }}
          >
            let&apos;s stay in touch
          </div>

          {/* Korte hartjes-divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#B6906A",
              marginTop: 14,
              marginBottom: 22,
            }}
          >
            <div style={{ width: 50, height: 1, background: "#B6906A", opacity: 0.6 }} />
            <div style={{ fontSize: 16, lineHeight: 1 }}>♡</div>
            <div style={{ width: 50, height: 1, background: "#B6906A", opacity: 0.6 }} />
          </div>

          {/* Naam */}
          <div
            style={{
              fontSize: 24,
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
              fontSize: 28,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#2A2A28",
              fontWeight: 500,
              marginTop: 18,
            }}
          >
            thebeautifullife.nl
          </div>

          {/* Email */}
          <div
            style={{
              fontSize: 18,
              color: "#4A4A45",
              marginTop: 10,
            }}
          >
            contact@thebeautifullife.nl
          </div>

          {/* Instagram */}
          <div
            style={{
              fontSize: 18,
              color: "#4A4A45",
              marginTop: 4,
            }}
          >
            @thebeautifullife
          </div>
        </div>

        {/* KvK fijn onderaan, gecentreerd */}
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            fontSize: 12,
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
