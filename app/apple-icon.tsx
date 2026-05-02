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
          background: "#F6F1E7",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          padding: 24,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#F6F1E7",
            border: "2.5px solid #7C8867",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#B6906A",
            fontFamily: "serif",
            fontSize: 64,
            fontStyle: "italic",
            fontWeight: 500,
            lineHeight: 1,
            paddingBottom: 6,
          }}
        >
          B
        </div>
        <div
          style={{
            color: "#2A2A28",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontFamily: "serif",
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
