import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // ── Image Optimization ────────────────────────────
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "ferf1mheo22r9ira.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "image.mux.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // ── Performance ──────────────────────────────────
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
    ],
  },

  // ── Headers ──────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // ── HSTS: force HTTPS for 2 years, include subdomains, eligible for preload list.
          {
            key:   "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // ── CSP: locks down script/style/font/img/media/connect sources.
          // 'unsafe-inline' on script-src is required by Next.js today
          // (for the hydration runtime). Can be tightened with nonces
          // in a follow-up. Mux player + Anthropic + Google Fonts
          // origins are allow-listed explicitly.
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.mux.com https://www.gstatic.com; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "font-src 'self' https://fonts.gstatic.com data:; " +
              "img-src 'self' data: blob: https:; " +
              "media-src 'self' blob: https://*.mux.com; " +
              "connect-src 'self' https://*.mux.com https://*.litix.io https://api.anthropic.com; " +
              "frame-ancestors 'none';",
          },
        ],
      },
      {
        // Static assets — long cache
        source: "/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ]
  },

  // ── Redirects ────────────────────────────────────
  // Legacy /admin/renkler → /admin/theme (bookmark compat)
  async redirects() {
    return [
      {
        source: "/admin/renkler",
        destination: "/admin/theme",
        permanent: true,
      },
      {
        source: "/admin/renkler/:path*",
        destination: "/admin/theme/:path*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
