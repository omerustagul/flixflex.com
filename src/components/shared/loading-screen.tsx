"use client"

import * as React from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "ff:loadingScreen:seen"
const DURATION_MS = 1800

export function LoadingScreen() {
  const [visible, setVisible] = React.useState(false)

  // Decide on mount — only first visit per session
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const seen = window.sessionStorage.getItem(STORAGE_KEY)
    if (seen) return

    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration mismatch guard
    setVisible(true)
    // Lock scroll while loader is on-screen
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const t = window.setTimeout(() => {
      setVisible(false)
      window.sessionStorage.setItem(STORAGE_KEY, "1")
      document.body.style.overflow = prev
    }, DURATION_MS)

    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="ff-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
          }}
          className={cn(
            "fixed inset-0 z-[100]",
            "bg-[#0A0A0A] text-white",
            "flex flex-col items-center justify-center gap-8"
          )}
          aria-label="FlixFlex yükleniyor"
          role="status"
        >
          {/* Background mor halka */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(161,52,255,0.22) 0%, transparent 60%)",
              filter: "blur(40px)",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-48 h-16 md:w-64 md:h-20">
              <Image
                src="/logo/flixflex-logo-purple.webp"
                alt="FlixFlex"
                fill
                priority
                className="object-contain"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                animate={{ translateX: ["100%", "-100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="relative w-56 h-px bg-white/10 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[var(--ff-purple)]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: DURATION_MS / 1000 - 0.2, ease: "easeInOut" }}
            />
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-[11px] uppercase tracking-[0.25em] text-white/40"
          >
            Hız · Güç · Esneklik
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
