"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { staggerContainer, fadeInUp } from "@/lib/animations"

interface ServiceCtaProps {
  serviceTitle: string
}

export function ServiceCta({ serviceTitle }: ServiceCtaProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        "py-20 md:py-28",
        "bg-[var(--surface-elevated)] text-white"
      )}
    >
      {/* Grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(161,52,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(161,52,255,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Purple aura */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[24rem] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(161,52,255,0.2) 0%, transparent 65%)",
          filter: "blur(64px)",
        }}
      />

      {/* Corner accents */}
      <div className="absolute inset-6 pointer-events-none">
        {(["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"] as const).map((pos, i) => (
          <span
            key={i}
            aria-hidden
            className={`absolute w-5 h-5 ${pos}`}
            style={{
              borderTop: "1px solid rgba(161,52,255,0.45)",
              borderLeft: "1px solid rgba(161,52,255,0.45)",
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="text-[11px] font-semibold text-[var(--ff-purple)] mb-6"
          >
            — Bir Sonraki Adım —
          </motion.p>

          <motion.h2
            variants={fadeInUp}
            className="font-display font-extrabold leading-[0.95] tracking-tight text-[var(--foreground)] mb-8"
            style={{ fontSize: "clamp(24px, 3vw, 54px)" }}
          >
            Bu hizmetle{" "}
            <span className="text-[var(--ff-purple)]">başlayalım</span>{" "}
            mı?
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-base md:text-xl leading-relaxed max-w-xl mb-12 text-[var(--foreground-muted)]"
          >
            {serviceTitle} hizmetimizle ilgili bir brief hazırlayalım, hemen konuşalım.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/iletisim"
              className={cn(
                "ff-shape-button",
                "group inline-flex items-center justify-center gap-2.5",
                "px-10 py-5 h-9 text-[15px] font-medium",
                "bg-[var(--ff-purple)] text-white border border-[var(--ff-purple)]",
                "hover:bg-[var(--ff-purple-hover)] hover:border-[var(--ff-purple-hover)]",
                "hover:shadow-[0_4px_32px_rgba(161,52,255,0.5)]",
                "transition-all duration-200"
              )}
            >
              Hemen İletişime Geç
              <ArrowUpRight
                size={16}
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <Link
              href="/hizmetler"
              className={cn(
                "ff-shape-button",
                "group inline-flex items-center justify-center gap-2.5",
                "px-10 py-5 h-9 text-[15px] font-medium",
                "bg-transparent text-[var(--foreground)] border border-[var(--border)]",
                "hover:border-[var(--ff-purple)]",
                "transition-all duration-200"
              )}
            >
              Tüm Hizmetler
              <ArrowUpRight
                size={16}
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex items-center gap-2 text-[11px] text-[var(--foreground-muted)]"
          >
            <span className="w-1.5 h-1.5 bg-[var(--ff-purple)] animate-pulse" aria-hidden />
            <span>Şu an müsaitiz · İstanbul, TR</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
