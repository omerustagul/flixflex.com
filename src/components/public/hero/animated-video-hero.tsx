"use client"

import * as React from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  type MotionValue,
  useReducedMotion,
} from "framer-motion"
import MuxPlayer from "@mux/mux-player-react"
import { cn } from "@/lib/utils"

// ═══════════════════════════════════════════════════════════
// AnimatedVideoHero — Context-based scroll-driven video hero
//
// Usage:
//   <VideoHeroProvider>
//     <HeroVideo />
//     <HeroClipMask>
//       <SomeOverlay />
//     </HeroClipMask>
//     <HeroContent>
//       <h1>Title</h1>
//     </HeroContent>
//   </VideoHeroProvider>
// ═══════════════════════════════════════════════════════════

// ── Mux helper (reused pattern from hero-video.tsx) ────────
const getMuxData = (url: string) => {
  if (!url) return { playbackId: "", src: "" }

  if (url.startsWith("http")) {
    const isSigned = url.includes("token=") || url.includes("signature=")
    if (url.includes("stream.mux.com/") && !isSigned) {
      const playbackId = url
        .split("stream.mux.com/")[1]
        .split(".m3u8")[0]
        .split("?")[0]
      return { playbackId, src: "" }
    }
    return { playbackId: "", src: url }
  }

  return { playbackId: url, src: "" }
}

// ── Context ─────────────────────────────────────────────────
interface VideoHeroContextValue {
  scrollYProgress: MotionValue<number>
  containerRef: React.RefObject<HTMLDivElement | null>
}

const VideoHeroContext = React.createContext<VideoHeroContextValue | null>(null)

/**
 * Hook to access the shared scrollYProgress MotionValue within
 * any component rendered inside a VideoHeroProvider.
 */
export function useVideoHero(): VideoHeroContextValue {
  const ctx = React.useContext(VideoHeroContext)
  if (!ctx) {
    throw new Error(
      "useVideoHero must be used within a <VideoHeroProvider>",
    )
  }
  return ctx
}

// ── VideoHeroProvider ───────────────────────────────────────
interface VideoHeroProviderProps {
  children: React.ReactNode
  className?: string
  /** useScroll offset */
  offset?: any
  /** Minimum height utility class override */
  heightClass?: string
}

export function VideoHeroProvider({
  children,
  className,
  offset = ["start start", "end start"],
  heightClass = "h-[80vh] md:h-[100svh]",
}: VideoHeroProviderProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  })

  const value = React.useMemo<VideoHeroContextValue>(
    () => ({ scrollYProgress, containerRef }),
    [scrollYProgress, containerRef],
  )

  return (
    <VideoHeroContext.Provider value={value}>
      <section
        ref={containerRef}
        className={cn(
          "relative w-screen left-1/2 -translate-x-1/2 overflow-hidden bg-black",
          heightClass,
          className,
        )}
      >
        {children}
      </section>
    </VideoHeroContext.Provider>
  )
}

// ── HeroVideo (background) ──────────────────────────────────
interface HeroVideoProps {
  /** Video source URL or Mux playbackId */
  videoUrl?: string
  /** Poster image before video loads */
  posterUrl?: string
  /** Dark overlay strength 0–1 (default: 0.5) */
  overlayStrength?: number
  className?: string
}

export function HeroVideo({
  videoUrl = "/hero-background.mp4",
  posterUrl,
  overlayStrength = 0.5,
  className,
}: HeroVideoProps) {
  const { scrollYProgress } = useVideoHero()
  const shouldReduce = useReducedMotion()

  // ── Scroll-driven transforms ──────────────────────────
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const scale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    [1, 1.15, 0.9, 1],
  )
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // ── Video source detection ────────────────────────────
  const isMux =
    videoUrl.includes("mux.com") ||
    (!videoUrl.includes("/") && videoUrl.length > 10)
  const { playbackId, src } = getMuxData(videoUrl)

  return (
    <motion.div
      style={shouldReduce ? {} : { y, scale, opacity }}
      className={cn("absolute inset-0 z-0 h-full w-full", className)}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: `rgba(0,0,0,${overlayStrength})` }}
      />

      {/* Bottom gradient fade */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {/* Top gradient fade */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* Video wrapper */}
      <div className="relative h-full w-full overflow-hidden">
        {isMux || src ? (
          <MuxPlayer
            playbackId={playbackId || undefined}
            src={src || undefined}
            autoPlay
            muted
            loop
            playsInline
            poster={posterUrl}
            nohotkeys
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            streamType="on-demand"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={posterUrl}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
      </div>
    </motion.div>
  )
}

// ── HeroContent (foreground) ────────────────────────────────
interface HeroContentProps {
  children: React.ReactNode
  className?: string
}

export function HeroContent({ children, className }: HeroContentProps) {
  const { scrollYProgress } = useVideoHero()
  const shouldReduce = useReducedMotion()

  const translateY = useTransform(scrollYProgress, [0, 0.6], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, 0])

  return (
    <motion.div
      style={shouldReduce ? {} : { y: translateY, opacity }}
      className={cn(
        "relative z-20 h-full w-full flex items-center justify-center",
        "px-6 md:px-10 xl:px-16 text-center",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

// ── HeroClipMask (scroll-driven clip-path) ──────────────────
interface HeroClipMaskProps {
  children: React.ReactNode
  className?: string
  /**
   * ScrollYProgress → inset percentage range.
   * First value at scrollYProgress=0, second at scrollYProgress=1.
   * Default: [0, 35] — clip grows inward as user scrolls.
   */
  insetRange?: [number, number]
}

export function HeroClipMask({
  children,
  className,
  insetRange = [0, 35],
}: HeroClipMaskProps) {
  const { scrollYProgress } = useVideoHero()
  const shouldReduce = useReducedMotion()

  const insetY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [insetRange[0], insetRange[1], insetRange[0]],
  )
  const insetX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [insetRange[0], insetRange[1] * 0.6, insetRange[0]],
  )

  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}%)`

  return (
    <motion.div
      style={shouldReduce ? {} : { clipPath }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

// ── Namespace Export ────────────────────────────────────────
/**
 * Convenience namespace so consumers can do:
 *   <AnimatedVideoHero.Provider>
 *     <AnimatedVideoHero.Video />
 *     <AnimatedVideoHero.Content>…</AnimatedVideoHero.Content>
 *   </AnimatedVideoHero.Provider>
 */
export const AnimatedVideoHero = {
  Provider: VideoHeroProvider,
  Video: HeroVideo,
  Content: HeroContent,
  ClipMask: HeroClipMask,
} as const
