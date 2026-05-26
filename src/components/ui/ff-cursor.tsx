"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function FFCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hover, setHover] = useState(false)
  const [label, setLabel] = useState("")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only desktop
    if (window.matchMedia("(pointer: coarse)").matches) return

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }

    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const isInteractive =
        el.tagName === "A" ||
        el.tagName === "BUTTON" ||
        el.closest("a") ||
        el.closest("button") ||
        el.getAttribute("role") === "button"

      if (isInteractive) {
        setHover(true)
        const dataLabel = el.getAttribute("data-cursor") ?? (el.closest("[data-cursor]") as HTMLElement | null)?.getAttribute("data-cursor") ?? ""
        setLabel(dataLabel)
      } else {
        setHover(false)
        setLabel("")
      }
    }

    const leave = () => setVisible(false)

    window.addEventListener("mousemove", move, { passive: true })
    window.addEventListener("mouseover", over, { passive: true })
    window.addEventListener("mouseleave", leave, { passive: true })

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseover", over)
      window.removeEventListener("mouseleave", leave)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Outer ring */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
            animate={{
              x: pos.x - (hover ? 20 : 16),
              y: pos.y - (hover ? 20 : 16),
              width: hover ? 40 : 32,
              height: hover ? 40 : 32,
              borderColor: hover ? "var(--ff-purple)" : "#ffffff",
              borderWidth: hover ? 2 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
            style={{ position: "fixed", borderStyle: "solid", borderRadius: 0 }}
          />

          {/* Inner dot */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            animate={{ x: pos.x - 2, y: pos.y - 2 }}
            transition={{ type: "spring", stiffness: 800, damping: 30 }}
            style={{
              width: 4,
              height: 4,
              backgroundColor: hover ? "var(--ff-purple)" : "#ffffff",
              position: "fixed",
              borderRadius: 0,
              mixBlendMode: "difference",
            }}
          />

          {/* Label */}
          {label && (
            <motion.div
              className="fixed pointer-events-none z-[9999]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, x: pos.x + 20, y: pos.y - 10 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "fixed",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ff-purple)",
                backgroundColor: "rgba(0,0,0,0.85)",
                padding: "4px 8px",
                border: "1px solid rgba(161,52,255,0.4)",
                borderRadius: 0,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
