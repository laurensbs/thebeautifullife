import { ImageResponse } from "next/og";

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
            fontFamily: "Pinyon Script, cursive",
            color: "#F6F1E7",
            fontSize: 78,
            lineHeight: 1,
            paddingBottom: 8,
          }}
        >
          B
        </div>
        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            color: "#2A2A28",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
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
