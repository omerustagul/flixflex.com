"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ModernManifestoProps {
  leftText?: string
  mediaUrl1?: string
  mediaType1?: "video" | "image"
  mediaUrl2?: string
  mediaType2?: "video" | "image"
  mediaUrl3?: string
  mediaType3?: "video" | "image"
  rightContent?: string
  ctaLabel?: string
  ctaHref?: string
  backgroundColor?: string
  textColor?: string
  accentColor?: string
  hideMobileDock?: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 15,
    },
  },
}

export function ModernManifestoSection({
  leftText = "WE ARE [media1] BBDO WE [media2] DO BIG [media3] THINGS",
  mediaUrl1 = "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-light-looking-at-camera-34293-large.mp4",
  mediaType1 = "video",
  mediaUrl2 = "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-and-using-smartphone-40742-large.mp4",
  mediaType2 = "video",
  mediaUrl3 = "https://assets.mixkit.co/videos/preview/mixkit-waves-breaking-in-the-ocean-1527-large.mp4",
  mediaType3 = "video",
  rightContent = "<p>We solve big problems with strategy and creative that make a big impact.</p><p>We work with brands and marketers that have the biggest ambitions.</p><p>We hire big talent and bring them big opportunities that build boundless careers.</p>",
  ctaLabel = "CONTACT US",
  ctaHref = "/iletisim",
  backgroundColor = "var(--ff-purple)",
  textColor = "var(--ff-foreground)",
  accentColor = "var(--ff-accent)",
  hideMobileDock = false,
}: ModernManifestoProps) {

  // Custom theme styles using CSS custom properties for clean native hover logic
  const sectionStyle = {
    "--manifesto-bg": backgroundColor || "var(--ff-purple)",
    "--manifesto-text": textColor || "var(--ff-foreground)",
    "--manifesto-accent": accentColor || "var(--ff-accent)",
    backgroundColor: "var(--ff-purple)",
    color: "var(--ff-foreground)",
  } as React.CSSProperties

  // Render a media pill with proportionate em height and width
  const renderMediaPill = (url?: string, type?: "video" | "image") => {
    if (!url) return null
    return (
      <span className="w-[2.2em] h-[0.78em] rounded-[0.39em] mx-[0.1em] inline-flex align-middle overflow-hidden relative border border-[var(--manifesto-text)]/15 shadow-lg bg-black/10 select-none">
        {type === "video" ? (
          <video
            src={url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={url}
            alt="manifesto media"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </span>
    )
  }

  // Parse leftText to embed inline media pills dynamically
  const renderManifestoText = () => {
    if (!leftText) return null
    const parts = leftText.split(/(\[media1\]|\[media2\]|\[media3\])/g)

    return parts.map((part, index) => {
      if (part === "[media1]") {
        return <React.Fragment key={`media1-${index}`}>{renderMediaPill(mediaUrl1, mediaType1)}</React.Fragment>
      }
      if (part === "[media2]") {
        return <React.Fragment key={`media2-${index}`}>{renderMediaPill(mediaUrl2, mediaType2)}</React.Fragment>
      }
      if (part === "[media3]") {
        return <React.Fragment key={`media3-${index}`}>{renderMediaPill(mediaUrl3, mediaType3)}</React.Fragment>
      }
      return <span key={`text-${index}`}>{part}</span>
    })
  }

  return (
    <section
      style={sectionStyle}
      className={cn(
        "relative w-full overflow-hidden py-20 sm:py-28 md:py-36 lg:py-44",
        "transition-colors duration-500 ease-in-out"
      )}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start"
        >
          {/* Left Column: Huge Uppercase Bold Typography */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 flex flex-col justify-center"
          >
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[6.5vw] leading-[1.05] tracking-tight uppercase select-none">
              {renderManifestoText()}
            </h2>
          </motion.div>

          {/* Right Column: Editorial Paragraphs and CTA Button */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 flex flex-col justify-start lg:pt-4 text-left"
          >
            {rightContent && (
              <div
                className="text-[15px] sm:text-[17px] leading-relaxed opacity-90 space-y-6 font-medium max-w-lg mb-10"
                dangerouslySetInnerHTML={{ __html: rightContent }}
              />
            )}

            {ctaLabel && (
              <div>
                <a
                  href={ctaHref || "#"}
                  className={cn(
                    "inline-flex items-center justify-center px-10 py-4 rounded-full border border-[var(--manifesto-accent)]",
                    "text-[12px] font-bold tracking-widest uppercase transition-all duration-300",
                    "bg-transparent text-[var(--manifesto-text)]",
                    "hover:bg-[var(--manifesto-accent)] hover:text-[var(--manifesto-bg)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--manifesto-accent)] focus:ring-offset-2 focus:ring-offset-[var(--manifesto-bg)]"
                  )}
                >
                  {ctaLabel}
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
