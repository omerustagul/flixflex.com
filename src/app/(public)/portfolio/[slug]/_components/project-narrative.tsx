"use client"

import { motion } from "framer-motion"
import { staggerContainer, fadeInRight, fadeInUp } from "@/lib/animations"
import { cn } from "@/lib/utils"
import type { PortfolioItem } from "@/components/public"

interface ProjectNarrativeProps {
  project: PortfolioItem
}

// Narrative copy generated from category + description context
function getNarrative(project: PortfolioItem): {
  paragraphs: string[]
  sidebarItems: { heading: string; body: string }[]
} {
  if (project.narrativeParagraphs?.length || project.sidebarItems?.length) {
    return {
      paragraphs: project.narrativeParagraphs?.length
        ? project.narrativeParagraphs
        : [project.description],
      sidebarItems: project.sidebarItems?.length
        ? project.sidebarItems
        : [
          {
            heading: "Özet",
            body: project.description,
          },
        ],
    }
  }

  const { category, client, description } = project

  const narratives: Record<string, { paragraphs: string[]; sidebarItems: { heading: string; body: string }[] }> = {
    Branding: {
      paragraphs: [
        `${client} ile yola çıkarken önce markanın DNA'sını anlamaya çalıştık. Mevcut kimlik tutarsız, hedef kitleyle duygusal bağ kuramayan bir yapıya sahipti. Rakip analizleri ve derinlemesine müşteri mülakatları ardından pozisyonlama stratejisini sıfırdan inşa ettik.`,
        `Görsel kimlik sürecinde onlarca konsept ürettik; her birini marka değerleri, hedef kitle psikolojisi ve sektör dinamikleriyle filtreledik. Sonunda markanın özünü en sade hâliyle ifade eden sistem ortaya çıktı: net, akılda kalıcı, ölçeklenebilir.`,
        `Marka rehberi teslimi sonrasında ${client} ekibi ilk üç ayda tüm temas noktalarını yeni kimlikle güncelleyerek pazarda tutarlı bir ses elde etti. Bu proje, FlixFlex'in bütünsel marka dönüşüm kapasitesinin somut bir kanıtı oldu.`,
      ],
      sidebarItems: [
        {
          heading: "Zorluk",
          body: "Marka kimliğinin hedef kitleyle rezonans kuramaması ve tutarsız görsel dil.",
        },
        {
          heading: "Yaklaşım",
          body: "Pazar araştırması, rakip analizi ve co-creation atölyeleriyle kök nedenler tespit edildi; yeni kimlik strateji odaklı inşa edildi.",
        },
        {
          heading: "Sonuç",
          body: "Tutarlı marka dili, artan marka hatırlanırlığı ve hedef kitleyle güçlü duygusal bağ.",
        },
      ],
    },
    Performance: {
      paragraphs: [
        `${client} projesi bize ulaştığında reklam harcamalarının verimliliği kritik düzeyin altındaydı. Hesap yapısı dağınık, kitle segmentasyonu yüzeysel, yaratıcı varlıklar performans verisiyle hiç sorgulanmamıştı. İlk iki haftayı derin bir audit'e ayırdık.`,
        `Yeniden yapılandırma sürecinde kampanya mimarisini sıfırdan kurguladık: her funnel aşaması için farklı kitle sinyalleri, ayrı bütçe mantığı ve mesaj hiyerarşisi. A/B testlerini sistematik hâle getirerek veriye dayalı bir optimizasyon döngüsü inşa ettik.`,
        `90 günün sonunda ROAS hedefin çok üzerinde gerçekleşti. CPA düşerken dönüşüm hacmi arttı. ${client} ekibi artık reklam bütçesini bir maliyet değil, öngörülebilir bir büyüme motoru olarak görüyor.`,
      ],
      sidebarItems: [
        {
          heading: "Zorluk",
          body: "Düşük ROAS, verimsiz bütçe dağılımı ve optimize edilmemiş kitle hedefleme.",
        },
        {
          heading: "Yaklaşım",
          body: "Kapsamlı hesap audit'i, yeniden yapılandırılmış kampanya mimarisi ve sistematik A/B test süreci.",
        },
        {
          heading: "Sonuç",
          body: "ROAS'ta çarpıcı artış, CPA'da ciddi düşüş ve ölçülebilir gelir büyümesi.",
        },
      ],
    },
    Web: {
      paragraphs: [
        `${client} için geliştirdiğimiz bu dijital deneyim, sadece bir web sitesi değil — markanın dijital kimliğinin temel taşı. Kullanıcı araştırmalarıyla başlayan süreç, wireframe'ler, prototipleme ve kullanılabilirlik testleriyle şekillendi.`,
        `Teknik mimaride performansı ön plana aldık. Core Web Vitals'ı hedef alarak her bileşeni optimize ettik. Headless yaklaşım içerik yönetimini kolaylaştırırken animasyon kütüphanesi ile marka kişiliğini hareket diline dönüştürdük.`,
        `Lansman sonrasında organik trafik hızla yükseldi. ${description} Kullanıcılar sitede daha uzun vakit geçirerek dönüşüm hunisini daha yüksek oranlarla tamamlamaya başladı.`,
      ],
      sidebarItems: [
        {
          heading: "Zorluk",
          body: "Eski altyapı, zayıf performans metrikleri ve kullanıcı deneyimindeki sürtünme noktaları.",
        },
        {
          heading: "Yaklaşım",
          body: "UX araştırması, performans odaklı geliştirme ve motion tasarımıyla marka kişiliği dijitale taşındı.",
        },
        {
          heading: "Sonuç",
          body: "Yükselişe geçen organik trafik, iyileşen Core Web Vitals ve dönüşüm oranında kayda değer artış.",
        },
      ],
    },
    Content: {
      paragraphs: [
        `${client} ile ortaklığımız bir içerik stratejisi belirlemeyle başladı. Hedef kitle persona'ları, platform dinamikleri ve rakip içerik analizi bir araya gelince net bir yol haritası ortaya çıktı: tutarlı, değer odaklı ve hikâye güdümlü içerikler.`,
        `Prodüksiyon sürecinde haftalık ritim oluşturduk. Grafik tasarım, kısa video ve metin içerikleri tek bir editoryal sesle üretildi. Her içerik öncesinde beklenti belirlendi, sonrasında performans verileriyle değerlendirildi.`,
        `Aylar içinde organik erişim katlandı, takipçi kalitesi arttı, topluluk etkileşimi güçlendi. ${client} artık rakiplerinin takip ettiği bir içerik markasına dönüştü.`,
      ],
      sidebarItems: [
        {
          heading: "Zorluk",
          body: "Tutarsız içerik sesi, düşük organik erişim ve etkileşimde stagnasyon.",
        },
        {
          heading: "Yaklaşım",
          body: "Strateji odaklı editoryal takvim, disiplinli prodüksiyon döngüsü ve veriye dayalı optimizasyon.",
        },
        {
          heading: "Sonuç",
          body: "Katlar büyüyen organik erişim, yükselen etkileşim oranları ve güçlü topluluk kimliği.",
        },
      ],
    },
  }

  return narratives[category] ?? narratives["Branding"]
}

