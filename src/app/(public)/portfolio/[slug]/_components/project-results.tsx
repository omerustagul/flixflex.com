"use client"

import { cn } from "@/lib/utils"
import { ResultCounter } from "@/components/public/portfolio/result-counter"
import type { PortfolioItem } from "@/components/public"

interface ProjectResultsProps {
  project: PortfolioItem
}

interface StatItem {
  value: number
  suffix?: string
  prefix?: string
  label: string
  description?: string
}

function getResultStats(project: PortfolioItem): StatItem[] {
  if (project.resultStats?.length) return project.resultStats

  const statsMap: Record<string, StatItem[]> = {
    Branding: [
      {
        value: 340,
        suffix: "%",
        label: "Marka Hatırlanırlığı",
        description: "Kampanya öncesi/sonrası araştırma",
      },
      {
        value: 2,
        suffix: ".1M",
        label: "Organik Erişim",
        description: "Lansman ayında",
      },
      {
        value: 89,
        suffix: "%",
        label: "Görsel Tutarlılık",
        description: "Tüm temas noktalarında",
      },
      {
        value: 50,
        suffix: "K+",
        label: "Yeni Takipçi",
        description: "İlk 30 gün",
      },
    ],
    Performance: [
      {
        value: 920,
        suffix: "%",
        label: "ROAS Artışı",
        description: "Kampanya sonunda elde edilen ROAS",
      },
      {
        value: 62,
        suffix: "%",
        label: "CPA Düşüşü",
        description: "Yeniden yapılandırma sonrası",
      },
      {
        value: 2,
        suffix: ".3M",
        label: "Toplam Erişim",
        description: "90 günlük kampanya sürecinde",
      },
      {
        value: 38,
        suffix: "%",
        label: "Dönüşüm Artışı",
        description: "Üçüncü ay ortalaması",
      },
    ],
    Web: [
      {
        value: 98,
        suffix: "",
        label: "Lighthouse Skoru",
        description: "Performans kategorisi",
      },
      {
        value: 38,
        suffix: "%",
        label: "Dönüşüm Artışı",
        description: "Lansman sonrası ilk 60 gün",
      },
      {
        value: 3,
        suffix: ".2s",
        label: "Daha Az Yüklenme",
        description: "Önceki site ile karşılaştırma",
      },
      {
        value: 180,
        suffix: "K",
        label: "Aylık Ziyaretçi",
        description: "Organik trafik hedefi aşıldı",
      },
    ],
    Content: [
      {
        value: 180,
        suffix: "K",
        label: "Organik Erişim",
        description: "Aylık ortalama",
      },
      {
        value: 21,
        suffix: "",
        label: "Haftalık İçerik",
        description: "Tüm platformlarda toplam",
      },
      {
        value: 340,
        suffix: "%",
        label: "Etkileşim Artışı",
        description: "Strateji öncesi ile karşılaştırma",
      },
      {
        value: 12,
        suffix: " Ay",
        label: "Kesintisiz Operasyon",
        description: "Sıfır gecikme ile teslim",
      },
    ],
  }

  return statsMap[project.category] ?? statsMap["Branding"]
}

export function ProjectResults({ project }: ProjectResultsProps) {
  const stats = getResultStats(project)

  return (
    <section
      className={cn(
        "relative bg-[var(--background)] text-[var(--foreground)]",
        "py-20 md:py-28 overflow-hidden"
      )}
    >
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
        <ResultCounter stats={stats} />
      </div>
    </section>
  )
}
