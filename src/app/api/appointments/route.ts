// ═══════════════════════════════════════════════════════════
// FlixFlex — Appointment API Route
// GET/POST /api/appointments — validate, save, query (admin only)
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { appointmentSchema } from "@/lib/validators/appointment-schema"

// ── In-memory rate limiter ──
type RateLimitEntry = { count: number; resetAt: number }
const rateLimitMap = new Map<string, RateLimitEntry>()
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX       = 3

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

// GET — List all appointments (Admin only)
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ ok: true, data: appointments })
  } catch (err) {
    console.error("[Appointments GET] Error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST — Create a new appointment (Public)
export async function POST(req: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { ok: false, message: "Veritabanı bağlantısı kurulamadı." },
        { status: 503 }
      )
    }

    // Rate limit by IP
    const forwarded = req.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown"
    const { allowed, retryAfter } = checkRateLimit(ip)

    if (!allowed) {
      return NextResponse.json(
        {
          ok: false,
          message: `Çok fazla istek gönderildi. Lütfen ${retryAfter} saniye bekleyip tekrar deneyin.`,
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
    const result = appointmentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, date, notes } = result.data

    // Double check if slot is blocked or already booked
    const parsedDate = new Date(date)
    const blockedSlot = await prisma.blockedSlot.findUnique({
      where: { date: parsedDate },
    })

    if (blockedSlot) {
      return NextResponse.json(
        { ok: false, message: "Bu randevu saati kilitlidir. Lütfen başka bir saat seçin." },
        { status: 400 }
      )
    }

    const existingBooking = await prisma.appointment.findFirst({
      where: {
        date: parsedDate,
        status: { in: ["pending", "approved"] },
      },
    })

    if (existingBooking) {
      return NextResponse.json(
        { ok: false, message: "Bu randevu saati doludur. Lütfen başka bir saat seçin." },
        { status: 400 }
      )
    }

    // Create record in database
    const appointment = await prisma.appointment.create({
      data: {
        name,
        email,
        phone,
        subject,
        date: parsedDate,
        notes: notes || null,
        status: "pending",
        isRead: false,
      },
    })

    console.log("📅 [FlixFlex Appointment] New appointment created:", appointment)

    return NextResponse.json(
      { ok: true, appointmentId: appointment.id },
      { status: 201 }
    )
  } catch (err) {
    console.error("[FlixFlex Appointment] Unexpected error:", err)
    return NextResponse.json(
      { ok: false, message: "Randevu oluşturulurken beklenmedik bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    )
  }
}

// ── Reject all other methods ──
export async function PUT()    { return NextResponse.json({ ok: false }, { status: 405 }) }
export async function DELETE() { return NextResponse.json({ ok: false }, { status: 405 }) }
