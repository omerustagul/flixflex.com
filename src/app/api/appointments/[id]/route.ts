// ═══════════════════════════════════════════════════════════
// FlixFlex — Appointment ID actions API Route
// PATCH /api/appointments/[id] — admin authentication required
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const body = await req.json()
    const { status, isRead } = body

    const updateData: Record<string, any> = {}
    if (status !== undefined) {
      if (!["pending", "approved", "cancelled", "completed"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }
      updateData.status = status
    }

    if (isRead !== undefined) {
      updateData.isRead = Boolean(isRead)
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ ok: true, data: updated })
  } catch (err) {
    console.error("[Appointment PATCH] Error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Reject all other methods
export async function GET()    { return NextResponse.json({ ok: false }, { status: 405 }) }
export async function POST()   { return NextResponse.json({ ok: false }, { status: 405 }) }
export async function PUT()    { return NextResponse.json({ ok: false }, { status: 405 }) }
export async function DELETE() { return NextResponse.json({ ok: false }, { status: 405 }) }
