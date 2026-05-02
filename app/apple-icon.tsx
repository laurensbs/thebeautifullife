import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F1EBE0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: 24,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "#7C8867",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#F6F1E7",
            fontSize: 56,
            fontWeight: 600,
            fontStyle: "italic",
            lineHeight: 1,
            fontFamily: "serif",
            paddingBottom: 4,
          }}
        >
          B
        </div>
        <div
          style={{
            color: "#2A2A28",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
            fontFamily: "serif",
            display: "flex",
          }}
        >
          The Beautiful Life
        </div>
      </div>
    ),
    size
  );
}
