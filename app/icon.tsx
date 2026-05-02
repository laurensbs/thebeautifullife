import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#7C8867",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F6F1E7",
          fontSize: 22,
          fontWeight: 600,
          fontStyle: "italic",
          lineHeight: 1,
          fontFamily: "serif",
          paddingBottom: 2,
        }}
      >
        B
      </div>
    ),
    size
  );
}
