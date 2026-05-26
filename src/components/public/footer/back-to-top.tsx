"use client"

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (y) => {
    setVisible(y > 600)
  })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          aria-label="Sayfanın başına dön"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.94 }}
          className={cn(
            "ff-shape-button fixed bottom-22 right-6 md:bottom-6 z-40",
            "w-11 h-11 flex items-center justify-center",
            "bg-[#A134FF] text-white",
            "shadow-[0_10px_30px_rgba(161,52,255,0.35)]",
            "hover:bg-[#8B1FE8] hover:shadow-[0_15px_40px_rgba(161,52,255,0.5)]",
            "transition-colors duration-200"
          )}
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
