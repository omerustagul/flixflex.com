"use client"

import * as React from "react"
import type { SectionBlock, SectionType } from "@/types/page-builder"
import {
  HeroSection,
  HeroVideoSection,
  StatsSection,
  ServicesSection,
  PortfolioSection,
  PortfolioVerticalScrollSection,
  TestimonialsSection,
  CTASection,
  ManifestoSection,
  StorySection,
  ValuesSection,
  TeamSection,
  ServicesListAnimated,
  ContactForm,
  ContactInfo,
  TextContentSection,
  ImageTextSection,
  VideoEmbedSection,
  BlogListClient,
  AppointmentCardSection,
} from "@/components/public"
import type { Service } from "@/components/public/sections/services-data"
import { PortfolioHero } from "@/app/(public)/portfolio/_components/portfolio-hero"
import { HeroStrip as ContactHero } from "@/app/(public)/iletisim/_components/hero-strip"
import { WhyUs as AboutWhyUs } from "@/app/(public)/iletisim/_components/why-us"
import { FaqAccordion } from "@/app/(public)/iletisim/_components/faq-accordion"
import { DemoRadialScrollGalleryBento } from "@/components/ui/portfolio-and-image-gallery"
import { DemoPortfolioGallery } from "@/components/ui/portfolio-gallery"
import { DemoOfferCarousel, OfferCarousel } from "@/components/ui/offer-carousel"
import { DemoProjectShowcase } from "@/components/ui/project-showcase"
import { AnimatedVideoHero, VideoHeroProvider } from "@/components/public/hero/animated-video-hero"
import { ParallaxScrolling } from "@/components/public/parallax-scrolling"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/lib/ui-store"
import { ArrowRight } from "lucide-react"

/** Props shape consumed by section renderers — covers all properties used across section types. */
interface SectionRendererProps {
  headline?: string
  subheadline?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  primaryCtaLabel?: string
  primaryCtaHref?: string
  eyebrow?: string
  videoUrl?: string
  videoUrlMobile?: string
  posterUrl?: string
  body?: string
  alignment?: string
  maxWidthProse?: boolean
  imageUrl?: string
  imageAlt?: string
  imagePosition?: string
  variant?: string
  hideMobileDock?: boolean
  [key: string]: unknown
}

interface PageRendererProps {
  sections: SectionBlock[]
  portfolioItems?: unknown[]
  servicesItems?: Service[]
}

