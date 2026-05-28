import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { ServiceCard } from "./service-card"
import type { Service } from "./services-data"
import { OfferCarousel } from "@/components/ui/offer-carousel"

// ── Props ──────────────────────────────────────────
interface ServicesSectionProps {
  services: Service[]
  headline?: string
  subheadline?: string
}

// ── Section ────────────────────────────────────────
export function ServicesSection({ services, headline, subheadline }: ServicesSectionProps) {
  return (
    <section
      className={cn(
        "relative bg-[var(--background)] text-[var(--foreground)]",
        "overflow-hidden"
      )}
    >
      {/* Subtle grid background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Purple corner accent — top-right */}
      <span
        aria-hidden
        className="absolute top-0 right-0 w-[380px] h-[380px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 100% 0%, rgba(255, 79, 216,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative px-6 md:px-10 xl:px-16">
        {/* ── Section header ── */}
        <div className="w-full flex flex-col items-center justify-center py-6 md:py-10">
          <div className="w-full flex flex-col items-center justify-center space-y-8 md:space-y-12">
            <div className="flex flex-col items-center justify-center gap-1 text-center">
            <span className="ff-shape-container inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--ff-purple)]/10 border border-[var(--ff-purple)]/20 text-[11px] font-semibold text-[var(--ff-purple)] mb-4">
            <Tag size={11} />
            Hizmetlerimiz
            </span>
            <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-extrabold leading-[1.15] tracking-tight max-w-2xl text-[var(--foreground)]">
            Sunduğumuz Hizmetler
            </h2>
            <p className="mt-1 text-[var(--foreground-muted)] text-base md:text-sm max-w-xl leading-relaxed">
            Sunduğumuz hizmetlerle size nasıl değer katabileceğinizi keşfedin.
            </p>
            <button className="inline-flex items-center gap-1.5 px-3 py-1 underline text-[11px] font-semibold text-[var(--foreground)] hover:text-[var(--ff-purple)] transition-colors mt-2">
            Tüm Hizmetlerimiz
            <ArrowRight size={11} />
            </button>
        </div>
            {/* ── Desktop grid (hidden on mobile) ── */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-3">
              {services.map((service, i) => (
                <div key={service.slug} className="bg-[var(--background)]">
                  <ServiceCard service={service} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ── Mobile horizontal scroll carousel ── */}
        <div
          className={cn(
            "md:hidden",
            "flex gap-4 overflow-x-auto",
            "snap-x snap-mandatory",
            "pb-4",
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          )}
        >
          {services.map((service, i) => (
            <div
              key={service.slug}
              className={cn(
                "snap-start flex-shrink-0",
                "w-[80vw] min-w-[260px] max-w-[320px]"
              )}
            >
              <ServiceCard service={service} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
