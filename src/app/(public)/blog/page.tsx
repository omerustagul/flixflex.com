import type { Metadata } from "next"
import { cn } from "@/lib/utils"
import { CTASection } from "@/components/public/sections/cta-section"
import { FeaturedPost } from "@/components/public/blog/featured-post"
import { BlogListClient } from "@/components/public/blog/blog-list-client"
import { getFeaturedPost } from "@/components/public/blog/blog-data"

import { getPageBySlug } from "@/lib/page-data"
import { listPublishedPortfolio } from "@/lib/content-store"
import { PageRenderer } from "@/components/public/page-renderer"

export const metadata: Metadata = {
  title: "Blog & Düşünceler | FlixFlex",
  description:
    "Dijital pazarlama, marka stratejisi, performans ve yaratıcılık üzerine FlixFlex ekibinin içgörüleri.",
  openGraph: {
    title: "Blog & Düşünceler | FlixFlex",
    description:
      "Dijital pazarlama, marka stratejisi, performans ve yaratıcılık üzerine FlixFlex ekibinin içgörüleri.",
    type: "website",
    siteName: "FlixFlex",
  },
}

export default async function BlogPage() {
  const portfolioItems = await listPublishedPortfolio();
  const pageData = await getPageBySlug("blog")

  if (!pageData || pageData.sections.length === 0) {
    const featured = getFeaturedPost()

    return (
      <>
        {/* ── Hero ─────────────────────────────────────── */}
        <section
          className={cn(
            "relative bg-[var(--background)] text-[var(--foreground)]",
            "pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden"
          )}
        >
          {/* Background dot pattern */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage:
                "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)",
            }}
          />

          {/* Purple aura */}
          <div
            aria-hidden
            className="absolute top-0 right-0 w-[40rem] h-[32rem] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(161,52,255,0.15) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
          />

          <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--ff-purple)] mb-5">
                — Düşünceler & İçgörüler —
              </p>

              {/* Heading */}
              <h1
                className={cn(
                  "font-display font-extrabold leading-[0.95] tracking-tight",
                  "text-[clamp(32px,4vw,68px)]",
                  "text-[var(--foreground)] mb-6"
                )}
              >
                Düşünceler
              </h1>

              <p className="text-base md:text-xl text-[var(--foreground-muted)] leading-relaxed max-w-2xl">
                Dijital pazarlama, marka inşası ve büyüme stratejileri üzerine FlixFlex ekibinin
                içgörüleri, analizleri ve pratik rehberleri.
              </p>
            </div>
          </div>
        </section>

        {/* ── Featured post ─────────────────────────────── */}
        <section className="mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16 pb-16">
          <div className="flex items-center gap-4 mb-6">
            <p className="text-[11px] font-semibold text-[var(--ff-purple)]">
              — Öne Çıkan Yazı —
            </p>
            <span className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <FeaturedPost post={featured} />
        </section>

        {/* ── Blog grid ─────────────────────────────────── */}
        <section className="mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16 pb-20 md:pb-28">
          <div className="flex items-center gap-4 mb-8">
            <p className="text-[11px] font-semibold text-[var(--ff-purple)]">
              — Tüm Yazılar —
            </p>
            <span className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <BlogListClient />
        </section>

        {/* ── CTA ──────────────────────────────────────── */}
        <CTASection
          eyebrow="— Birlikte Büyüyelim —"
          title={
            <>
              Markanızı <span className="text-[var(--ff-purple)]">domine</span> edelim.
            </>
          }
          description="Okuduklarınızı markanıza uygulamak ister misiniz? FlixFlex ekibiyle bir tanışma seansı ayarlayalım."
          primaryCTA={{ label: "İletişime Geç", href: "/iletisim" }}
          secondaryCTA={{ label: "Portfolyoyu Gör", href: "/portfolio" }}
        />
      </>
    )
  }

  return <PageRenderer sections={pageData.sections} portfolioItems={portfolioItems} />
}
