"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Pencil, ExternalLink } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import { ViewToggle, type ViewMode } from "@/components/admin/view-toggle"

type ServiceCardItem = {
  id: string
  title: string
  slug: string
  icon: string
  isPublished: boolean
  portfolios: Array<unknown>
}

export function ServicesContent({ items }: { items: ServiceCardItem[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  if (items.length === 0) {
    return (
      <div className="ff-shape-container bg-[var(--surface-elevated)] border border-[var(--border)] py-16 text-center">
        <p className="text-[var(--foreground-muted)] text-sm">Henüz hizmet kaydı yok.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <ServiceCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="ff-shape-container bg-[var(--surface-elevated)] border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-[var(--border)] text-left">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold text-[var(--foreground-muted)]">Hizmet</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[var(--foreground-muted)]">Bağlı Portfolyo</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[var(--foreground-muted)]">Durum</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[var(--foreground-muted)] text-right">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/hizmetler/${item.id}`} className="text-[13px] font-semibold hover:text-[var(--ff-purple)] transition-colors">
                      {item.title}
                    </Link>
                    <p className="text-[11px] text-[var(--foreground-faint)] mt-0.5">/hizmetler/{item.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--foreground-muted)]">
                    {item.portfolios.length} proje
                  </td>
                  <td className="px-4 py-3">
                    <Status published={item.isPublished} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/hizmetler/${item.slug}`} target="_blank" className="ff-shape-button border border-[var(--border)] w-7 h-7 flex items-center justify-center hover:border-[var(--ff-purple-border)] transition-colors">
                        <ExternalLink size={12} />
                      </Link>
                      <Link href={`/admin/hizmetler/${item.id}`} className="ff-shape-button border border-[var(--border)] w-7 h-7 flex items-center justify-center hover:border-[var(--ff-purple-border)] transition-colors">
                        <Pencil size={12} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ServiceCard({ item }: { item: ServiceCardItem }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon] ?? LucideIcons.Globe

  return (
    <div className={cn(
      "ff-shape-container group relative bg-[var(--surface-elevated)] border border-[var(--border)]",
      "p-5 transition-all duration-200 hover:border-[var(--ff-purple-border)]",
      "flex flex-col"
    )}>
      <div className="absolute inset-x-0 top-0 h-px bg-[var(--ff-purple)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-3">
        <div className="ff-shape-button w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(161,52,255,0.1)" }}>
          <Icon size={18} className="text-[var(--ff-purple)]" />
        </div>
        <Status published={item.isPublished} />
      </div>

      <div className="mt-3 space-y-2 flex-1">
        <Link
          href={`/admin/hizmetler/${item.id}`}
          className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--ff-purple)] transition-colors line-clamp-1"
        >
          {item.title}
        </Link>
        <p className="text-[11px] text-[var(--foreground-faint)]">
          /hizmetler/{item.slug}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[var(--border)]">
        <span className="text-[11px] text-[var(--foreground-muted)]">
          {item.portfolios.length} proje
        </span>
        <div className="flex gap-1">
          <Link
            href={`/hizmetler/${item.slug}`}
            target="_blank"
            className="ff-shape-button border border-[var(--border)] w-7 h-7 flex items-center justify-center hover:border-[var(--ff-purple-border)] transition-colors"
          >
            <ExternalLink size={12} />
          </Link>
          <Link
            href={`/admin/hizmetler/${item.id}`}
            className="ff-shape-button border border-[var(--border)] w-7 h-7 flex items-center justify-center hover:border-[var(--ff-purple-border)] transition-colors"
          >
            <Pencil size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function Status({ published }: { published: boolean }) {
  return (
    <span className={cn(
      "ff-shape-container px-3 py-1 text-[10px] border",
      published
        ? "text-[var(--success)] border-[var(--success)]/40 bg-[var(--success)]/20 backdrop-blur-sm"
        : "text-[var(--warning)] border-[var(--warning)]/40 bg-[var(--warning)]/20 backdrop-blur-sm"
    )}>
      {published ? "Yayında" : "Taslak"}
    </span>
  )
}
