"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ease } from "@/lib/animations"

interface GalleryProps {
  gradient: string
  accentColor: string
  title: string
}

// Asymmetric layout: 2 tall left + 2 small right stacked + 1 wide bottom-right + 1 wide bottom-left
const GALLERY_BLOCKS = [
  { id: 1, className: "col-span-2 row-span-2 md:col-span-2 md:row-span-2" },
  { id: 2, className: "col-span-2 row-span-1 md:col-span-1 md:row-span-1" },
  { id: 3, className: "col-span-2 row-span-1 md:col-span-1 md:row-span-1" },
  { id: 4, className: "col-span-2 row-span-1 md:col-span-2 md:row-span-1" },
  { id: 5, className: "col-span-2 row-span-1 md:col-span-1 md:row-span-1" },
  { id: 6, className: "col-span-2 row-span-1 md:col-span-1 md:row-span-1" },
]

// Slight gradient variation per block
const OPACITY_VARIANTS = [1, 0.82, 0.68, 0.9, 0.6, 0.75]

export function ProjectGallery({ gradient, accentColor, title }: GalleryProps) {
  return (
    <div
      className="grid grid-cols-4 md:grid-cols-4 gap-3 md:gap-4"
      style={{ gridAutoRows: "160px" }}
    >
      {GALLERY_BLOCKS.map((block, i) => (
        <motion.div
          key={block.id}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.07, ease: ease.smooth }}
          className={cn(
            "ff-shape-container relative overflow-hidden border border-[var(--border)]",
            "hover:border-[rgba(255, 79, 216,0.4)] transition-colors duration-300",
            block.className
          )}
          style={{ opacity: OPACITY_VARIANTS[i] }}
        >
          {/* Gradient fill */}
          <div
            className={cn("absolute inset-0 bg-gradient-to-br", gradient)}
            style={{ opacity: 0.85 + i * 0.025 }}
          />

          {/* Grid overlay */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Watermark text */}
          <div className="absolute inset-0 flex items-center justify-center p-4 select-none pointer-events-none">
            <p
              className="font-display font-extrabold text-center leading-none tracking-tighter opacity-[0.12]"
              style={{
                color: accentColor,
                fontSize: "clamp(20px, 4vw, 48px)",
              }}
            >
              {title.toUpperCase()}
            </p>
          </div>

          {/* Block number label */}
          <span className="absolute bottom-2 right-3 text-[9px] font-mono tracking-[0.2em] text-white/20 uppercase">
            {String(block.id).padStart(2, "0")}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
