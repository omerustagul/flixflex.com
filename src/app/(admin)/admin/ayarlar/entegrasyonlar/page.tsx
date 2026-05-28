import type { Metadata } from "next"
import { IntegrationForm } from "@/components/admin/settings/integration-form"
import { getSetting } from "@/lib/settings"

export const metadata: Metadata = {
  title: "Entegrasyonlar",
}

export default async function EntegrasyonlarPage() {
  const initialData = {
    // AI
    anthropicKey: (await getSetting("ai.provider.anthropic.key", "")) ?? "",
    openaiKey: (await getSetting("ai.provider.openai.key", "")) ?? "",
    geminiKey: (await getSetting("ai.provider.gemini.key", "")) ?? "",
    defaultModel: (await getSetting("ai.default.model", "claude-3-5-sonnet-20240620")) ?? "claude-3-5-sonnet-20240620",

    // Analytics
    gaMeasurementId: (await getSetting("analytics.google.ga4", "")) ?? "",
    gtmId: (await getSetting("analytics.google.gtm", "")) ?? "",
    pixelId: (await getSetting("analytics.meta.pixel", "")) ?? "",

    // Marketing
    resendApiKey: (await getSetting("mail.resend.key", "")) ?? "",
    mailchimpKey: (await getSetting("mail.mailchimp.key", "")) ?? "",
  }

  return (
    <div className="px-6 md:px-10 py-8 md:py-12">
      <header className="mb-10">
        <p className="text-[11px] font-semibold text-[#FF4FD8] mb-3">
          Ayarlar
        </p>
        <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-[#333333] mb-3">
          Sistem <span className="text-[#FF4FD8]">Entegrasyonları</span>
        </h1>
        <p className="text-[#666666] text-sm max-w-2xl leading-relaxed">
          Platformun dış dünya ile bağlantılarını buradan yönetin.
          AI modelleri, pazarlama araçları ve analiz servislerini tek bir merkezden yapılandırın.
        </p>
      </header>

      <div className="">
        <IntegrationForm initialData={initialData} />
      </div>
    </div>
  )
}
