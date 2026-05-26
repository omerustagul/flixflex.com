"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ease } from "@/lib/animations"
import { TiltCard } from "@/components/ui/tilt-card"
import type { PortfolioItem } from "@/components/public"

interface PrevNextProps {
  prev: PortfolioItem | null
  next: PortfolioItem | null
}

function NavSide({
  item,
  direction,
}: {
  item: PortfolioItem
  direction: "prev" | "next"
}) {
  const isNext = direction === "next"

  return (
    <Link
      href={`/portfolio/${item.slug}`}
      className="flex-1 block"
    >
      <TiltCard
        variant="glass"
        className={cn(
          "flex flex-col gap-3 p-8 md:p-10 overflow-hidden",
          isNext ? "items-end text-right" : "items-start text-left"
        )}
      >
        {/* Hover aura */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            isNext
              ? "bg-[radial-gradient(ellipse_at_right_center,rgba(161,52,255,0.08)_0%,transparent_60%)]"
              : "bg-[radial-gradient(ellipse_at_left_center,rgba(161,52,255,0.08)_0%,transparent_60%)]"
          )}
        />

        {/* Direction label */}
        <div
          className={cn(
            "flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase",
            "text-[var(--foreground-faint)] group-hover:text-[var(--ff-purple)] transition-colors duration-200"
          )}
        >
          {!isNext && (
            <motion.span
              animate={{ x: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: ease.smooth }}
            >
              <ArrowLeft size={12} />
            </motion.span>
          )}
          <span>{isNext ? "Sonraki Proje" : "Önceki Proje"}</span>
          {isNext && (
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: ease.smooth }}
            >
              <ArrowRight size={12} />
            </motion.span>
          )}
        </div>

        {/* Project title — big */}
        <p
          className={cn(
            "font-display font-extrabold leading-[0.9] tracking-tight",
            "text-[clamp(22px,3.5vw,48px)]",
            "text-[var(--foreground)] group-hover:text-[var(--ff-purple)]",
            "transition-colors duration-200"
          )}
        >
          {item.title}
        </p>

        {/* Client + category */}
        <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--foreground-faint)]">
          {item.client} &middot; {item.category}
        </p>

        {/* Bottom corner accent */}
        <span
          aria-hidden
          className={cn(
            "absolute bottom-0 h-[2px] w-0 bg-[var(--ff-purple)]",
            "group-hover:w-full transition-all duration-500",
            isNext ? "right-0" : "left-0"
          )}
        />
      </TiltCard>
    </Link>
  )
}

export function PrevNextNav({ prev, next }: PrevNextProps) {
  if (!prev && !next) return null

  return (
    <div className="border-t border-[var(--border)]">
      <div className="flex flex-col md:flex-row">
        {prev ? (
          <NavSide item={prev} direction="prev" />
        ) : (
          <div className="flex-1" />
        )}

        {/* Divider */}
        {prev && next && (
          <div className="w-px bg-[var(--border)] hidden md:block" />
        )}

        {next ? (
          <NavSide item={next} direction="next" />
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  )
}