export function ProjectNarrative({ project }: ProjectNarrativeProps) {
  const { paragraphs, sidebarItems } = getNarrative(project)

  return (
    <section
      className={cn(
        "relative bg-[var(--background)] text-[var(--foreground)]",
        "py-20 md:py-28 overflow-hidden"
      )}
    >
      {/* Subtle dot bg */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── Long-form narrative — 8 cols ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-8 space-y-6"
          >
            <motion.p
              variants={fadeInUp}
              className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--ff-purple)]"
            >
              — Proje Hikâyesi —
            </motion.p>

            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                variants={fadeInUp}
                className={cn(
                  "leading-relaxed text-[var(--foreground-muted)]",
                  i === 0
                    ? "text-lg md:text-xl font-medium text-[var(--foreground)]"
                    : "text-base md:text-lg"
                )}
              >
                {para}
              </motion.p>
            ))}
          </motion.div>

          {/* ── Sidebar — 4 cols ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="ff-shape-container lg:col-span-4 space-y-0 border border-[var(--border)]"
          >
            {sidebarItems.map((item, i) => (
              <motion.div
                key={item.heading}
                variants={fadeInRight}
                className={cn(
                  "p-6",
                  i !== sidebarItems.length - 1 && "border-b border-[var(--border)]"
                )}
              >
                {/* Heading with accent bar */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-3 h-px bg-[var(--ff-purple)]" />
                  <h3 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-[var(--foreground)]">
                    {item.heading}
                  </h3>
                </div>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
