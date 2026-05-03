import { ImageResponse } from "next/og";
import { loadOgFonts, publicImageDataUrl } from "@/lib/og-fonts";

/**
 * Visitekaartje achterzijde — 89×59 mm.
 *
 * 2-koloms layout met écht laadbaar Marion-portret (lokaal /public/marion.jpg
 * als base64 data-URL omdat Satori remote images niet betrouwbaar laadt).
 */

export const runtime = "nodejs";

const SIZE = { width: 1051, height: 697 };

const HEART_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#B6906A"><path d="M12 21s-8-4.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11-8 11z" opacity="0.85"/></svg>`
)}`;

export async function GET() {
  const fonts = loadOgFonts();
  const marionDataUrl = publicImageDataUrl("marion.jpg", "image/jpeg");

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
          padding: "55px 64px 70px",
        }}
      >
        {/* Tan accent strip boven */}
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
              width: 260,
              height: 260,
              borderRadius: 130,
              overflow: "hidden",
              border: "3px solid #B6906A",
              boxShadow: "0 10px 28px rgba(60,50,30,0.18)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={marionDataUrl}
              alt="Marion Lubach"
              width={260}
              height={260}
              style={{
                width: 260,
                height: 260,
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        </div>

        {/* RECHTS — content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 1,
            paddingLeft: 50,
          }}
        >
          {/* Eyebrow in Pinyon */}
          <div
            style={{
              fontFamily: "Pinyon",
              fontSize: 56,
              color: "#B6906A",
              lineHeight: 1,
              letterSpacing: "0.01em",
            }}
          >
            {/* Spatie na apostrof + curly quote om Pinyon kerning issue te omzeilen */}
            {"let’s  stay in touch"}
          </div>

          {/* Hartjes-divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 16,
              marginBottom: 24,
            }}
          >
            <div style={{ width: 60, height: 1, background: "#B6906A", opacity: 0.6 }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HEART_SVG} width={14} height={14} alt="" />
            <div style={{ width: 60, height: 1, background: "#B6906A", opacity: 0.6 }} />
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
              fontSize: 30,
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
              fontSize: 19,
              color: "#4A4A45",
              marginTop: 12,
            }}
          >
            contact@thebeautifullife.nl
          </div>

          {/* Instagram */}
          <div
            style={{
              fontSize: 19,
              color: "#4A4A45",
              marginTop: 5,
            }}
          >
            @thebeautifullife
          </div>
        </div>

        {/* KvK fijn onderaan, gecentreerd */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
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
