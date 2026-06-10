"use client"

// ═══════════════════════════════════════════════════════════
// FlixFlex — Manual blog post editor
// Used by /admin/blog/yeni and /admin/blog/[slug]
// ═══════════════════════════════════════════════════════════

import * as React from "react"
import { useRouter } from "next/navigation"
import { Save, Eye, AlertTriangle, Loader2 } from "@/lib/icons"
import { cn, slugify } from "@/lib/utils"
import { FFButton } from "@/components/ui"
import { FFSelect, FFSelectItem } from "@/components/ui/ff-select"
import { MarkdownRenderer } from "@/components/public/blog/markdown-renderer"
import type { BlogPostRecord } from "@/lib/ai/blog-store"

const CATEGORIES = ["Strateji", "Yaratıcılık", "Performans", "SEO", "Sosyal Medya", "Marka"]
const TEMPLATES = ["classic", "editorial", "visual"] as const

const GRADIENTS = [
  "from-[#FF4FD8]/30 via-[#6A0FCC]/20 to-[#0D0D0D]",
  "from-[#1A3A6B]/40 via-[#0D2447]/30 to-[#0D0D0D]",
  "from-[#FF6B35]/25 via-[#C23616]/20 to-[#0D0D0D]",
  "from-[#16A34A]/25 via-[#0D6931]/20 to-[#0D0D0D]",
  "from-[#D97706]/25 via-[#92400E]/20 to-[#0D0D0D]",
  "from-[#0EA5E9]/25 via-[#0369A1]/20 to-[#0D0D0D]",
  "from-[#EC4899]/25 via-[#9D174D]/20 to-[#0D0D0D]",
  "from-[#7C3AED]/30 via-[#4C1D95]/20 to-[#0D0D0D]",
  "from-[#2563EB]/25 via-[#1D4ED8]/20 to-[#0D0D0D]",
  "from-[#DC2626]/20 via-[#7F1D1D]/20 to-[#0D0D0D]",
]

interface BlogEditorProps {
  mode: "new" | "edit"
  initial?: BlogPostRecord
}

interface FormState {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string
  template: typeof TEMPLATES[number]
  coverGradient: string
  status: "draft" | "published"
}

