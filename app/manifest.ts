import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Beautiful Life",
    short_name: "Beautiful Life",
    description:
      "Persoonlijke coaching en werkboeken door Marion Lubach — drie paden naar rust, helderheid en richting.",
    start_url: "/",
    display: "standalone",
    background_color: "#F1EBE0",
    theme_color: "#F1EBE0",
    orientation: "portrait",
    icons: [
      { src: "/icon", sizes: "any", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
