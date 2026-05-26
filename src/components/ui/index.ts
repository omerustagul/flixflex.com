// ═══════════════════════════════════════════════════════════
// FlixFlex UI Component Library — Barrel Export
// ═══════════════════════════════════════════════════════════

// ── Core FlixFlex Components ─────────────────────
export { FFButton }             from "./ff-button"
export type { FFButtonProps }   from "./ff-button"

export { FFContainer, FFCard, FFSection } from "./ff-container"
export type { FFContainerProps, FFCardProps } from "./ff-container"

export { FFBadge }              from "./ff-badge"
export type { FFBadgeProps }    from "./ff-badge"

export { FFInput, FFTextarea }  from "./ff-input"
export type { FFInputProps, FFTextareaProps } from "./ff-input"

export {
  FFSelect,
  FFSelectItem,
  FFSelectGroup,
  FFSelectLabel,
  FFSelectSeparator,
} from "./ff-select"
export type { FFSelectProps } from "./ff-select"

export { FFDivider }            from "./ff-divider"
export { FFStatCounter }        from "./ff-stat-counter"
export { FFMarquee, MarqueeTag } from "./ff-marquee"
export { FFCursor }             from "./ff-cursor"
export { FFSlider }             from "./ff-slider"

// ── Theme ─────────────────────────────────────────
export { ThemeToggle }          from "./theme-toggle"

// ── Animation Components ─────────────────────────
export { BackgroundPaths }      from "./background-paths"
export {
  AnimatedHeading,
  AnimatedWords,
  RotatingText,
  FadeInText,
}                               from "./animated-text"

// ── 21st.dev Adapted ─────────────────────────────
export { TestimonialCarousel }  from "./testimonial"
export type { Testimonial }     from "./testimonial"

export { ContainerScroll }      from "./container-scroll-animation"

// ── Interaction Components ───────────────────────
export { TiltCard }             from "./tilt-card"
export type { TiltCardProps }   from "./tilt-card"
