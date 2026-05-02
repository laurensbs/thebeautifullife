import { ImageResponse } from "next/og";

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
          fontFamily: "Pinyon Script, cursive",
          color: "#F6F1E7",
          fontSize: 30,
          lineHeight: 1,
          paddingBottom: 4,
        }}
      >
        B
      </div>
    ),
    size
  );
}
