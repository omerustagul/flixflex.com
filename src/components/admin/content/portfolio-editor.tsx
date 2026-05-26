"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Save, Loader2, Send, AlertTriangle, Image as ImageIcon, Trash2, Plus } from "lucide-react"
import { slugify, cn } from "@/lib/utils"
import { Field, StringListField, inputCls } from "./array-fields"
import { MediaPicker } from "@/components/admin/media/media-picker"
import type { AdminPortfolioRecord, AdminServiceOption } from "./types"

interface PortfolioEditorProps {
  mode: "new" | "edit"
  initial?: AdminPortfolioRecord
  services: AdminServiceOption[]
}

const defaultStats = [
  { value: 920, suffix: "%", label: "ROAS Artışı", description: "Kampanya sonunda" },
  { value: 62, suffix: "%", label: "CPA Düşüşü", description: "Optimizasyon sonrası" },
]

function MediaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputCls, "flex-1")}
          placeholder="URL girin veya seçin..."
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="ff-shape-button w-9 h-9 shrink-0 border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--ff-purple)] transition-all"
          title="Medyadan Seç"
        >
          <ImageIcon size={14} />
        </button>
      </div>

      {isOpen && (
        <MediaPicker
          allowedTypes={["image", "video"]}
          onSelect={(url) => {
            onChange(url)
            setIsOpen(false)
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </Field>
  )
}

function MediaListField({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [pickerIndex, setPickerIndex] = React.useState<number | null>(null)

  function patch(index: number, value: string) {
    onChange(values.map((item, i) => (i === index ? value : item)))
  }

  return (
    <div className="space-y-2">
      <span className="text-[11px] font-bold text-[var(--foreground-muted)]">{label}</span>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={value}
              onChange={(e) => patch(index, e.target.value)}
              className={cn(inputCls, "flex-1")}
            />
            <button
              type="button"
              onClick={() => setPickerIndex(index)}
              className="ff-shape-button w-9 h-9 shrink-0 border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--ff-purple)] transition-all"
              title="Medyadan Seç"
            >
              <ImageIcon size={14} />
            </button>
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              className="ff-shape-button flex justify-center items-center w-9 h-9 border border-[var(--border)] text-[var(--foreground-muted)] hover:text-red-500"
              aria-label="Satırı sil"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className={cn(
          "ff-shape-button inline-flex items-center gap-1.5 border border-[var(--border)]",
          "px-3 py-1.5 text-[12px] text-[var(--foreground-muted)] hover:text-[var(--ff-purple)]"
        )}
      >
        <Plus size={13} />
        Ekle
      </button>

      {pickerIndex !== null && (
        <MediaPicker
          allowedTypes={["image", "video"]}
          onSelect={(url) => {
            patch(pickerIndex, url)
            setPickerIndex(null)
          }}
          onClose={() => setPickerIndex(null)}
        />
      )}
    </div>
  )
}

export function PortfolioEditor({ mode, initial, services }: PortfolioEditorProps) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [slugDirty, setSlugDirty] = React.useState(Boolean(initial?.slug))
  const [form, setForm] = React.useState(() => ({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    client: initial?.client ?? "",
    clientLogo: initial?.clientLogo ?? "",
    category: initial?.category ?? "Performance",
    description: initial?.description ?? "",
    content: initial?.content ?? "",
    coverImage: initial?.coverImage ?? "",
    images: initial?.images ?? [],
    tags: initial?.tags ?? [],
    year: initial?.year ?? new Date().getFullYear(),
    gradient: initial?.gradient ?? "from-[#0D0D1A] via-[#1A1A2E] to-[#16213E]",
    accentColor: initial?.accentColor ?? "var(--ff-purple)",
    tall: initial?.tall ?? false,
    narrativeParagraphs: Array.isArray(initial?.narrativeParagraphs)
      ? initial?.narrativeParagraphs as string[]
      : ["", "", ""],
    sidebarItems: Array.isArray(initial?.sidebarItems)
      ? initial?.sidebarItems as { heading: string; body: string }[]
      : [
        { heading: "Zorluk", body: "" },
        { heading: "Yaklaşım", body: "" },
        { heading: "Sonuç", body: "" },
      ],
    resultStats: Array.isArray(initial?.resultStats)
      ? initial?.resultStats as typeof defaultStats
      : defaultStats,
    serviceIds: initial?.services?.map((service) => service.id) ?? [],
    isPublished: initial?.isPublished ?? false,
    order: initial?.order ?? 0,
  }))

  React.useEffect(() => {
    if (mode === "new" && form.title && !slugDirty) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title) }))
    }
  }, [form.title, mode, slugDirty])

  function patch(patchValue: Partial<typeof form>) {
    setForm((prev) => ({ ...prev, ...patchValue }))
  }

  async function save(publish?: boolean) {
    setBusy(true)
    setError(null)
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        client: form.client.trim(),
        clientLogo: form.clientLogo.trim() || null,
        description: form.description.trim(),
        coverImage: form.coverImage.trim(),
        images: form.images.map((item) => item.trim()).filter(Boolean),
        tags: form.tags.map((item) => item.trim()).filter(Boolean),
        narrativeParagraphs: form.narrativeParagraphs.map((item) => item.trim()).filter(Boolean),
        sidebarItems: form.sidebarItems.filter((item) => item.heading.trim() && item.body.trim()),
        resultStats: form.resultStats.filter((item) => item.label.trim()),
        isPublished: publish ?? form.isPublished,
      }
      const res = await fetch(mode === "new" ? "/api/portfolio" : `/api/portfolio/${initial!.id}`, {
        method: mode === "new" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Kayıt başarısız")
      router.push("/admin/portfolyo")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="px-6 md:px-10 py-8 space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[var(--foreground)]">
            {mode === "new" ? "Yeni Portfolyo" : "Portfolyo Düzenle"}
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Detay sayfasındaki tüm metin ve sonuç alanlarını buradan yönetin.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="ff-btn ff-btn-outline h-9 font-semibold text-xs" disabled={busy} onClick={() => save(false)}>
            {busy ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            Kaydet
          </button>
          <button className="ff-btn ff-btn-primary h-9 font-semibold text-xs" disabled={busy} onClick={() => save(true)}>
            {busy ? <Send className="animate-spin" size={14} /> : <Send size={14} />}
            Yayınla
          </button>
        </div>
      </div>

      {error && (
        <div className="border border-red-500/40 bg-red-500/10 p-3 text-red-500 text-[12px] flex gap-2">
          <AlertTriangle size={14} />
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Field label="Proje başlığı">
            <input className={inputCls} value={form.title} onChange={(e) => patch({ title: e.target.value })} />
          </Field>
          <Field label="Slug">
            <input className={inputCls} value={form.slug} onChange={(e) => { setSlugDirty(true); patch({ slug: e.target.value }) }} />
          </Field>
          <div className="grid md:grid-cols-4 gap-3">
            <Field label="Müşteri">
              <input className={inputCls} value={form.client} onChange={(e) => patch({ client: e.target.value })} />
            </Field>
            <MediaField label="Müşteri Logosu" value={form.clientLogo} onChange={(v) => patch({ clientLogo: v })} />
            <Field label="Kategori">
              <input className={inputCls} value={form.category} onChange={(e) => patch({ category: e.target.value })} />
            </Field>
            <Field label="Yıl">
              <input type="number" className={inputCls} value={form.year} onChange={(e) => patch({ year: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Kısa açıklama">
            <textarea rows={3} className={inputCls} value={form.description} onChange={(e) => patch({ description: e.target.value })} />
          </Field>
          <StringListField label="Proje hikayesi paragrafları" values={form.narrativeParagraphs} onChange={(values) => patch({ narrativeParagraphs: values })} />
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[var(--foreground-muted)]">Zorluk / Yaklaşım / Sonuç</span>
            {form.sidebarItems.map((item, index) => (
              <div key={index} className="grid md:grid-cols-[160px_1fr] gap-2">
                <input className={inputCls} value={item.heading} onChange={(e) => patch({ sidebarItems: form.sidebarItems.map((x, i) => i === index ? { ...x, heading: e.target.value } : x) })} />
                <input className={inputCls} value={item.body} onChange={(e) => patch({ sidebarItems: form.sidebarItems.map((x, i) => i === index ? { ...x, body: e.target.value } : x) })} />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[var(--foreground-muted)]">Sonuç metrikleri</span>
            {form.resultStats.map((item, index) => (
              <div key={index} className="grid md:grid-cols-[90px_80px_1fr_1fr] gap-2">
                <input type="number" className={inputCls} value={item.value} onChange={(e) => patch({ resultStats: form.resultStats.map((x, i) => i === index ? { ...x, value: Number(e.target.value) } : x) })} />
                <input className={inputCls} value={item.suffix ?? ""} onChange={(e) => patch({ resultStats: form.resultStats.map((x, i) => i === index ? { ...x, suffix: e.target.value } : x) })} />
                <input className={inputCls} value={item.label} onChange={(e) => patch({ resultStats: form.resultStats.map((x, i) => i === index ? { ...x, label: e.target.value } : x) })} />
                <input className={inputCls} value={item.description ?? ""} onChange={(e) => patch({ resultStats: form.resultStats.map((x, i) => i === index ? { ...x, description: e.target.value } : x) })} />
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <MediaField label="Kapak görsel URL" value={form.coverImage} onChange={(v) => patch({ coverImage: v })} />
          <MediaListField label="Galeri görselleri" values={form.images} onChange={(values) => patch({ images: values })} />
          <StringListField label="Etiketler" values={form.tags} onChange={(values) => patch({ tags: values })} />
          <Field label="Gradient class">
            <input className={inputCls} value={form.gradient} onChange={(e) => patch({ gradient: e.target.value })} />
          </Field>
          <Field label="Vurgu rengi">
            <input className={inputCls} value={form.accentColor} onChange={(e) => patch({ accentColor: e.target.value })} />
          </Field>
          <Field label="Sıra">
            <input type="number" className={inputCls} value={form.order} onChange={(e) => patch({ order: Number(e.target.value) })} />
          </Field>
          <label className="flex items-center gap-2 text-[13px] text-[var(--foreground-muted)]">
            <input type="checkbox" checked={form.tall} onChange={(e) => patch({ tall: e.target.checked })} />
            Grid'de uzun kart
          </label>
          <label className="flex items-center gap-2 text-[13px] text-[var(--foreground-muted)]">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => patch({ isPublished: e.target.checked })} />
            Yayında
          </label>
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[var(--foreground-muted)]">Bağlı hizmetler</span>
            {services.map((service) => (
              <label key={service.id} className="flex items-center gap-2 text-[13px]">
                <input
                  type="checkbox"
                  checked={form.serviceIds.includes(service.id)}
                  onChange={(e) => patch({
                    serviceIds: e.target.checked
                      ? [...form.serviceIds, service.id]
                      : form.serviceIds.filter((id) => id !== service.id),
                  })}
                />
                {service.title}
              </label>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
