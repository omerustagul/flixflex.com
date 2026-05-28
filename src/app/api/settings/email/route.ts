// ═══════════════════════════════════════════════════════════
// FlixFlex — Email Settings API Route
// GET/POST /api/settings/email — admin authentication required
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, jsonError } from "@/lib/ai/api-utils"
import { getSetting, setSetting } from "@/lib/settings"

export async function GET() {
  const gate = await requireAdmin()
  if (!gate.ok) return gate.response

  const data = {
    provider:    await getSetting("mail.provider", "mock"),
    from:        await getSetting("mail.from", "FlixFlex <onboarding@resend.dev>"),
    resendKey:   await getSetting("mail.resend.key", ""),
    smtpHost:    await getSetting("mail.smtp.host", ""),
    smtpPort:    await getSetting("mail.smtp.port", "587"),
    smtpUser:    await getSetting("mail.smtp.user", ""),
    smtpPass:    await getSetting("mail.smtp.pass", ""),
    smtpSecure:  await getSetting("mail.smtp.secure", "false"),
  }

  return NextResponse.json({ ok: true, data })
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin()
  if (!gate.ok) return gate.response

  try {
    const body = await req.json()

    if (body.provider !== undefined)   await setSetting("mail.provider",    body.provider)
    if (body.from !== undefined)       await setSetting("mail.from",        body.from)
    if (body.resendKey !== undefined)  await setSetting("mail.resend.key",  body.resendKey)
    if (body.smtpHost !== undefined)   await setSetting("mail.smtp.host",   body.smtpHost)
    if (body.smtpPort !== undefined)   await setSetting("mail.smtp.port",   body.smtpPort)
    if (body.smtpUser !== undefined)   await setSetting("mail.smtp.user",   body.smtpUser)
    if (body.smtpPass !== undefined)   await setSetting("mail.smtp.pass",   body.smtpPass)
    if (body.smtpSecure !== undefined) await setSetting("mail.smtp.secure", body.smtpSecure)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[settings/email POST]", err)
    return jsonError("E-posta ayarları kaydedilirken hata oluştu.", 500)
  }
}
