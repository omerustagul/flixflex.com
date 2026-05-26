"use client"

import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { cn } from "@/lib/utils"
import { ProjectGallery } from "@/components/public/portfolio/gallery"
import type { PortfolioItem } from "@/components/public"

interface ProjectGallerySectionProps {
  project: PortfolioItem
}

export function ProjectGallerySection({ project }: ProjectGallerySectionProps) {
  return (
    <section
      className={cn(
        "relative bg-[var(--surface)] text-[var(--foreground)]",
        "py-20 md:py-28 overflow-hidden border-y border-[var(--border)]"
      )}
    >
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12"
        >
          <motion.p
            variants={fadeInUp}
            className="text-[11px] font-semibold text-[var(--ff-purple)] mb-3"
          >
            — Görsel Galeri —
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-2xl md:text-4xl font-extrabold leading-tight tracking-tight"
          >
            Projeye yakından{" "}
            <span className="text-[var(--ff-purple)]">bakın.</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-3 text-[var(--foreground-muted)] text-base max-w-xl leading-relaxed"
          >
            Süreç boyunca üretilen çalışmalardan seçili kareler.
          </motion.p>
        </motion.div>

        <ProjectGallery
          gradient={project.gradient}
          accentColor={project.accentColor}
          title={project.title}
        />
      </div>
    </section>
  )
}
