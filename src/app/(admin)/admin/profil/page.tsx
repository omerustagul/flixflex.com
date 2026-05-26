import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { User, Shield, Mail, Clock, KeyRound } from "lucide-react"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { formatDate, formatRelativeTime } from "@/lib/utils"
import { ProfileForm } from "@/components/admin/profile/profile-form"
import { PasswordForm } from "@/components/admin/profile/password-form"

export const metadata: Metadata = {
  title: "Profil",
}

function initials(name: string | null, email: string): string {
  const src = (name?.trim().length ? name : email).trim()
  const parts = src.split(/\s+/).filter(Boolean)
  if (!parts.length) return "??"
  if (parts.length === 1) {
    const w = parts[0]
    return (w[0] + (w[1] ?? "")).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default async function ProfilPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/giris?callbackUrl=/admin/profil")
  if (!prisma) redirect("/giris?callbackUrl=/admin/profil")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      role: { select: { name: true } },
    },
  })

  if (!user) redirect("/giris")

  return (
    <div className="px-6 md:px-10 py-8 md:py-12">
      {/* ── Header ────────────────────────────── */}
      <header className="mb-10">
        <p className="text-[11px] font-semibold text-[var(--ff-purple)] mb-3">
          — Profil —
        </p>
        <h1 className="font-display text-xl md:text-2xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] mb-2">
          Hesabını <span className="text-[var(--ff-purple)]">yönet</span>
        </h1>
        <p className="text-xs text-[var(--foreground-muted)] text-base leading-relaxed">
          Kişisel bilgilerini ve şifreni buradan güncelle.
        </p>
      </header>

      {/* ── Identity card ─────────────────────── */}
      <section className="ff-shape-container mb-10 grid md:grid-cols-[auto_1fr] gap-6 items-start p-6 border border-[var(--border)] bg-[var(--surface)]">
        {/* Avatar */}
        <div className="ff-shape-button w-16 h-16 flex items-center justify-center bg-[var(--ff-purple)] text-white font-display font-extrabold text-lg tracking-tight">
          {initials(user.name, user.email)}
        </div>

        {/* Info grid */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <User size={14} className="text-[var(--ff-purple)] mt-0.5" />
            <div>
              <p className="text-[10px] text-[var(--foreground-faint)] mb-0.5">
                Ad Soyad
              </p>
              <p className="text-[var(--foreground)] font-medium">
                {user.name ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Mail size={14} className="text-[var(--ff-purple)] mt-0.5" />
            <div>
              <p className="text-[10px] text-[var(--foreground-faint)] mb-0.5">
                E-posta
              </p>
              <p className="text-[var(--foreground)] font-medium break-all">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Shield size={14} className="text-[var(--ff-purple)] mt-0.5" />
            <div>
              <p className="text-[10px] text-[var(--foreground-faint)] mb-0.5">
                Rol
              </p>
              <p className="text-[var(--foreground)] font-medium">
                {user.role.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock size={14} className="text-[var(--ff-purple)] mt-0.5" />
            <div>
              <p className="text-[10px] text-[var(--foreground-faint)] mb-0.5">
                Son giriş
              </p>
              <p className="text-[var(--foreground)] font-medium">
                {user.lastLogin
                  ? formatRelativeTime(user.lastLogin)
                  : "Henüz hiç"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Form: Personal info ───────────────── */}
      <section className="ff-shape-container mb-10 p-6 md:p-8 border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-6">
          <User size={16} className="text-[var(--ff-purple)]" />
          <h2 className="font-display text-xl font-bold text-[var(--foreground)]">
            Kişisel Bilgiler
          </h2>
        </div>
        <ProfileForm
          initial={{
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }}
        />
      </section>

      {/* ── Form: Password ────────────────────── */}
      <section className="ff-shape-container mb-10 p-6 md:p-8 border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-6">
          <KeyRound size={16} className="text-[var(--ff-purple)]" />
          <h2 className="font-display text-xl font-bold text-[var(--foreground)]">
            Şifre Değiştir
          </h2>
        </div>
        <PasswordForm />
      </section>

      {/* ── Footer note ───────────────────────── */}
      <p className="text-xs text-[var(--foreground-faint)]">
        Hesap oluşturuldu: {formatDate(user.createdAt)}
      </p>
    </div>
  )
}
