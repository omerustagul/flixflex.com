"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Plus, Pencil, ExternalLink, Layers } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import { ViewToggle, type ViewMode } from "@/components/admin/view-toggle"

type ServiceCardItem = {
  id: string
  title: string
  slug: string
  icon: string
  isPublished: boolean
  parentId?: string | null
  parent?: { id: string; title: string } | null
  children?: Array<unknown>
  portfolios: Array<unknown>
}

export function ServicesPageClient({ items }: { items: ServiceCardItem[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  return (
    <div className="px-6 md:px-10 py-8 space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#333333]">
            Hizmetler
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Public hizmet listesi ve hizmet detay sayfalarını yönetin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={viewMode} onChange={setViewMode} />
          <Link href="/admin/hizmetler/new" className="ff-btn ff-btn-primary inline-flex items-center h-9 font-semibold text-xs gap-2">
            <Plus size={14} />
            Yeni Hizmet
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="ff-shape-container bg-[#f7f7f5] border border-[#CCCCCC] py-16 text-center">
          <p className="text-[#666666] text-xs font-bold">Henüz hizmet kaydı yok.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <ServiceCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="ff-shape-container bg-[#f7f7f5] border border-[#CCCCCC] overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-[#CCCCCC] text-left">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold text-[#666666]">Hizmet</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#666666]">Hiyerarşi</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#666666]">Durum</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#666666] text-right">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[#CCCCCC] last:border-0 hover:bg-[#f7f7f5] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/hizmetler/${item.id}`} className="text-[13px] font-semibold hover:text-[#ff4fd8] transition-colors">
                      {item.title}
                    </Link>
                    <p className="text-[11px] text-[#666666] mt-0.5">/hizmetler/{item.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <HierarchyBadge item={item} />
                  </td>
                  <td className="px-4 py-3">
                    <Status published={item.isPublished} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/hizmetler/${item.slug}`} target="_blank" className="ff-shape-button border border-[#CCCCCC] w-7 h-7 flex items-center justify-center hover:border-[#ff4fd8] text-[#666666] hover:text-[#ff4fd8] transition-colors">
                        <ExternalLink size={12} />
                      </Link>
                      <Link href={`/admin/hizmetler/${item.id}`} className="ff-shape-button border border-[#CCCCCC] w-7 h-7 flex items-center justify-center hover:border-[#ff4fd8] text-[#666666] hover:text-[#ff4fd8] transition-colors">
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

function HierarchyBadge({ item }: { item: ServiceCardItem }) {
  const childCount = Array.isArray(item.children) ? item.children.length : 0

  if (childCount > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-[#ff4fd8] font-medium">
        <Layers size={11} />
        {childCount} alt hizmet
      </span>
    )
  }

  if (item.parent?.title) {
    return (
      <span className="text-[11px] text-[#666666]">
        ← {item.parent.title}
      </span>
    )
  }

  return <span className="text-[11px] text-[#666666]">—</span>
}

function ServiceCard({ item }: { item: ServiceCardItem }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon] ?? LucideIcons.Globe
  const childCount = Array.isArray(item.children) ? item.children.length : 0

  return (
    <div className={cn(
      "ff-shape-container group relative bg-[#f7f7f5] border border-[#cccccc]",
      "p-5 transition-all duration-200 hover:bg-[#ff4fd8]/5 hover:border-[#ff4fd8]/30",
      "flex flex-col"
    )}>
      <div className="absolute inset-x-0 top-0 h-px bg-[#ff4fd8] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-3">
        <div className="ff-shape-button w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(161,52,255,0.1)" }}>
          <Icon size={18} className="text-[#ff4fd8]" />
        </div>
        <div className="flex items-center gap-1.5">
          <HierarchyBadge item={item} />
          <Status published={item.isPublished} />
        </div>
      </div>

      <div className="mt-3 space-y-2 flex-1">
        <Link
          href={`/admin/hizmetler/${item.id}`}
          className="text-sm font-semibold text-[#333333] hover:text-[#ff4fd8] transition-colors line-clamp-1 block"
        >
          {item.title}
        </Link>
        <p className="text-[11px] text-[#666666]">
          /hizmetler/{item.slug}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#cccccc]">
        <span className="text-[11px] text-[#666666]">
          {item.portfolios.length} proje
          {childCount > 0 && <span> · {childCount} alt</span>}
        </span>
        <div className="flex gap-1">
          <Link
            href={`/hizmetler/${item.slug}`}
            target="_blank"
            className="ff-shape-button border border-[#cccccc] w-7 h-7 flex items-center justify-center hover:border-[#ff4fd8] text-[#666666] hover:text-[#ff4fd8] transition-colors"
          >
            <ExternalLink size={12} />
          </Link>
          <Link
            href={`/admin/hizmetler/${item.id}`}
            className="ff-shape-button border border-[#cccccc] w-7 h-7 flex items-center justify-center hover:border-[#ff4fd8] text-[#666666] hover:text-[#ff4fd8] transition-colors"
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
      "ff-shape-container px-2 py-0.5 text-[10px] border",
      published
        ? "text-[#10b981] border-[#10b981]/40 bg-[#10b981]/20 backdrop-blur-sm"
        : "text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/20 backdrop-blur-sm"
    )}>
      {published ? "Yayında" : "Taslak"}
    </span>
  )
}
