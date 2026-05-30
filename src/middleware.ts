// ═══════════════════════════════════════════════════════════
// FlixFlex — Next.js Middleware (Edge)
//
// Guards `/admin/*` routes by reading the NextAuth JWT session
// at the edge. Unauthenticated requests are redirected to the
// Turkish login page (`/giris`) with a `callbackUrl` query so
// the user lands back where they wanted to go after login.
//
// NOTE: NextAuth v5 exposes its middleware via the `auth` export
// from the same NextAuth({...}) call we use for server actions.
// Wrapping our handler in `auth(...)` means we get the resolved
// session on `req.auth` without spawning a Node runtime.
// ═══════════════════════════════════════════════════════════

import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/config"

// Edge-safe auth instance: uses the lightweight shared config only.
// Does NOT import Prisma, bcryptjs, or the env validator — those
// would balloon the middleware bundle past Vercel's Edge limit.
// The full server-side auth() lives in @/lib/auth (lib/auth/index.ts).
const { auth } = NextAuth(authConfig)

// Public path prefixes — anything matching these short-circuits
// the middleware and is served without an auth check. The matcher
// below already excludes most public traffic; this list is the
// last line of defence and keeps the login page itself reachable.
const PUBLIC_PREFIXES = [
  "/giris",
  "/api/auth",
  "/_next",
  "/favicon",
  "/robots",
  "/sitemap",
]

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
}

export default auth((req) => {
  const { nextUrl } = req
  const pathname = nextUrl.pathname

  // Public assets / auth endpoints: pass through.
  if (isPublic(pathname)) return NextResponse.next()

  // Only `/admin/*` is gated by this middleware. Everything else
  // is part of the public marketing site.
  const isAdminRoute = pathname.startsWith("/admin")
  if (!isAdminRoute) return NextResponse.next()

  // `req.auth` is the resolved session (or null) — populated by
  // the `auth()` wrapper above.
  const isAuthed = Boolean(req.auth?.user)

  if (!isAuthed) {
    const loginUrl = new URL("/giris", nextUrl.origin)
    // Preserve the originally requested URL so we can bounce the
    // user back after a successful sign-in.
    const callbackUrl = pathname + (nextUrl.search ?? "")
    loginUrl.searchParams.set("callbackUrl", callbackUrl)
    return NextResponse.redirect(loginUrl)
  }

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-is-admin", "true")
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  })
})

// ── Matcher ─────────────────────────────────────────────
// Scope the middleware so it never runs for static assets or
// image-optimised responses. We deliberately INCLUDE /admin and
// EXCLUDE everything next/image, _next/static, public files.
export const config = {
  matcher: [
    // Run on admin routes
    "/admin/:path*",
    // ...and on the login page (so we can redirect already-logged-in
    // users away from /giris if we ever want to — handler currently
    // just passes through, but matcher lets us iterate without
    // touching the config).
    "/giris",
  ],
}