export function BlogEditor({ mode, initial }: BlogEditorProps) {
  const router = useRouter()

  const [form, setForm] = React.useState<FormState>(() => ({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    category: initial?.category ?? "Strateji",
    tags: (initial?.tags ?? []).join(", "),
    template: initial?.template ?? "classic",
    coverGradient: initial?.coverGradient ?? GRADIENTS[0],
    status: initial?.status ?? "draft",
  }))
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [showPreview, setShowPreview] = React.useState(false)
  const [slugDirty, setSlugDirty] = React.useState(false)

  // Auto-slug when title changes and we're in new mode, unless user has edited slug manually
  React.useEffect(() => {
    if (mode === "new" && form.title && !slugDirty) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- auto-slug derived state — needs UX review before refactor
      setForm((f) => ({ ...f, slug: slugify(f.title) }))
    }
  }, [form.title, slugDirty, mode])

  function patch(p: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...p }))
  }

  async function save(nextStatus?: "draft" | "published") {
    setBusy(true); setError(null)
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        excerpt: form.excerpt.trim() || undefined,
        content: form.content,
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        template: form.template,
        coverGradient: form.coverGradient,
        status: nextStatus ?? form.status,
      }

      const url = mode === "new" ? "/api/blog" : `/api/blog/${initial!.slug}`
      const method = mode === "new" ? "POST" : "PATCH"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Kayıt başarısız")

      router.push("/admin/blog")
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="px-6 md:px-10 pb-12 pt-2">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
            {mode === "new" ? "Yeni Yazı" : "Yazıyı Düzenle"}
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Manuel editör — markdown destekli
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FFButton
            variant="outline"
            leftIcon={<Eye size={13} />}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "Editör" : "Önizleme"}
          </FFButton>
          <FFButton
            variant="outline"
            onClick={() => save("draft")}
            disabled={busy || !form.title || !form.content}
          >
            Kaydet
          </FFButton>
          <FFButton
            leftIcon={busy ? <Loader2 className="animate-spin" size={14} /> : <Save size={13} />}
            onClick={() => save("published")}
            disabled={busy || !form.title || !form.content}
          >
            Yayınla
          </FFButton>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/40">
          <AlertTriangle size={14} className="text-red-500 mt-0.5" />
          <p className="text-[12px] text-red-500">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">
          <Field label="Başlık">
            <input
              value={form.title}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="Yazının başlığı"
              className={inputCls}
            />
          </Field>

          <Field label="Slug">
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugDirty(true)
                patch({ slug: e.target.value })
              }}
              placeholder="yazinin-slug-u"
              className={cn(inputCls, "font-mono text-[12px]")}
            />
          </Field>

          <Field label="Özet (excerpt)">
            <textarea
              value={form.excerpt}
              onChange={(e) => patch({ excerpt: e.target.value })}
              rows={3}
              placeholder="Yazının kısa özeti (otomatik üretilebilir)"
              className={cn(inputCls, "resize-y min-h-[80px]")}
            />
          </Field>

          <Field label="İçerik (markdown)">
            {showPreview ? (
              <div className="bg-[var(--surface)] border border-[var(--border)] p-6 min-h-[500px] max-h-[700px] overflow-y-auto">
                {form.content ? (
                  <MarkdownRenderer content={form.content} />
                ) : (
                  <p className="text-[var(--foreground-faint)]">İçerik boş.</p>
                )}
              </div>
            ) : (
              <textarea
                value={form.content}
                onChange={(e) => patch({ content: e.target.value })}
                rows={24}
                placeholder={`## Başlık\n\nParagraf...\n\n- Madde 1\n- Madde 2\n\n> Alıntı`}
                className={cn(inputCls, "resize-y min-h-[500px] font-mono text-[13px] leading-relaxed")}
              />
            )}
          </Field>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Field label="Kategori">
            <FFSelect
              value={form.category}
              onValueChange={(v) => patch({ category: v })}
              ariaLabel="Kategori"
            >
              {CATEGORIES.map((c) => (
                <FFSelectItem key={c} value={c}>
                  {c}
                </FFSelectItem>
              ))}
            </FFSelect>
          </Field>

          <Field label="Şablon">
            <FFSelect
              value={form.template}
              onValueChange={(v) =>
                patch({ template: v as typeof TEMPLATES[number] })
              }
              ariaLabel="Şablon"
            >
              {TEMPLATES.map((t) => (
                <FFSelectItem
                  key={t}
                  value={t}
                  hint={
                    t === "classic"
                      ? "Tek sütun · tipografi odaklı"
                      : t === "editorial"
                        ? "Yan panel · TOC"
                        : "Full-width görseller"
                  }
                >
                  {t === "classic"
                    ? "Klasik"
                    : t === "editorial"
                      ? "Editöryal"
                      : "Görsel Ağırlıklı"}
                </FFSelectItem>
              ))}
            </FFSelect>
          </Field>

          <Field label="Etiketler (virgülle)">
            <input
              value={form.tags}
              onChange={(e) => patch({ tags: e.target.value })}
              placeholder="seo, içerik, strateji"
              className={inputCls}
            />
          </Field>

          <Field label="Kapak Gradient'i">
            <div className="grid grid-cols-5 gap-2">
              {GRADIENTS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => patch({ coverGradient: g })}
                  className={cn(
                    "aspect-square bg-gradient-to-br border transition-all",
                    g,
                    form.coverGradient === g
                      ? "border-[var(--ff-purple)] ring-2 ring-[var(--ff-purple)]/40"
                      : "border-[var(--border)] hover:border-[var(--ff-purple)/40]"
                  )}
                  aria-label="Gradient seç"
                />
              ))}
            </div>
          </Field>

          <Field label="Durum">
            <div className="flex items-center gap-2">
              {(["draft", "published"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => patch({ status: s })}
                  className={cn(
                    "flex-1 px-3 py-2 text-[11px] uppercase tracking-[0.08em] border transition-colors",
                    form.status === s
                      ? "bg-[var(--ff-purple)] text-white border-[var(--ff-purple)]"
                      : "bg-transparent text-[var(--foreground-muted)] border-[var(--border)] hover:border-[var(--ff-purple)]"
                  )}
                >
                  {s === "draft" ? "Taslak" : "Yayında"}
                </button>
              ))}
            </div>
          </Field>
        </aside>
      </div>
    </div>
  )
}

// ── Tiny presentational helpers ────────────────────────────
const inputCls = cn(
  "ff-shape-button w-full h-10 bg-[var(--surface)] border border-[var(--border)]",
  "px-3 py-2 text-[13px] text-[var(--foreground)] outline-none",
  "placeholder:text-[var(--foreground-faint)]",
  "focus:border-[var(--ff-purple)] focus:shadow-[0_0_0_3px_var(--ff-purple)]/12"
)

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--foreground-muted)] mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  )
}
