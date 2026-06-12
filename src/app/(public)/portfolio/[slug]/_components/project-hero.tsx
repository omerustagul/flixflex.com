"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight } from "@/lib/icons"
import { FFBadge } from "@/components/ui"
import { staggerContainer, fadeInUp, ease } from "@/lib/animations"
import { cn } from "@/lib/utils"
import type { PortfolioItem } from "@/components/public"
import { StarField } from "@/components/ui/star-field"

interface ProjectHeroProps {
  project: PortfolioItem
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const { title, client, year, category, gradient, accentColor, coverImage, clientLogo } = project

  return (
    <section
      className={cn(
        "relative bg-[var(--background)] text-[var(--foreground)]",
        "pt-20 pb-0 md:pt-28 overflow-hidden"
      )}
    >
      {/* Grid texture */}
      {/* Deep-space starfield background (replaces the old grid) */}
      <StarField className="z-0" />

      {/* Purple aura */}
      <div
        aria-hidden
        className="absolute -top-40 right-0 w-[36rem] h-[36rem] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, rgba(255, 79, 216,0.12) 0%, transparent 65%)`,
          filter: "blur(60px)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          {/* Breadcrumb */}
          <motion.nav
            variants={fadeInUp}
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--foreground-faint)] mb-6"
          >
            <Link
              href="/portfolio"
              className="hover:text-[var(--ff-purple)] transition-colors duration-150"
            >
              Portfolyo
            </Link>
            <ChevronRight size={10} />
            <span className="text-[var(--foreground-muted)]">{title}</span>
          </motion.nav>

          {/* Client logo + category badge */}
          <motion.div variants={fadeInUp} className="mb-5 flex items-center gap-3">
            {clientLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={clientLogo}
                alt={`${client} logo`}
                className="h-8 w-auto max-w-[140px] object-contain"
                loading="lazy"
              />
            )}
            <FFBadge variant="purple">{category}</FFBadge>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            className={cn(
              "font-display font-extrabold leading-[0.9] tracking-tight",
              "text-[clamp(30px,3vw, 50px)]",
              "max-w-4xl"
            )}
          >
            {title}
          </motion.h1>

          {/* Meta strip — client / year / role */}
          <motion.div
            variants={fadeInUp}
            className="ff-shape-container mt-8 flex flex-wrap items-center gap-0 border border-[var(--border)] w-fit"
          >
            {[
              { label: "Müşteri", value: client },
              { label: "Yıl", value: String(year) },
              { label: "Kategori", value: category },
            ].map((item, i) => (
              <div
                key={item.label}
                className={cn(
                  "flex flex-col px-3 py-3",
                  i !== 0 && "border-l border-[var(--border)]"
                )}
              >
                <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[var(--foreground-faint)] mb-0.5">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  {item.value}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Big visual placeholder ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: ease.smooth }}
          className={cn(
            "ff-shape-container relative w-full overflow-hidden",
            "h-[55vw] max-h-[680px] min-h-[320px]",
            "border border-[var(--border)]",
            !coverImage && "bg-gradient-to-br",
            !coverImage && gradient
          )}
        >
          {coverImage ? (
            /* Admin-uploaded cover image */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
          ) : (
            <>
              {/* Grid overlay */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Big title watermark */}
              <div className="absolute inset-0 flex items-center justify-center p-10">
                <p
                  className={cn(
                    "font-display font-extrabold text-center break-words",
                    "leading-[0.85] tracking-[-0.04em]",
                    "select-none pointer-events-none",
                    "text-[clamp(48px,9vw,160px)]"
                  )}
                  style={{ color: accentColor, opacity: 0.22 }}
                >
                  {client.toUpperCase()}
                </p>
              </div>
            </>
          )}

          {/* Corner label */}
          <div className="absolute bottom-5 left-5 z-10">
            <span
              className="text-[9px] font-mono tracking-[0.25em] uppercase"
              style={{ color: accentColor, opacity: 0.6 }}
            >
              {category} · {year}
            </span>
          </div>

          {/* Corner accent marks */}
          {[
            "top-0 left-0",
            "top-0 right-0 rotate-90",
            "bottom-0 right-0 rotate-180",
            "bottom-0 left-0 -rotate-90",
          ].map((cls, i) => (
            <span
              key={i}
              aria-hidden
              className={cn("absolute w-6 h-6 pointer-events-none", cls)}
              style={{
                borderTop: `1px solid ${accentColor}`,
                borderLeft: `1px solid ${accentColor}`,
                opacity: 0.4,
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
