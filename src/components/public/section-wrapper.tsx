"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import type { SectionBlock } from "@/types/page-builder"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  section: SectionBlock
  index: number
  children: React.ReactNode
}

export function SectionWrapper({ section, index, children }: SectionWrapperProps) {
  const transition = section.transition || "normal"
  const isPinned = !!section.stickyPin

  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  /**
   * Z-INDEX STRATEJİSİ (Yenilendi):
   * - Bölümler sıralı olarak yükselen z-index değerlerine sahip olmalı.
   * - Böylece her yeni bölüm bir öncekinin "üstünde" kalır.
   */
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "relative",
      width: "100%",
      zIndex: 10 + index, // Her bölüm bir öncekinden üstte
      backgroundColor: "var(--background)",
    }

    // STICKY veya STICKY PIN (Sabitleme)
    if (transition === "sticky" || isPinned) {
      return {
        ...base,
        position: "sticky",
        top: 0,
        height: transition === "sticky" ? "100vh" : "auto",
        overflow: "hidden",
        // Sticky Pin olan bölümlerin üzerine binilebilmesi için z-index'i koruyoruz
      }
    }

    // OVERLAP (Üzerine Binme)
    if (transition === "overlap") {
      return {
        ...base,
        boxShadow: "0 -20px 50px rgba(0,0,0,0.15)", // Üstteki bölümün gölgesi
      }
    }

    return base
  }

  const renderInner = () => {
    if (transition === "parallax") {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
      return (
        <motion.div style={{ y }} className="w-full">
          {children}
        </motion.div>
      )
    }
    return children
  }

  return (
    <div
      ref={ref}
      style={getStyles()}
      className={cn(
        "transition-shadow duration-500",
        (transition === "sticky" || (isPinned && transition !== "normal")) && "flex items-center justify-center"
      )}
    >
      {renderInner()}
    </div>
  )
}
