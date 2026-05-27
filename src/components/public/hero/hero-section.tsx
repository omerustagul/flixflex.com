"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Play } from "lucide-react"
import { BackgroundPaths, AnimatedHeading } from "@/components/ui"
import { fadeInUp, withDelay } from "@/lib/animations"
import { cn } from "@/lib/utils"
import { HeroVisual } from "./hero-visual"
import { ScrollIndicator } from "./scroll-indicator"

interface HeroSectionProps {
  title?: string
  subtitle?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export function HeroSection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative min-h-[100svh] flex items-center",
        "bg-[var(--background)] text-[var(--foreground)]",
        "pt-28 pb-20 md:pt-32 md:pb-24",
        "overflow-hidden"
      )}
    >
      {/* Background layers */}
      <BackgroundPaths intensity="medium" />

      {/* Purple aura — top right */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[40rem] h-[40rem] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(161,52,255,0.22) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
      />

      {/* Grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] w-full px-6 md:px-10 xl:px-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ── Left: copy ─────────────────────────── */}
          <div className="lg:col-span-7 relative z-10">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn(
                "ff-shape-container inline-flex items-center gap-2 mb-7",
                "border border-[rgba(161,52,255,0.3)] bg-[rgba(161,52,255,0.08)]",
                "px-3 py-1.5"
              )}
            >
              <span className="w-1.5 h-1.5 bg-[var(--ff-purple)] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-[var(--ff-purple)]">
                Next-Gen Reklam Ajansı · 2026
              </span>
            </motion.div>

            {/* Title — letter stagger */}
            <div
              className={cn(
                "font-display font-extrabold leading-[0.95] tracking-tight",
                "text-[clamp(44px,7vw,108px)]"
              )}
            >
              {title ? (
                <AnimatedHeading
                  text={title}
                  accentWords={["Domine", "Next-Gen", "FlixFlex"]}
                  tag="h1"
                  className="block"
                />
              ) : (
                <>
                  <AnimatedHeading
                    text="Markaları"
                    tag="h1"
                    className="block"
                  />
                  <AnimatedHeading
                    text="Domine Eder"
                    accentWords={["Domine"]}
                    tag="h2"
                    delay={1}
                    className="block"
                  />
                </>
              )}
            </div>

            {/* Subtitle */}
            <motion.p
              variants={withDelay(fadeInUp, 1.2)}
              initial="hidden"
              animate="visible"
              className={cn(
                "mt-8 max-w-xl text-base md:text-md leading-relaxed",
                "text-[var(--foreground)]"
              )}
            >
              {subtitle || (
                <>
                  Strateji, yaratıcılık ve performansı tek bir vuruşta birleştiriyoruz.
                  <span className="text-[var(--secondary)] font-medium">
                    {" "}Hız. Güç. Esneklik.
                  </span>{" "}
                  Markanızın bir sonraki bölümünü birlikte yazalım.
                </>
              )}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={withDelay(fadeInUp, 1.4)}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href={primaryCta?.href || "/iletisim"}
                className={cn(
                  "ff-shape-button",
                  "group inline-flex items-center justify-center gap-2.5",
                  "px-8 py-4 text-sm font-medium uppercase tracking-[0.05em]",
                  "bg-[var(--ff-purple)] text-white border border-[var(--ff-purple)]",
                  "hover:bg-[var(--ff-purple-hover)] hover:border-[var(--ff-purple-hover)]",
                  "hover:shadow-[0_4px_24px_rgba(161,52,255,0.45)]",
                  "transition-all duration-200"
                )}
              >
                {primaryCta?.label || "Keşfet"}
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link
                href={secondaryCta?.href || "/isler"}
                className={cn(
                  "ff-shape-button",
                  "group inline-flex items-center justify-center gap-2.5",
                  "px-8 py-4 text-sm font-medium uppercase tracking-[0.05em]",
                  "bg-transparent text-[var(--ff-purple)] border border-[var(--ff-purple)]",
                  "hover:bg-[var(--ff-purple)/0.1] hover:border-[var(--ff-purple)] hover:text-[var(--ff-purple-dark)]",
                  "hover:shadow-[0_0_20px_var(--ff-purple)/0.15)]",
                  "transition-all duration-200"
                )}
              >
                <Play size={14} />
                {secondaryCta?.label || "Portfolyomuzu Gör"}
              </Link>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              variants={withDelay(fadeInUp, 1.7)}
              initial="hidden"
              animate="visible"
              className="mt-14 flex flex-wrap items-center gap-6 md:gap-10"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl text-[var(--foreground)]">
                  150+
                </span>
                <span className="text-xs text-[var(--foreground-faint)]">
                  Proje
                </span>
              </div>
              <span className="w-px h-6 bg-[var(--border)]" />
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl text-[var(--ff-purple)]">
                  340%
                </span>
                <span className="text-xs text-[var(--foreground-faint)]">
                  Ortalama Büyüme
                </span>
              </div>
              <span className="w-px h-6 bg-[var(--border)]" />
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl text-[var(--foreground)]">
                  5 Yıl
                </span>
                <span className="text-xs uppercase tracking-widest text-[var(--foreground-faint)]">
                  Deneyim
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── Right: visual ──────────────────────── */}
          <div className="lg:col-span-5 relative z-0">
            <HeroVisual />
          </div>
        </div>

        {/* Scroll indicator */}
        <ScrollIndicator className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex" />
      </div>
    </section>
  )
}
