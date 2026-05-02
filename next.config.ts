import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Security headers — toegepast op alle routes.
const securityHeaders = [
  // Prevent rendering inside iframes (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // No MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limit referrer info
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features we don't use
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()",
  },
  // HSTS in production only — verplicht HTTPS voor 1 jaar incl. subdomeinen
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "u.cubeupload.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
