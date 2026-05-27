"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Save, Loader2, Send, AlertTriangle } from "lucide-react"
import { slugify } from "@/lib/utils"
import { Field, StringListField, inputCls } from "./array-fields"
import type { AdminServiceRecord } from "./types"

const ICONS = ["BarChart3", "Palette", "MessageSquare", "Fingerprint", "Clapperboard", "Globe"]

type ServiceOption = { id: string; title: string; slug: string }

interface ServiceEditorProps {
  mode: "new" | "edit"
  initial?: AdminServiceRecord
  allServices: ServiceOption[]
}

export function ServiceEditor({ mode, initial, allServices }: ServiceEditorProps) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [slugDirty, setSlugDirty] = React.useState(Boolean(initial?.slug))
  const [form, setForm] = React.useState(() => ({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    body: initial?.body ?? "",
    icon: initial?.icon ?? "Globe",
    features: initial?.features ?? [""],
    processSteps: Array.isArray(initial?.processSteps)
      ? initial?.processSteps as { title: string; description: string }[]
      : [
        { title: "Keşif", description: "" },
        { title: "Strateji", description: "" },
        { title: "Uygulama", description: "" },
      ],
    deliverables: initial?.deliverables ?? [""],
    isPublished: initial?.isPublished ?? false,
    order: initial?.order ?? 0,
    metaTitle: initial?.metaTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    parentId: initial?.parentId ?? "",
  }))

  const availableParents = React.useMemo(() => {
    return allServices.filter((s) => s.id !== initial?.id)
  }, [allServices, initial?.id])

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
        description: form.description.trim(),
        body: form.body.trim(),
        features: form.features.map((item) => item.trim()).filter(Boolean),
        deliverables: form.deliverables.map((item) => item.trim()).filter(Boolean),
        processSteps: form.processSteps.filter((item) => item.title.trim() && item.description.trim()),
        isPublished: publish ?? form.isPublished,
        metaTitle: form.metaTitle.trim() || undefined,
        metaDescription: form.metaDescription.trim() || undefined,
        parentId: form.parentId || null,
      }
      const res = await fetch(mode === "new" ? "/api/services" : `/api/services/${initial!.id}`, {
        method: mode === "new" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Kayıt başarısız")
      router.push("/admin/hizmetler")
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
          <h1 className="font-display text-2xl font-extrabold text-[#333333] mb-2">
            {mode === "new" ? "Yeni Hizmet" : "Hizmet Düzenle"}
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Hizmet listesi, detay sayfası, süreç ve teslimatlar buradan beslenir.
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
          <Field label="Hizmet başlığı">
            <input className={inputCls} value={form.title} onChange={(e) => patch({ title: e.target.value })} />
          </Field>
          <Field label="Slug">
            <input className={inputCls} value={form.slug} onChange={(e) => { setSlugDirty(true); patch({ slug: e.target.value }) }} />
          </Field>
          <Field label="Kısa açıklama">
            <textarea rows={3} className={inputCls} value={form.description} onChange={(e) => patch({ description: e.target.value })} />
          </Field>
          <Field label="Detay hero metni">
            <textarea rows={6} className={inputCls} value={form.body} onChange={(e) => patch({ body: e.target.value })} />
          </Field>
          <StringListField label="Kart özellikleri" values={form.features} onChange={(values) => patch({ features: values })} />
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[var(--foreground-muted)]">Süreç adımları</span>
            {form.processSteps.map((step, index) => (
              <div key={index} className="grid md:grid-cols-[180px_1fr] gap-2">
                <input className={inputCls} value={step.title} onChange={(e) => patch({ processSteps: form.processSteps.map((x, i) => i === index ? { ...x, title: e.target.value } : x) })} />
                <input className={inputCls} value={step.description} onChange={(e) => patch({ processSteps: form.processSteps.map((x, i) => i === index ? { ...x, description: e.target.value } : x) })} />
              </div>
            ))}
          </div>
          <StringListField label="Teslim edilenler" values={form.deliverables} onChange={(values) => patch({ deliverables: values })} />
        </div>

        <aside className="space-y-4">
          <Field label="Üst Hizmet">
            <select
              className={inputCls}
              value={form.parentId}
              onChange={(e) => patch({ parentId: e.target.value })}
            >
              <option value="">— Yok (Ana Hizmet) —</option>
              {availableParents.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </Field>
          <Field label="İkon">
            <select className={inputCls} value={form.icon} onChange={(e) => patch({ icon: e.target.value })}>
              {ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </Field>
          <Field label="Sıra">
            <input type="number" className={inputCls} value={form.order} onChange={(e) => patch({ order: Number(e.target.value) })} />
          </Field>
          <label className="flex items-center gap-2 text-[13px] text-[var(--foreground-muted)]">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => patch({ isPublished: e.target.checked })} />
            Yayında
          </label>
          <Field label="Meta başlık">
            <input className={inputCls} value={form.metaTitle} onChange={(e) => patch({ metaTitle: e.target.value })} />
          </Field>
          <Field label="Meta açıklama">
            <textarea rows={3} className={inputCls} value={form.metaDescription} onChange={(e) => patch({ metaDescription: e.target.value })} />
          </Field>
        </aside>
      </div>
    </div>
  )
}
