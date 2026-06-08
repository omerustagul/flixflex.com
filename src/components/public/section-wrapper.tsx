"use client"

import * as React from "react"
import type { SectionBlock } from "@/types/page-builder"
import { cn } from "@/lib/utils"

export interface SectionWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  section: SectionBlock
  index: number
  children: React.ReactNode
}

export const SectionWrapper = React.forwardRef<HTMLDivElement, SectionWrapperProps>(
  ({ section, index, children, className, style, ...props }, ref) => {
    const transition = section.transition || "normal"
    const isPinned = !!section.stickyPin

    /**
     * Z-INDEX STRATEJİSİ:
     * - Bölümler sıralı olarak yükselen z-index değerlerine sahip olmalı.
     * - Böylece her yeni bölüm bir öncekinin "üstünde" kalır.
     */
    const getStyles = (): React.CSSProperties => {
      const base: React.CSSProperties = {
        position: "relative",
        width: "100%",
        zIndex: 10 + index, // Her bölüm bir öncekinden üstte
        backgroundColor: "var(--background)",
        ...style,
      }

      // STICKY / STICKY PIN veya PARALLAX DECK (Kart Yığılma Geçişi)
      if (transition === "sticky" || transition === "parallax" || isPinned) {
        const isParallax = transition === "parallax"
        return {
          ...base,
          position: "sticky",
          top: 0,
          height: (transition === "sticky" || isParallax) ? "100vh" : "auto",
          overflow: "hidden",
          borderTopLeftRadius: (isParallax && index > 0) ? "24px" : "0",
          borderTopRightRadius: (isParallax && index > 0) ? "24px" : "0",
          boxShadow: (isParallax && index > 0) ? "0 -20px 40px rgba(0,0,0,0.15)" : "none",
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

    return (
      <div
        ref={ref}
        style={getStyles()}
        className={cn(
          "transition-shadow duration-500 w-full",
          (transition === "sticky" || transition === "parallax" || (isPinned && transition !== "normal")) && 
          "flex items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SectionWrapper.displayName = "SectionWrapper"

