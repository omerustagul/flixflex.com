// ═══════════════════════════════════════════════════════════
// FlixFlex — /admin/kullanicilar/[id] — User detail/edit
// ═══════════════════════════════════════════════════════════

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Activity, Clock } from "lucide-react"
import prisma from "@/lib/prisma"
import { getMockSession } from "@/lib/auth/mock-session"
import { FFContainer } from "@/components/ui/ff-container"
import { FFBadge } from "@/components/ui/ff-badge"
import { UserForm } from "@/components/admin/rbac/user-form"
import { ChangePasswordForm } from "@/components/admin/rbac/change-password-form"
import { DeleteUserButton } from "@/components/admin/rbac/delete-user-button"
import { formatDate, formatRelativeTime } from "@/lib/utils"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  if (!prisma) return { title: "Kullanıcı Düzenle — FlixFlex Admin" }
  const user = await prisma.user.findUnique({ where: { id }, select: { name: true, email: true } })
  return { title: user ? `${user.name ?? user.email} — FlixFlex Admin` : "Kullanıcı Düzenle" }
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params
  const session = await getMockSession()

  if (!prisma) {
    return (
      <div className="px-6 md:px-10 py-8">
        <p className="text-sm text-[var(--foreground-muted)]">
          Veritabanı bağlantısı kurulamadı.
        </p>
      </div>
    )
  }

  const [user, roles, auditLogs] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: { role: { select: { id: true, name: true } } },
    }),
    prisma.role.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.auditLog.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }).catch(() => []),
  ])

  if (!user) notFound()

  const isSelf = session?.user.id === id

  function getInitials(name: string | null, email: string): string {
    const src = name?.trim() || email
    const parts = src.split(/\s+/)
    if (parts.length === 1) return (parts[0][0] + (parts[0][1] ?? "")).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const initials = getInitials(user.name, user.email)

  return (
    <div className="px-6 md:px-10 py-8 space-y-8">
      {/* Back link */}
      <Link
        href="/admin/kullanicilar"
        className="ff-shape-button inline-flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Kullanıcılara Dön
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-12 h-12 flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "var(--ff-purple)" }}
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
                {user.name ?? user.email}
              </h1>
              {isSelf && <FFBadge variant="purple">Siz</FFBadge>}
              {!user.isActive && <FFBadge variant="error">Pasif</FFBadge>}
            </div>
            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">{user.email}</p>
          </div>
        </div>

        <DeleteUserButton
          userId={user.id}
          userName={user.name ?? user.email}
          isSelf={isSelf}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left column — edit form + password */}
        <div className="xl:col-span-2 space-y-6">
          {/* Edit form */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-[var(--foreground-muted)]">
              Bilgileri Düzenle
            </h2>
            <FFContainer border="subtle" padding="lg">
              <UserForm
                roles={roles}
                initial={{
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  roleId: user.roleId,
                  isActive: user.isActive,
                }}
              />
            </FFContainer>
          </section>

          {/* Password section */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-[var(--foreground-muted)]">
              Şifre Değiştir
            </h2>
            <FFContainer border="subtle" padding="lg">
              <ChangePasswordForm userId={user.id} />
            </FFContainer>
          </section>
        </div>

        {/* Right column — meta + audit */}
        <div className="space-y-6">
          {/* Meta info */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-[var(--foreground-muted)]">
              Hesap Bilgileri
            </h2>
            <FFContainer border="subtle" padding="md">
              <dl className="space-y-3">
                <div>
                  <dt className="text-[10px] font-semibold text-[var(--foreground-muted)]">Rol</dt>
                  <dd className="mt-1">
                    <FFBadge variant="outline">{user.role.name}</FFBadge>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold text-[var(--foreground-muted)]">Durum</dt>
                  <dd className="mt-1">
                    <FFBadge variant={user.isActive ? "success" : "error"}>
                      {user.isActive ? "Aktif" : "Pasif"}
                    </FFBadge>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold text-[var(--foreground-muted)]">Son Giriş</dt>
                  <dd className="mt-1 text-sm text-[var(--foreground-muted)]">
                    {user.lastLogin ? (
                      <span title={formatDate(user.lastLogin)}>
                        {formatRelativeTime(user.lastLogin)}
                      </span>
                    ) : (
                      "Hiç giriş yapmadı"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold text-[var(--foreground-muted)]">Kayıt Tarihi</dt>
                  <dd className="mt-1 text-sm text-[var(--foreground-muted)]">
                    {formatDate(user.createdAt)}
                  </dd>
                </div>
              </dl>
            </FFContainer>
          </section>

          {/* Audit log */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-[var(--foreground-muted)] flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              Son Aktiviteler
            </h2>
            <FFContainer border="subtle" padding="none">
              {auditLogs.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <Clock className="w-6 h-6 text-[var(--foreground-faint)] mx-auto mb-2" />
                  <p className="text-xs text-[var(--foreground-faint)]">
                    Aktivite kaydı bulunamadı
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {auditLogs.map((log: { id: string; action: string; createdAt: Date }) => (
                    <li key={log.id} className="px-5 py-3 flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--ff-purple)] mt-1.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[var(--foreground)] truncate">
                          {log.action}
                        </p>
                        <p className="text-[10px] text-[var(--foreground-faint)] mt-0.5">
                          {formatRelativeTime(log.createdAt)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </FFContainer>
          </section>
        </div>
      </div>
    </div>
  )
}
