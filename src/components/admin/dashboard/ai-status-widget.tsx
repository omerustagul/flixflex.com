"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowUpRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/utils"
import { TiltCard } from "@/components/ui/tilt-card"

// Demo state — swap with real API call when backend is ready
interface AiStatus {
  running: boolean
  lastGenerated: Date
  lastPostTitle: string
  queuedCount: number
}

function getInitialAiStatus(): AiStatus {
  const now = Date.now()
  return {
    running: true,
    lastGenerated: new Date(now - 1000 * 60 * 60 * 8),
    lastPostTitle: '"Google Ads Stratejisi 2025"',
    queuedCount: 2,
  }
}

export function AiStatusWidget() {
  const [aiStatus] = useState<AiStatus>(getInitialAiStatus)
  const { running, lastGenerated, lastPostTitle, queuedCount } = aiStatus

  return (
    <div className="h-full">
      <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--foreground-muted)] mb-4">
        AI Blog Motoru
      </h2>

      <TiltCard
        variant="glass"
        className="p-5 flex flex-col gap-5"
      >
        {/* Status indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Animated pulse dot */}
            <span className="relative flex h-2.5 w-2.5">
              {running && (
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <span
                className={cn(
                  "relative inline-flex h-2.5 w-2.5 rounded-full",
                  running ? "bg-green-500" : "bg-yellow-500"
                )}
              />
            </span>
            <span
              className={cn(
                "text-[12px] font-semibold uppercase tracking-[0.08em]",
                running ? "text-green-500" : "text-yellow-500"
              )}
            >
              {running ? "Çalışıyor" : "Beklemede"}
            </span>
          </div>

          {/* Queue badge */}
          {queuedCount > 0 && (
            <span className="ff-shape-button text-[10px] uppercase tracking-widest px-2 py-0.5 bg-[rgba(161,52,255,0.1)] text-[var(--ff-purple)] border border-[rgba(161,52,255,0.25)] font-semibold">
              {queuedCount} kuyrukta
            </span>
          )}
        </div>

        {/* Sparkle icon */}
        <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
          <div className="ff-shape-button w-8 h-8 flex items-center justify-center bg-[rgba(161,52,255,0.08)]">
            <Sparkles size={15} className="text-[var(--ff-purple)]" />
          </div>
          <div>
            <p className="text-[11px] text-[var(--foreground-faint)] uppercase tracking-widest">
              Son üretilen
            </p>
            <p className="text-[12px] font-medium text-[var(--foreground)] mt-0.5 line-clamp-1">
              {lastPostTitle}
            </p>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--foreground-faint)]">
          <Clock size={11} />
          <span>{formatRelativeTime(lastGenerated)}</span>
        </div>

        {/* CTA */}
        <Link
          href="/admin/ai"
          className={cn(
            "ff-shape-button group flex items-center justify-center gap-2",
            "w-full py-2.5",
            "text-[12px] font-medium uppercase tracking-[0.07em]",
            "bg-[var(--ff-purple)]/12 text-[var(--ff-purple)]",
            "border border-[var(--ff-purple)]/30",
            "hover:bg-[var(--ff-purple)]/20 hover:border-[var(--ff-purple)]/50",
            "transition-all duration-200"
          )}
        >
          Yeni Yazı Üret
          <ArrowUpRight
            size={13}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
          />
        </Link>
      </TiltCard>
    </div>
  )
}
