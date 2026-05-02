import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Favicon — cream rondje met sage cirkel-rand en serif italic "B" in tan.
 * Past bij de Cormorant Garamond serif die de site overal gebruikt voor
 * "Beautiful" en de portaal-titels. Geen externe font-dependency die
 * ImageResponse op edge-runtime zou kunnen breken.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F6F1E7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#F6F1E7",
            border: "2px solid #7C8867",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#B6906A",
            fontFamily: "serif",
            fontSize: 36,
            fontStyle: "italic",
            fontWeight: 500,
            lineHeight: 1,
            paddingBottom: 4,
          }}
        >
          B
        </div>
      </div>
    ),
    size
  );
}
