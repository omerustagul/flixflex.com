"use client"

import * as React from "react"
import { FFButton, FFInput } from "@/components/ui"
import {
  Plug,
  Save,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  BarChart3,
  Mail,
  Share2,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface IntegrationsData {
  // AI
  anthropicKey: string
  openaiKey: string
  geminiKey: string
  defaultModel: string

  // Analytics
  gaMeasurementId: string
  gtmId: string
  pixelId: string

  // Marketing & Mail
  resendApiKey: string
  mailchimpKey: string
}

export function IntegrationForm({ initialData }: { initialData: IntegrationsData }) {
  const [data, setData] = React.useState<IntegrationsData>(initialData)
  const [loading, setLoading] = React.useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/settings/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Ayarlar kaydedilemedi.")

      toast.success("Entegrasyon ayarları başarıyla kaydedildi.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-16 pb-20">
      {/* ── SECTION: AI SERVISLERI ────────────────────────────────────────── */}
      <section className="space-y-6">
        <header className="flex items-center gap-3 pb-2 border-b border-[var(--border)]">
          <Sparkles size={20} className="text-[#A134FF]" />
          <h2 className="font-display text-xl font-bold text-[var(--foreground)]">Yapay Zeka (AI) Servisleri</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Anthropic */}
          <div className="ff-shape-container p-6 bg-[var(--background)] border border-[var(--border)] flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
              <div className="ff-shape-button w-10 h-10 flex items-center justify-center bg-[#A134FF]/10 text-[#A134FF] border border-[#A134FF]/20">
                <Plug size={20} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[var(--foreground)]">Anthropic (Claude)</h3>
                <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-widest font-semibold">Ana Sağlayıcı</p>
              </div>
              {data.anthropicKey && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
            </div>
            <FFInput
              label="Anthropic API Key"
              type="password"
              placeholder="sk-ant-..."
              value={data.anthropicKey}
              onChange={(e) => setData({ ...data, anthropicKey: e.target.value })}
            />
          </div>

          {/* OpenAI */}
          <div className="ff-shape-container p-6 bg-[var(--background)] border border-[var(--border)] flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
              <div className="ff-shape-button w-10 h-10 flex items-center justify-center bg-green-500/10 text-green-500 border border-green-500/20">
                <Plug size={20} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[var(--foreground)]">OpenAI (GPT)</h3>
                <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-widest font-semibold">Alternatif</p>
              </div>
              {data.openaiKey && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
            </div>
            <FFInput
              label="OpenAI API Key"
              type="password"
              placeholder="sk-..."
              value={data.openaiKey}
              onChange={(e) => setData({ ...data, openaiKey: e.target.value })}
            />
          </div>

          {/* Gemini */}
          <div className="ff-shape-container p-6 bg-[var(--background)] border border-[var(--border)] flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
              <div className="ff-shape-button w-10 h-10 flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Plug size={20} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[var(--foreground)]">Google Gemini</h3>
                <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-widest font-semibold">Multimodal</p>
              </div>
              {data.geminiKey && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
            </div>
            <FFInput
              label="Google AI Key"
              type="password"
              placeholder="AIza..."
              value={data.geminiKey}
              onChange={(e) => setData({ ...data, geminiKey: e.target.value })}
            />
          </div>

          {/* Default Model */}
          <div className="ff-shape-container p-6 bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
              <div className="ff-shape-button w-10 h-10 flex items-center justify-center bg-[var(--foreground)]/5 text-[var(--foreground)] border border-[var(--border)]">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[var(--foreground)]">Varsayılan Model</h3>
                <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-widest font-semibold">Global Seçim</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--foreground-muted)]">Model Seçimi</label>
              <select
                value={data.defaultModel}
                onChange={(e) => setData({ ...data, defaultModel: e.target.value })}
                className={cn(
                  "ff-shape-button w-full bg-[var(--background)] border border-[var(--border)]",
                  "px-4 py-3 text-sm text-[var(--foreground)] outline-none",
                  "focus:border-[#A134FF]"
                )}
              >
                <optgroup label="Anthropic">
                  <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
                  <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                  <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                </optgroup>
                <optgroup label="OpenAI">
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </optgroup>
                <optgroup label="Google">
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: ANALIZ & IZLEME ──────────────────────────────────────── */}
      <section className="space-y-6">
        <header className="flex items-center gap-3 pb-2 border-b border-[var(--border)]">
          <BarChart3 size={20} className="text-blue-500" />
          <h2 className="font-display text-xl font-bold text-[var(--foreground)]">Analiz & İzleme</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="ff-shape-container p-6 bg-[var(--background)] border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <Globe size={18} className="text-orange-500" />
              <h3 className="font-display text-sm font-bold text-[var(--foreground)]">Google Analytics</h3>
            </div>
            <FFInput
              label="Measurement ID"
              placeholder="G-XXXXXXXXXX"
              value={data.gaMeasurementId}
              onChange={(e) => setData({ ...data, gaMeasurementId: e.target.value })}
            />
          </div>

          <div className="ff-shape-container p-6 bg-[var(--background)] border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <Globe size={18} className="text-blue-600" />
              <h3 className="font-display text-sm font-bold text-[var(--foreground)]">Google Tag Manager</h3>
            </div>
            <FFInput
              label="GTM Container ID"
              placeholder="GTM-XXXXXXX"
              value={data.gtmId}
              onChange={(e) => setData({ ...data, gtmId: e.target.value })}
            />
          </div>

          <div className="ff-shape-container p-6 bg-[var(--background)] border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <Share2 size={18} className="text-blue-500" />
              <h3 className="font-display text-sm font-bold text-[var(--foreground)]">Meta Pixel</h3>
            </div>
            <FFInput
              label="Pixel ID"
              placeholder="1234567890..."
              value={data.pixelId}
              onChange={(e) => setData({ ...data, pixelId: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION: PAZARLAMA & E-POSTA ───────────────────────────────────── */}
      <section className="space-y-6">
        <header className="flex items-center gap-3 pb-2 border-b border-[var(--border)]">
          <Mail size={20} className="text-orange-500" />
          <h2 className="font-display text-xl font-bold text-[var(--foreground)]">Pazarlama & E-Posta</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="ff-shape-container p-6 bg-[var(--background)] border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <Mail size={18} className="text-green-500" />
              <h3 className="font-display text-sm font-bold text-[var(--foreground)]">Resend</h3>
              {data.resendApiKey && <CheckCircle2 size={14} className="ml-auto text-green-500" />}
            </div>
            <FFInput
              label="Resend API Key"
              type="password"
              placeholder="re_..."
              value={data.resendApiKey}
              onChange={(e) => setData({ ...data, resendApiKey: e.target.value })}
              hint="Sistem e-postaları için ana sağlayıcı."
            />
          </div>

          <div className="ff-shape-container p-6 bg-[var(--background)] border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <Share2 size={18} className="text-[#A134FF]" />
              <h3 className="font-display text-sm font-bold text-[var(--foreground)]">Mailchimp</h3>
            </div>
            <FFInput
              label="Mailchimp API Key"
              type="password"
              placeholder="API Key"
              value={data.mailchimpKey}
              onChange={(e) => setData({ ...data, mailchimpKey: e.target.value })}
              hint="Bülten ve kampanya yönetimi için."
            />
          </div>
        </div>
      </section>

      {/* ── Footer Actions ───────────────────── */}
      <div className="ff-shape-container sticky bottom-4 z-20 flex items-center justify-end gap-4 p-4 bg-[var(--background)]/80 backdrop-blur-md border border-[var(--border)] shadow-xl">
        <p className="mr-auto text-[11px] text-[var(--foreground-muted)] hidden md:block italic">
          * Değişiklikleri kaydetmeyi unutmayın.
        </p>
        <FFButton
          variant="ghost"
          disabled={loading}
          onClick={() => setData(initialData)}
        >
          Sıfırla
        </FFButton>
        <FFButton
          onClick={handleSave}
          disabled={loading}
          leftIcon={loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
        >
          {loading ? "Kaydediliyor..." : "Tüm Entegrasyonları Kaydet"}
        </FFButton>
      </div>
    </div>
  )
}
