"use client"

import { motion } from "framer-motion"
import { staggerContainer, fadeInUp, ease } from "@/lib/animations"
import { cn } from "@/lib/utils"

interface PortfolioHeroProps {
  totalProjects: number
  clientCount: number
  yearCount: number
  categoryCount: number
}

interface StatPillProps {
  value: string | number
  label: string
  index: number
}

function StatPill({ value, label, index }: StatPillProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.6 + index * 0.08, ease: ease.smooth }}
      className={cn(
        "ff-shape-button flex items-baseline gap-2 px-5 py-3",
        "border border-[var(--border)]",
        "bg-[var(--surface)]"
      )}
    >
      <span className="font-display font-extrabold text-xl md:text-2xl text-[var(--ff-purple)] leading-none">
        {value}
      </span>
      <span className="text-[10px] font-semibold text-[var(--foreground-faint)]">
        {label}
      </span>
    </motion.div>
  )
}

export function PortfolioHero({
  totalProjects,
  clientCount,
  yearCount,
  categoryCount,
}: PortfolioHeroProps) {
  const stats: StatPillProps[] = [
    { value: `${totalProjects}+`, label: "Proje", index: 0 },
    { value: `${clientCount}+`, label: "Müşteri", index: 1 },
    { value: `${yearCount}`, label: "Aktif Yıl", index: 2 },
    { value: `${categoryCount}`, label: "Kategori", index: 3 },
  ]

  return (
    <section
      className={cn(
        "relative bg-[var(--background)] text-[var(--foreground)]",
        "pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden"
      )}
    >
      {/* Grid background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Purple aura top-left */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-[40rem] h-[32rem] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255, 79, 216,0.14) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeInUp}
            className="text-[11px] font-semibold text-[var(--ff-purple)] mb-5"
          >
            — Portfolyo —
          </motion.p>

          {/* Heading */}
          <motion.h1
            variants={fadeInUp}
            className={cn(
              "font-display font-extrabold leading-[0.92] tracking-tight",
              "text-[clamp(44px,7vw,96px)]"
            )}
          >
            Domine ettiğimiz{" "}
            <span className="text-[var(--ff-purple)]">markalar.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className={cn(
              "mt-7 text-base md:text-xl leading-relaxed",
              "text-[var(--foreground-muted)] max-w-2xl"
            )}
          >
            Strateji, yaratıcılık ve verinin kesiştiği noktada doğan projeler.
            Her biri bir sorunun çözümü, her biri ölçülebilir bir başarı.
            İşte FlixFlex imzası taşıyan seçili çalışmalarımız.
          </motion.p>
        </motion.div>

        {/* Stats strip */}
        <div className="mt-12 md:mt-16 flex flex-wrap gap-3">
          {stats.map((stat) => (
            <StatPill key={stat.label} {...stat} />
          ))}
        </div>

        {/* Bottom border accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 1.0, ease: ease.entering }}
          style={{ transformOrigin: "left" }}
          className="mt-16 h-px w-full bg-gradient-to-r from-[var(--ff-purple)] via-[rgba(255, 79, 216,0.3)] to-transparent"
        />
      </div>
    </section>
  )
}