const SECTION_RENDERERS: Partial<Record<SectionType, (
  section: SectionBlock,
  context?: { portfolioItems?: unknown[]; servicesItems?: Service[] }
) => React.ReactNode>> = {
  "hero": (s) => {
    const p = s.props as SectionRendererProps
    return (
      <HeroSection
        title={p.headline}
        subtitle={p.subheadline}
        primaryCta={p.ctaLabel ? { label: p.ctaLabel, href: p.ctaHref ?? "#" } : undefined}
        secondaryCta={p.secondaryCtaLabel ? { label: p.secondaryCtaLabel, href: p.secondaryCtaHref ?? "#" } : undefined}
      />
    )
  },
  "stats": () => <StatsSection />,
  "services": (s, ctx) => {
    const p = s.props as SectionRendererProps
    return <ServicesSection headline={p.headline} subheadline={p.subheadline} services={ctx?.servicesItems ?? []} />
  },
  "portfolio": (s, ctx) => <PortfolioSection items={ctx?.portfolioItems as any} />,
  "portfolio-vertical-scroll": (s, ctx) => {
    const p = s.props as any
    return (
      <PortfolioVerticalScrollSection
        headline={p.headline}
        subheadline={p.subheadline}
        direction={p.direction}
        speed={p.speed}
        pauseOnHover={p.pauseOnHover}
        maxItems={p.maxItems}
        hideMobileDock={p.hideMobileDock}
        items={ctx?.portfolioItems as any}
      />
    )
  },
  "testimonials": () => <TestimonialsSection />,
  "team": () => <TeamSection />,
  "manifesto": () => <ManifestoSection />,
  "story": () => <StorySection />,
  "values": () => <ValuesSection />,
  "why-us": () => <AboutWhyUs />,
  "faq": () => <FaqAccordion />,
  "services-list": (s, ctx) => (
    <section className="relative bg-[var(--background)] py-0">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
        <ServicesListAnimated services={ctx?.servicesItems} />
      </div>
    </section>
  ),
  "portfolio-hero": () => <PortfolioHero totalProjects={2} clientCount={1} yearCount={1} categoryCount={1} />,
  "portfolio-grid": (s, ctx) => <PortfolioSection items={ctx?.portfolioItems as any} />,
  "blog-hero": (s) => {
    const p = s.props as any
    return (
      <div className="w-full flex flex-col items-center justify-center py-4 md:py-10">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="ff-shape-container inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--ff-purple)]/10 backdrop-blur-xs border border-[var(--ff-purple)]/20 text-[11px] font-semibold text-[var(--ff-purple)]">
              Blog Yazıları
            </span>
            <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              Haberdar Kalın
            </h2>
            <p className="text-xs text-[var(--foreground-muted)] max-w-xl">
              En güncel ve ilgi çekici blog yazılarını aşağıdan inceleyebilirsiniz.
            </p>
            <button className="inline-flex items-center gap-1.5 px-3 py-1 underline text-[11px] font-semibold text-[var(--foreground)] hover:text-[var(--ff-purple)] transition-colors mt-6">
              Tüm Blog Yazıları
              <ArrowRight size={11} />
            </button>
          </div>
          {/*<OfferCarousel offers={offers} /> */}
        </div>
      </div>
    )
  },
  "blog-grid": () => (
    <section className="mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16 pb-20 md:pb-28">
      <BlogListClient />
    </section>
  ),
  "contact-hero": () => <ContactHero />,
  "contact-info": (s) => (
    <section className="relative bg-[var(--background)] py-20 md:py-28">
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="ff-shape-container lg:col-span-7 border border-[var(--border)] bg-[var(--surface)] p-8 lg:p-10">
            <ContactForm />
          </div>
          <div className="lg:col-span-5">
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  ),
  "cta": (s) => {
    const p = s.props as any
    return (
      <CTASection
        eyebrow={p.eyebrow}
        title={p.headline}
        description={p.description}
        primaryCTA={p.primaryCtaLabel ? { label: p.primaryCtaLabel, href: p.primaryCtaHref } : undefined}
        secondaryCTA={p.secondaryCtaLabel ? { label: p.secondaryCtaLabel, href: p.secondaryCtaHref } : undefined}
        variant={p.variant as "dark" | "light" | undefined}
      />
    )
  },
  "hero-video": (s) => {
    const p = s.props as any
    return (
      <HeroVideoSection
        title={p.headline}
        subtitle={p.subheadline}
        videoUrl={p.videoUrl}
        videoUrlMobile={p.videoUrlMobile}
        posterUrl={p.posterUrl}
        primaryCta={p.ctaLabel ? { label: p.ctaLabel, href: p.ctaHref } : undefined}
        secondaryCta={p.secondaryCtaLabel ? { label: p.secondaryCtaLabel, href: p.secondaryCtaHref } : undefined}
      />
    )
  },
  "contact-form": (s) => {
    const p = s.props as any
    return (
      <section className="relative bg-[var(--background)] py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[var(--foreground)] mb-4">
                {p.headline || "İletişime Geç"}
              </h2>
              <p className="text-[var(--foreground-muted)] text-lg">
                {p.subheadline || "Hemen konuşalım"}
              </p>
            </div>
            <div className="ff-shape-container border border-[var(--border)] bg-[var(--surface)] p-8 lg:p-12">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    )
  },
  "text-content": (s) => {
    const p = s.props as any
    return <TextContentSection {...p} />
  },
  "image-text": (s) => {
    const p = s.props as any
    return <ImageTextSection {...p} />
  },
  "video-embed": (s) => {
    const p = s.props as any
    return <VideoEmbedSection {...p} />
  },
  "portfolio-radial-gallery": (s, ctx) => <DemoRadialScrollGalleryBento items={ctx?.portfolioItems} />,
  "portfolio-marquee-gallery": (s, ctx) => <DemoPortfolioGallery items={ctx?.portfolioItems} />,
  "portfolio-offer-carousel": (s, ctx) => <DemoOfferCarousel items={ctx?.portfolioItems} />,
  "portfolio-project-showcase": (s, ctx) => <DemoProjectShowcase items={ctx?.portfolioItems} />,
  "hero-animated-video": (s) => {
    const p = s.props as any
    return (
      <VideoHeroProvider>
        <AnimatedVideoHero.Video
          videoUrl={p.videoSrc}
          videoUrlMobile={p.videoSrcMobile}
        />
        <AnimatedVideoHero.Content>
          <div className="flex flex-col items-center gap-4">
            {p.headline && (
              <h1 className="font-display text-4xl md:text-6xl lg:text-8xl font-extrabold text-white tracking-tight leading-none">
                {p.headline}
              </h1>
            )}
            {p.subheadline && (
              <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                {p.subheadline}
              </p>
            )}
          </div>
        </AnimatedVideoHero.Content>
        {p.clipPathVariant && p.clipPathVariant !== "none" && (
          <AnimatedVideoHero.ClipMask insetRange={p.clipPathVariant === "circle" ? [15, 45] : [0, 35]}>
            <div className="absolute inset-0 bg-[var(--background)]" />
          </AnimatedVideoHero.ClipMask>
        )}
      </VideoHeroProvider>
    )
  },
  "parallax": (s) => {
    const p = s.props as any
    return (
      <ParallaxScrolling layers={p.layers ?? []}>
        {(p.headline || p.subheadline) && (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            {p.headline && (
              <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                {p.headline}
              </h2>
            )}
            {p.subheadline && (
              <p className="text-base md:text-lg text-white/80 max-w-xl">
                {p.subheadline}
              </p>
            )}
          </div>
        )}
      </ParallaxScrolling>
    )
  },
  "appointment-card": (s) => {
    const p = s.props as any
    return (
      <AppointmentCardSection
        eyebrow={p.eyebrow}
        headline={p.headline}
        description={p.description}
        ctaLabel={p.ctaLabel}
      />
    )
  },
}

