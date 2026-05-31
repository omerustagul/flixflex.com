"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { Plus, Pencil, ExternalLink, Layers, ChevronRight } from "lucide-react"
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
  order: number
}

export function ServicesPageClient({ items }: { items: ServiceCardItem[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // Group services hierarchically
  const { mainServices, getChildren, orphanedServices } = useMemo(() => {
    const mains = items.filter((s) => !s.parentId)
    const mainIds = new Set(mains.map((s) => s.id))
    const orphans = items.filter((s) => s.parentId && !mainIds.has(s.parentId))
    
    return {
      mainServices: mains,
      getChildren: (parentId: string) => items.filter((s) => s.parentId === parentId),
      orphanedServices: orphans
    }
  }, [items])

  return (
    <div className="px-6 md:px-10 py-8 space-y-6 mx-auto">
      {/* Page Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap border-b border-[#E0E0E0] pb-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#333333]">
            Hizmetler
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Müşterilerinize sunduğunuz ana hizmet ve alt uzmanlık alanlarını buradan yönetin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={viewMode} onChange={setViewMode} />
          <Link 
            href="/admin/hizmetler/new" 
            className="ff-shape-button inline-flex items-center h-9 px-5 bg-[#ff4fd8] text-white font-bold text-[12px] gap-2 hover:bg-[#ff4fd8]/90 transition-all shadow-sm"
          >
            <Plus size={14} />
            Yeni Hizmet Ekle
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="ff-shape-container bg-[#f7f7f5] border border-[#CCCCCC] py-16 text-center">
          <p className="text-[#666666] text-xs font-bold">Henüz hizmet kaydı yok.</p>
        </div>
      ) : viewMode === "grid" ? (
        /* ── GRID VIEW ───────────────────────────────── */
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mainServices.map((item) => {
              const children = getChildren(item.id)
              return (
                <MainServiceCard 
                  key={item.id} 
                  item={item} 
                  childrenList={children} 
                />
              )
            })}
          </div>

          {/* Orphaned Services (if any exist) */}
          {orphanedServices.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[#E0E0E0]">
              <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider">Diğer Hizmetler (Üst Hizmeti Silinmiş Olanlar)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {orphanedServices.map((item) => (
                  <MainServiceCard 
                    key={item.id} 
                    item={item} 
                    childrenList={[]} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── HIERARCHICAL LIST VIEW ──────────────────── */
        <div className="ff-shape-container bg-[#f7f7f5] border border-[#CCCCCC] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f2f2f2] border-b border-[#CCCCCC]">
              <tr>
                <th className="px-5 py-3 text-[10px] font-bold text-[#666666] uppercase tracking-wider">Hizmet Adı</th>
                <th className="px-5 py-3 text-[10px] font-bold text-[#666666] uppercase tracking-wider w-20">İkon</th>
                <th className="px-5 py-3 text-[10px] font-bold text-[#666666] uppercase tracking-wider w-24">Durum</th>
                <th className="px-5 py-3 text-[10px] font-bold text-[#666666] uppercase tracking-wider w-32">Portfolyo</th>
                <th className="px-5 py-3 text-[10px] font-bold text-[#666666] uppercase tracking-wider w-20">Sıra</th>
                <th className="px-5 py-3 text-[10px] font-bold text-[#666666] uppercase tracking-wider text-right w-28">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {mainServices.map((mainItem) => {
                const children = getChildren(mainItem.id)
                return (
                  <React.Fragment key={mainItem.id}>
                    {/* Parent Row */}
                    <ServiceRow item={mainItem} isChild={false} />
                    
                    {/* Child Rows */}
                    {children.map((childItem) => (
                      <ServiceRow 
                        key={childItem.id} 
                        item={childItem} 
                        isChild={true} 
                      />
                    ))}
                  </React.Fragment>
                )
              })}

              {/* Render Orphaned Services in list */}
              {orphanedServices.map((orphanItem) => (
                <ServiceRow 
                  key={orphanItem.id} 
                  item={orphanItem} 
                  isChild={false} 
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ── SUPPORTING COMPONENTS ───────────────────────── */

// Grid view Main Service Card containing child lists
function MainServiceCard({ item, childrenList }: { item: ServiceCardItem; childrenList: ServiceCardItem[] }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon] ?? LucideIcons.Globe

  return (
    <div className={cn(
      "ff-shape-container group relative bg-[#f7f7f5] border border-[#E0E0E0] p-6",
      "transition-all duration-300 hover:border-[#ff4fd8]/50 hover:shadow-md flex flex-col justify-between"
    )}>
      {/* Top section */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="ff-shape-button w-11 h-11 flex items-center justify-center shrink-0 shadow-sm border border-[#ff4fd8]/10" style={{ background: "rgba(255, 79, 216,0.08)" }}>
            <Icon size={20} className="text-[#ff4fd8]" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#888888] px-2 py-0.5 bg-[#f7f7f5] border border-[#E0E0E0] ff-shape-container">
              Sıra: {item.order}
            </span>
            <StatusBadge published={item.isPublished} />
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <Link
            href={`/admin/hizmetler/${item.slug}`}
            className="text-sm font-extrabold text-[#333333] hover:text-[#ff4fd8] transition-colors line-clamp-1 block"
          >
            {item.title}
          </Link>
          <p className="text-[10px] font-mono text-[#888888]">
            /hizmetler/{item.slug}
          </p>
        </div>

        {/* Nested Child Services */}
        <div className="mt-5 pt-4 border-t border-[#F0F0F0] space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#999999] uppercase tracking-wider block">Alt Hizmetler ({childrenList.length})</span>
            {childrenList.length > 0 && (
              <span className="text-[9px] font-semibold text-[#ff4fd8] inline-flex items-center gap-0.5">
                <Layers size={10} />
                Hiyerarşi Aktif
              </span>
            )}
          </div>

          {childrenList.length > 0 ? (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {childrenList.map((child) => {
                const ChildIcon = (LucideIcons as unknown as Record<string, LucideIcon>)[child.icon] ?? LucideIcons.Globe
                return (
                  <div 
                    key={child.id}
                    className="flex items-center justify-between gap-4 p-2 bg-[#f7f7f5] hover:bg-[#ff4fd8]/5 border border-[#CCCCCC]/40 hover:border-[#ff4fd8]/20 transition-all ff-shape-container group/row"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <ChildIcon size={12} className="text-[#888888] shrink-0" />
                      <Link 
                        href={`/admin/hizmetler/${child.slug}`}
                        className="text-[11px] font-semibold text-[#555555] group-hover/row:text-[#ff4fd8] transition-colors truncate hover:underline"
                      >
                        {child.title}
                      </Link>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Sub Status Dot */}
                      <span 
                        className={cn("w-1.5 h-1.5 rounded-full shrink-0", child.isPublished ? "bg-green-500" : "bg-orange-400")} 
                        title={child.isPublished ? "Yayında" : "Taslak"}
                      />
                      
                      {/* Action Links */}
                      <Link 
                        href={`/admin/hizmetler/${child.slug}`}
                        className="w-5 h-5 flex items-center justify-center border border-[#CCCCCC] hover:border-[#ff4fd8] text-[#888888] hover:text-[#ff4fd8] transition-colors ff-shape-button"
                        title="Alt Hizmeti Düzenle"
                      >
                        <Pencil size={9} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-[11px] text-[#999999] italic py-2">Alt uzmanlık alanı tanımlanmamış.</p>
          )}
        </div>
      </div>

      {/* Footer statistics */}
      <div className="flex items-center justify-between pt-4 mt-6 border-t border-[#F0F0F0]">
        <span className="text-[11px] font-bold text-[#666666] flex items-center gap-1">
          <ChevronRight size={11} className="text-[#ff4fd8]" />
          {item.portfolios.length} Proje
        </span>
        
        <div className="flex gap-1.5">
          <Link
            href={`/hizmetler/${item.slug}`}
            target="_blank"
            className="ff-shape-button border border-[#E0E0E0] w-7 h-7 flex items-center justify-center hover:border-[#ff4fd8] text-[#666666] hover:text-[#ff4fd8] transition-colors bg-white shadow-sm"
            title="Public Sayfayı Gör"
          >
            <ExternalLink size={11} />
          </Link>
          <Link
            href={`/admin/hizmetler/${item.slug}`}
            className="ff-shape-button border border-[#E0E0E0] w-7 h-7 flex items-center justify-center hover:border-[#ff4fd8] text-[#666666] hover:text-[#ff4fd8] transition-colors bg-white shadow-sm"
            title="Hizmeti Düzenle"
          >
            <Pencil size={11} />
          </Link>
        </div>
      </div>
    </div>
  )
}

// Table view Row component
function ServiceRow({ item, isChild }: { item: ServiceCardItem; isChild: boolean }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon] ?? LucideIcons.Globe

  return (
    <tr className={cn(
      "border-b border-[#CCCCCC] hover:bg-[#f7f7f5] transition-colors",
      isChild ? "bg-white/40" : "bg-white font-bold"
    )}>
      {/* Name & Slug */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 overflow-hidden">
          {isChild ? (
            <span className="text-xs font-semibold text-[#ff4fd8] shrink-0 mr-1 select-none">↳</span>
          ) : null}
          <div className="truncate">
            <Link 
              href={`/admin/hizmetler/${item.slug}`} 
              className={cn(
                "hover:text-[#ff4fd8] transition-colors block truncate",
                isChild ? "text-[12px] font-semibold text-[#555555]" : "text-[13px] font-extrabold text-[#333333]"
              )}
            >
              {item.title}
            </Link>
            <span className="text-[10px] font-mono text-[#888888] font-normal block">
              /hizmetler/{item.slug}
            </span>
          </div>
        </div>
      </td>

      {/* Icon Graphic */}
      <td className="px-5 py-3.5">
        <div className={cn(
          "ff-shape-container flex items-center justify-center shadow-inner border border-[#CCCCCC]/40 bg-[#f7f7f5] shrink-0",
          isChild ? "w-6 h-6" : "w-8 h-8"
        )}>
          <Icon size={isChild ? 11 : 14} className="text-[#ff4fd8]" />
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <StatusBadge published={item.isPublished} />
      </td>

      {/* Portfolios count */}
      <td className="px-5 py-3.5 text-xs text-[#666666] font-semibold">
        {item.portfolios.length} Proje
      </td>

      {/* Order */}
      <td className="px-5 py-3.5 text-xs font-semibold text-[#666666]">
        {item.order}
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5">
        <div className="flex justify-end gap-1 shrink-0">
          <Link 
            href={`/hizmetler/${item.slug}`} 
            target="_blank" 
            className="ff-shape-button border border-[#E0E0E0] bg-white w-7 h-7 flex items-center justify-center hover:border-[#ff4fd8] text-[#666666] hover:text-[#ff4fd8] transition-colors shadow-sm"
          >
            <ExternalLink size={11} />
          </Link>
          <Link 
            href={`/admin/hizmetler/${item.slug}`} 
            className="ff-shape-button border border-[#E0E0E0] bg-white w-7 h-7 flex items-center justify-center hover:border-[#ff4fd8] text-[#666666] hover:text-[#ff4fd8] transition-colors shadow-sm"
          >
            <Pencil size={11} />
          </Link>
        </div>
      </td>
    </tr>
  )
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span className={cn(
      "ff-shape-container px-2 py-0.5 text-[9px] font-bold border inline-block select-none tracking-wider shrink-0 uppercase",
      published
        ? "text-[#10b981] border-[#10b981]/30 bg-[#10b981]/8"
        : "text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/8"
    )}>
      {published ? "Yayında" : "Taslak"}
    </span>
  )
}
