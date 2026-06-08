"use client"

import * as React from "react"
import Lenis from "@studio-freight/lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LenisContext } from "@/hooks/use-lenis"

// Register ScrollTrigger (idempotent — safe to call multiple times)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// ═══════════════════════════════════════════════════════════
// ParallaxProvider — Lenis smooth scroll + GSAP integration
//
// Wrap your app/page with this provider to enable:
//   - Smooth scrolling via Lenis
//   - GSAP ScrollTrigger ↔ Lenis synchronization
//   - Access via `useLenis()` hook anywhere in the tree
// ═══════════════════════════════════════════════════════════

interface ParallaxProviderProps {
  children: React.ReactNode
}

export function ParallaxProvider({ children }: ParallaxProviderProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = React.useRef<any>(null)

  React.useLayoutEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return

    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Sync Lenis scroll updates with GSAP ScrollTrigger
    instance.on("scroll", () => ScrollTrigger.update())

    // Sync Lenis with GSAP Ticker for butter-smooth rendering
    const updateLenis = (time: number) => {
      instance.raf(time * 1000)
    }
    gsap.ticker.add(updateLenis)

    lenisRef.current = instance

    return () => {
      gsap.ticker.remove(updateLenis)
      instance.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
