import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { del } from "@vercel/blob"

// ── GET: List media ────────────────────────────────
export async function GET(req: Request) {
  if (!prisma) return NextResponse.json({ success: true, data: [] })
  
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const search = searchParams.get("search")
    const folderId = searchParams.get("folderId")

    const where: any = {}
    if (type) where.type = type
    if (folderId) {
      where.folderId = folderId === "root" ? null : folderId
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
      ]
    }

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: media })
  } catch (err) {
    console.error("[media/list]", err)
    return NextResponse.json({ error: "Medya listelenemedi" }, { status: 500 })
  }
}

// ── DELETE: Remove media ────────────────────────────
export async function DELETE(req: Request) {
  if (!prisma) return NextResponse.json({ error: "Veritabanı bağlantısı yok" }, { status: 503 })

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 })

    const media = await prisma.media.findUnique({ where: { id } })
    if (!media) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 })

    // 1. Delete from DB
    await prisma.media.delete({ where: { id } })

    // 2. Delete from Vercel Blob (if it's a blob URL)
    if (media.url.includes("blob.vercel-storage.com")) {
      await del(media.url)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[media/delete]", err)
    return NextResponse.json({ error: "Silme hatası" }, { status: 500 })
  }
}

// ── PATCH: Update media (e.g. Move to folder) ───────
export async function PATCH(req: Request) {
  if (!prisma) return NextResponse.json({ error: "Veritabanı bağlantısı yok" }, { status: 503 })

  try {
    const { id, folderId, title } = await req.json()
    if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 })

    const media = await prisma.media.update({
      where: { id },
      data: {
        folderId: folderId === "root" ? null : folderId,
        title: title !== undefined ? title : undefined
      }
    })

    return NextResponse.json({ success: true, data: media })
  } catch (err) {
    console.error("[media/update]", err)
    return NextResponse.json({ error: "Güncelleme hatası" }, { status: 500 })
  }
}