export function PageRenderer({ sections, portfolioItems, servicesItems }: PageRendererProps) {
  const { setMobileDockVisible } = useUIStore()
  const sectionRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())
  const intersectionRatios = React.useRef<Map<string, number>>(new Map())

  const visibleSections = React.useMemo(() => {
    return [...sections]
      .filter((s) => s.visible)
      .sort((a, b) => a.order - b.order)
  }, [sections])

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = (entry.target as HTMLElement).dataset.sectionId
          if (sectionId) {
            intersectionRatios.current.set(sectionId, entry.intersectionRatio)
          }
        })

        // Find the section that is most visible
        let maxRatio = -1
        let mostVisibleSectionId = ""

        intersectionRatios.current.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio
            mostVisibleSectionId = id
          }
        })

        if (mostVisibleSectionId) {
          const mostVisibleSection = visibleSections.find(s => s.id === mostVisibleSectionId)
          if (mostVisibleSection) {
            const props = (mostVisibleSection.props as any) || {}
            const hideDock = props.hideMobileDock === true
            setMobileDockVisible(!hideDock)
          }
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-20% 0px -20% 0px"
      }
    )

    sectionRefs.current.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [visibleSections, setMobileDockVisible])

  if (visibleSections.length === 0) return null

  return (
    <>
      {visibleSections.map((section) => {
        const renderer = SECTION_RENDERERS[section.type]
        if (!renderer) {
          return (
            <div key={section.id} className="py-20 text-center border-y border-dashed border-[var(--border)]">
              <p className="text-xs text-[var(--foreground-faint)] uppercase tracking-widest">
                Section Type Not Implemented: {section.type}
              </p>
            </div>
          )
        }

        return (
          <div
            key={section.id}
            data-section-id={section.id}
            ref={(el) => {
              if (el) sectionRefs.current.set(section.id, el)
              else sectionRefs.current.delete(section.id)
            }}
            className="w-full"
          >
            {renderer(section, { portfolioItems, servicesItems })}
          </div>
        )
      })}
    </>
  )
}



