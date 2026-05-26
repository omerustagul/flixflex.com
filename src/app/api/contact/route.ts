// ═══════════════════════════════════════════════════════════
// FlixFlex — Contact API Route
// POST /api/contact — validate, simulate send, return ref
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server"
import { contactSchema } from "@/lib/validators/contact-schema"

// ── In-memory rate limiter (dev-safe; swap for Redis in prod) ──
type RateLimitEntry = { count: number; resetAt: number }
const rateLimitMap = new Map<string, RateLimitEntry>()
const RATE_LIMIT_WINDOW_MS = 60_000 // 60 seconds
const RATE_LIMIT_MAX       = 3       // 3 submissions per window per IP

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now   = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true }
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { allowed: true }
}

// ── Helper: short random ref ───────────────────────────────
function generateRef(): string {
  return `FF-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

// ── POST handler ───────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const forwarded = req.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown"
    const { allowed, retryAfter } = checkRateLimit(ip)

    if (!allowed) {
      return NextResponse.json(
        {
          ok: false,
          message: `Çok fazla istek gönderildi. ${retryAfter} saniye bekleyip tekrar deneyin.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      )
    }

    // Parse body
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { ok: false, message: "Geçersiz JSON gövdesi." },
        { status: 400 }
      )
    }

    // Zod validation
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = result.data

    // Simulate email send (real SMTP / Resend comes later)
    console.log("📨 [FlixFlex Contact] New submission:", {
      name:    data.name,
      email:   data.email,
      company: data.company ?? "—",
      phone:   data.phone   ?? "—",
      service: data.service,
      budget:  data.budget  ?? "—",
      message: data.message.slice(0, 80) + (data.message.length > 80 ? "…" : ""),
      ip,
      timestamp: new Date().toISOString(),
    })

    await new Promise((r) => setTimeout(r, 800))

    const ref = generateRef()

    return NextResponse.json(
      { ok: true, ref },
      { status: 200 }
    )
  } catch (err) {
    console.error("[FlixFlex Contact] Unexpected error:", err)
    return NextResponse.json(
      { ok: false, message: "Sunucu hatası. Lütfen tekrar deneyin." },
      { status: 500 }
    )
  }
}

// ── Reject all other methods ───────────────────────────────
export async function GET()    { return NextResponse.json({ ok: false }, { status: 405 }) }
export async function PUT()    { return NextResponse.json({ ok: false }, { status: 405 }) }
export async function DELETE() { return NextResponse.json({ ok: false }, { status: 405 }) }
