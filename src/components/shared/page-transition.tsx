"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{    opacity: 0, y: -12 }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className={cn("min-h-screen", className)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
