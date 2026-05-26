"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { SquarePen, FileText, Palette, Sparkles, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { staggerContainer, fadeInUp } from "@/lib/animations"
import { TiltCard } from "@/components/ui/tilt-card"

const ACTIONS = [
  {
    label: "Yeni Post",
    description: "Blog yazısı oluştur",
    href: "/admin/blog/yeni",
    icon: SquarePen,
  },
  {
    label: "Yeni Sayfa",
    description: "Sayfa oluştur",
    href: "/admin/sayfalar/yeni",
    icon: FileText,
  },
  {
    label: "Renk Değiştir",
    description: "Tema yönetimi",
    href: "/admin/theme",
    icon: Palette,
  },
  {
    label: "AI Önerileri",
    description: "İçerik üret",
    href: "/admin/ai",
    icon: Sparkles,
  },
] as const

export function QuickActions() {
  return (
    <div>
      <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--foreground-muted)] mb-4">
        Hızlı İşlemler
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3"
      >
        {ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <motion.div key={action.href} variants={fadeInUp}>
              <Link href={action.href}>
                <TiltCard
                  variant="glass"
                  className="flex flex-row items-start justify-between vertical-align: middle gap-3 p-4 overflow-hidden"
                >
                  {/* Left accent on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--ff-purple)] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                  <div className="flex items-center gap-3">
                    <div className="ff-shape-button w-9 h-9 flex items-center justify-center bg-[rgba(161,52,255,0.08)] shrink-0">
                      <Icon
                        size={16}
                        className="text-[var(--foreground-muted)] group-hover:text-[var(--ff-purple)] transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--foreground)] leading-tight">
                        {action.label}
                      </p>
                      <p className="text-[11px] text-[var(--foreground-faint)] mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight
                    size={14}
                    className="shrink-0 text-[var(--foreground-faint)] group-hover:text-[var(--ff-purple)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                  />
                </TiltCard>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
