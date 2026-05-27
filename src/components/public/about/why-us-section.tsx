"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { DIFFERENTIATORS, type Differentiator } from "./about-data"

// ── Single comparison row ─────────────────────────────
function ComparisonRow({
  diff,
}: {
  diff: Differentiator
  index: number
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        "group grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-stretch",
        "border-b border-[var(--border)] last:border-b-0",
        "transition-colors duration-200"
      )}
    >
      {/* ONLAR side */}
      <div
        className={cn(
          "flex items-center gap-3 py-5 md:py-6 pr-4 md:pr-8",
          "transition-opacity duration-300",
          "group-hover:opacity-60"
        )}
      >
        <span
          aria-hidden
          className="shrink-0 w-6 h-6 flex items-center justify-center border border-[var(--border)] text-[var(--foreground-faint)]"
        >
          <X size={12} strokeWidth={2.5} />
        </span>
        <p className="text-sm md:text-base text-[var(--foreground-muted)] leading-snug">
          {diff.theirs}
        </p>
      </div>

      {/* Center topic divider */}
      <div className="flex flex-col items-center justify-center py-4 px-2 md:px-4">
        {/* Vertical line */}
        <div className="w-px flex-1 bg-[var(--border)]" />
        {/* Topic badge */}
        <div
          className={cn(
            "my-2 px-2 py-1 shrink-0",
            "border border-[var(--ff-purple)]/30 bg-[var(--ff-purple)]/10 text-[var(--ff-purple)]",
            "transition-[background-color,border-color,box-shadow] duration-300",
            "group-hover:bg-[var(--ff-purple)] group-hover:border-[var(--ff-purple)]",
            "group-hover:shadow-[0_0_12px_rgba(161,52,255,0.2)]"
          )}
        >
          <span className="font-mono text-[9px] md:text-[10px] font-semibold text-[var(--ff-purple)] whitespace-nowrap">
            {diff.topic}
          </span>
        </div>
        {/* Vertical line */}
        <div className="w-px flex-1 bg-[var(--border)]" />
      </div>

      {/* BİZ side */}
      <div
        className={cn(
          "flex items-center gap-3 py-5 md:py-6 pl-4 md:pl-8"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "shrink-0 w-6 h-6 flex items-center justify-center",
            "bg-[var(--ff-purple)] border border-[var(--ff-purple)] text-white",
            "transition-[box-shadow] duration-300",
            "group-hover:shadow-[0_0_14px_rgba(161,52,255,0.5)]"
          )}
        >
          <Check size={12} strokeWidth={2.5} />
        </span>
        <p className="text-sm md:text-base text-[var(--foreground)] font-medium leading-snug">
          {diff.ours}
        </p>
      </div>
    </motion.div>
  )
}

// ── Section ────────────────────────────────────────────
export function WhyUsSection() {
  return (
    <section
      className={cn(
        "relative bg-[var(--background)] text-[var(--foreground)]",
        "py-20 md:py-28 overflow-hidden"
      )}
    >
      {/* Subtle purple left accent */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[40%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(161,52,255,0.04) 0%, transparent 100%)",
        }}
      />
      {/* Subtle purple right accent */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-[40%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(161,52,255,0.06) 0%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-14 md:mb-20 text-center"
        >
          <p className="mb-4 text-[11px] font-semibold text-[var(--ff-purple)]">
            — Neden FlixFlex —
          </p>
          <h2
            className={cn(
              "font-display font-extrabold leading-[1.08] tracking-[-0.03em]",
              "text-[clamp(2rem,4.5vw,3.5rem)]",
              "text-[var(--foreground)]"
            )}
          >
            Diğerleri vs.{" "}
            <span className="text-[var(--ff-purple)]">Biz</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed">
            Piyasadaki ajanslardan nasıl ayrışıyoruz? Şeffaf, direkt ve
            ölçülebilir bir karşılaştırma.
          </p>
        </motion.div>

        {/* Column labels */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 mb-2 md:mb-4"
        >
          <div className="py-3 pr-4 md:pr-8">
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--foreground-faint)]">
              Onlar
            </span>
          </div>
          <div className="px-2 md:px-4 flex items-center justify-center">
            <span className="w-8 invisible" />
          </div>
          <div className="py-3 pl-4 md:pl-8">
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--ff-purple)]">
              FlixFlex
            </span>
          </div>
        </motion.div>

        {/* Comparison rows */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className={cn(
            "ff-shape-container",
            "border border-[var(--border)]",
            "divide-y-0",
            "bg-[var(--surface-elevated)]"
          )}
        >
          {DIFFERENTIATORS.map((diff, i) => (
            <ComparisonRow key={diff.topic} diff={diff} index={i} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-14 md:mt-20 flex flex-col items-center gap-5 text-center"
        >
          <p className="text-base md:text-lg text-[var(--foreground-muted)] max-w-xl leading-relaxed">
            Markanız için doğru ortağı buldunuz. Bir adım atmak yeter.
          </p>
          <Link
            href="/iletisim"
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
            Ücretsiz Strateji Görüşmesi
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path
                d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="square"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
