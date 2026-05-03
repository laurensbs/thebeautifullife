import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Beautiful Life — drie paden naar een leven dat past";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
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
          background:
            "linear-gradient(135deg, #F6F1E7 0%, #F1EBE0 50%, #EAE2D2 100%)",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#4A4A45",
              fontWeight: 500,
              marginBottom: 4,
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
            }}
          >
            Beautiful
          </div>
          <div
            style={{
              fontSize: 140,
              color: "#2A2A28",
              opacity: 0.85,
              fontStyle: "italic",
              lineHeight: 0.9,
              marginTop: -10,
            }}
          >
            Life
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 40,
              color: "#B6906A",
            }}
          >
            <div style={{ width: 60, height: 1, background: "#B6906A" }} />
            <div style={{ fontSize: 28, fontStyle: "italic" }}>♡</div>
            <div style={{ width: 60, height: 1, background: "#B6906A" }} />
          </div>

          <div
            style={{
              fontSize: 26,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#2A2A28",
              marginTop: 28,
            }}
          >
            Drie paden · Eén doel
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#4A4A45",
              marginTop: 14,
              maxWidth: 800,
              lineHeight: 1.5,
            }}
          >
            Van een werkboek in jouw eigen tempo tot 8 dagen volledig voor jezelf —
            kies wat past bij waar jij nu staat.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
