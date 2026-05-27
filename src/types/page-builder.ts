// ═══════════════════════════════════════════════════════════
// FlixFlex — Page Builder Types & Zod Schemas
// ═══════════════════════════════════════════════════════════

import { z } from "zod"

// ── Section Type Union ────────────────────────────
export type SectionType =
  | "hero"
  | "hero-video"
  | "stats"
  | "services"
  | "portfolio"
  | "testimonials"
  | "cta"
  | "text-content"
  | "image-text"
  | "video-embed"
  | "faq"
  | "team"
  | "contact-form"
  | "manifesto"
  | "story"
  | "values"
  | "why-us"
  | "services-list"
  | "portfolio-hero"
  | "portfolio-grid"
  | "blog-hero"
  | "blog-grid"
  | "contact-hero"
  | "contact-info"
  | "portfolio-radial-gallery"
  | "portfolio-marquee-gallery"
  | "portfolio-offer-carousel"
  | "portfolio-project-showcase"
  | "portfolio-vertical-scroll"
  | "hero-animated-video"
  | "parallax"

// ── Generic Section Block ─────────────────────────
export type SectionTransition = "normal" | "sticky" | "parallax" | "overlap"

export interface SectionBlock<T = Record<string, unknown>> {
  id: string
  type: SectionType
  order: number
  visible: boolean
  props: T
  transition?: SectionTransition
  stickyPin?: boolean
  [key: string]: any // Make it JSON compatible
}

// ── Page Data ─────────────────────────────────────
export interface PageData {
  id: string
  slug: string
  title: string
  description?: string
  sections: SectionBlock[]
  status: "draft" | "published"
  updatedAt: string
}

// ── Per-type Prop Schemas ─────────────────────────

export const heroPropsSchema = z.object({
  headline: z.string().default("Güçlü Başlık"),
  subheadline: z.string().default("Açıklayıcı alt başlık metni"),
  ctaLabel: z.string().default("Hemen Başla"),
  ctaHref: z.string().default("/iletisim"),
  secondaryCtaLabel: z.string().default("Portfolyoyu Gör"),
  secondaryCtaHref: z.string().default("/portfolio"),
  backgroundVariant: z.enum(["dark", "light", "gradient"]).default("dark"),
})

export const heroVideoPropsSchema = z.object({
  headline: z.string().default("Sinematik Başlık"),
  subheadline: z.string().default("Markanızı videoyla anlatın"),
  videoUrl: z.string().default("/hero-background.mp4"),
  videoUrlMobile: z.string().default(""),
  posterUrl: z.string().default(""),
  ctaLabel: z.string().default("Projeyi Başlat"),
  ctaHref: z.string().default("/iletisim"),
  secondaryCtaLabel: z.string().default("Showreel İzle"),
  secondaryCtaHref: z.string().default("/portfolio"),
  hideMobileDock: z.boolean().default(false),
})

export const statsPropsSchema = z.object({
  headline: z.string().default("Rakamlarla FlixFlex"),
  stats: z.array(z.object({
    value: z.string().default("100+"),
    label: z.string().default("Proje"),
  })).default([
    { value: "150+", label: "Müşteri" },
    { value: "5 Yıl", label: "Deneyim" },
    { value: "%98", label: "Memnuniyet" },
  ]),
  hideMobileDock: z.boolean().default(false),
})

export const servicesPropsSchema = z.object({
  headline: z.string().default("Hizmetlerimiz"),
  subheadline: z.string().default("İşletmeniz için kapsamlı dijital çözümler"),
  showAll: z.boolean().default(false),
  hideMobileDock: z.boolean().default(false),
  services: z
    .array(
      z.object({
        id: z.string().optional(),
        slug: z.string(),
        title: z.string(),
        description: z.string(),
        iconKey: z.string().optional(),
        features: z.array(z.string()).default([]),
        parentId: z.string().nullable().optional(),
        children: z.array(z.unknown()).optional(),
      }),
    )
    .optional(),
})

export const portfolioPropsSchema = z.object({
  headline: z.string().default("Portfolyo"),
  subheadline: z.string().default("Seçkin projelerimiz"),
  filterEnabled: z.boolean().default(true),
  maxItems: z.number().int().default(6),
  hideMobileDock: z.boolean().default(false),
})

export const portfolioVerticalScrollPropsSchema = z.object({
  headline: z.string().default("Seçili İşlerimiz"),
  subheadline: z.string().default("Akıcı ve dikey formatta projelerimiz"),
  speed: z.enum(["slow", "normal", "fast"]).default("normal"),
  direction: z.enum(["left", "right"]).default("right"),
  pauseOnHover: z.boolean().default(true),
  maxItems: z.number().int().default(12),
  hideMobileDock: z.boolean().default(false),
})

export const testimonialsPropsSchema = z.object({
  headline: z.string().default("Müşterilerimiz Ne Diyor?"),
  subheadline: z.string().default("Birlikte başardıklarımız"),
  hideMobileDock: z.boolean().default(false),
})

export const ctaPropsSchema = z.object({
  eyebrow: z.string().default("— Bir Sonraki Adım —"),
  headline: z.string().default("Birlikte büyüyelim mi?"),
  description: z.string().default("Brief'ini paylaş, hemen toplanalım."),
  primaryCtaLabel: z.string().default("İletişime Geç"),
  primaryCtaHref: z.string().default("/iletisim"),
  secondaryCtaLabel: z.string().default("Portfolyoyu Gör"),
  secondaryCtaHref: z.string().default("/portfolio"),
  variant: z.enum(["dark", "light"]).default("dark"),
  hideMobileDock: z.boolean().default(false),
})

export const textContentPropsSchema = z.object({
  headline: z.string().default("Başlık"),
  body: z.string().default("İçerik metni buraya gelecek."),
  alignment: z.enum(["left", "center", "right"]).default("left"),
  maxWidthProse: z.boolean().default(true),
  hideMobileDock: z.boolean().default(false),
})

export const imageTextPropsSchema = z.object({
  headline: z.string().default("Görsel ile Metin"),
  body: z.string().default("Açıklama metni."),
  imageUrl: z.string().default(""),
  imageAlt: z.string().default("Görsel"),
  imagePosition: z.enum(["left", "right"]).default("right"),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
  hideMobileDock: z.boolean().default(false),
})

export const videoEmbedPropsSchema = z.object({
  headline: z.string().default("Video"),
  videoUrl: z.string().default("https://www.youtube.com/embed/dQw4w9WgXcQ"),
  aspectRatio: z.enum(["16/9", "4/3", "1/1"]).default("16/9"),
  autoplay: z.boolean().default(false),
  hideMobileDock: z.boolean().default(false),
})

export const faqPropsSchema = z.object({
  headline: z.string().default("Sık Sorulan Sorular"),
  subheadline: z.string().default(""),
  items: z.array(z.object({
    question: z.string().default("Soru?"),
    answer: z.string().default("Cevap."),
  })).default([
    { question: "FlixFlex ile nasıl çalışabilirim?", answer: "Bize ulaşarak brief paylaşabilirsiniz." },
    { question: "Proje süresi ne kadar?", answer: "Projeye göre değişir, ortalama 4-8 hafta." },
  ]),
  hideMobileDock: z.boolean().default(false),
})

export const teamPropsSchema = z.object({
  headline: z.string().default("Ekibimiz"),
  subheadline: z.string().default("Tutkulu profesyoneller"),
  showAll: z.boolean().default(false),
  hideMobileDock: z.boolean().default(false),
})

export const contactFormPropsSchema = z.object({
  headline: z.string().default("İletişime Geç"),
  subheadline: z.string().default("Hemen konuşalım"),
  showMap: z.boolean().default(false),
  primaryColor: z.string().default("var(--ff-purple)"),
  hideMobileDock: z.boolean().default(false),
})

export const heroAnimatedVideoPropsSchema = z.object({
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  videoSrc: z.string().optional(),
  clipPathVariant: z.enum(["inset", "circle", "none"]).optional(),
})

export const parallaxPropsSchema = z.object({
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  layers: z
    .array(
      z.object({
        imageUrl: z.string(),
        speed: z.number().min(0).max(3),
      }),
    )
    .optional(),
})

// ── Section Prop Type Inference ───────────────────
export type HeroProps = z.infer<typeof heroPropsSchema>
export type HeroVideoProps = z.infer<typeof heroVideoPropsSchema>
export type StatsProps = z.infer<typeof statsPropsSchema>
export type ServicesProps = z.infer<typeof servicesPropsSchema>
export type PortfolioProps = z.infer<typeof portfolioPropsSchema>
export type TestimonialsProps = z.infer<typeof testimonialsPropsSchema>
export type CTAProps = z.infer<typeof ctaPropsSchema>
export type TextContentProps = z.infer<typeof textContentPropsSchema>
export type ImageTextProps = z.infer<typeof imageTextPropsSchema>
export type VideoEmbedProps = z.infer<typeof videoEmbedPropsSchema>
export type FAQProps = z.infer<typeof faqPropsSchema>
export type TeamProps = z.infer<typeof teamPropsSchema>
export type ContactFormProps = z.infer<typeof contactFormPropsSchema>
export type PortfolioVerticalScrollProps = z.infer<typeof portfolioVerticalScrollPropsSchema>

// ── Schema Registry ───────────────────────────────
export const SECTION_SCHEMAS: Record<SectionType, z.ZodObject<z.ZodRawShape>> = {
  "hero": heroPropsSchema,
  "hero-video": heroVideoPropsSchema,
  "stats": statsPropsSchema,
  "services": servicesPropsSchema,
  "portfolio": portfolioPropsSchema,
  "testimonials": testimonialsPropsSchema,
  "cta": ctaPropsSchema,
  "text-content": textContentPropsSchema,
  "image-text": imageTextPropsSchema,
  "video-embed": videoEmbedPropsSchema,
  "faq": faqPropsSchema,
  "team": teamPropsSchema,
  "contact-form": contactFormPropsSchema,
  "manifesto": z.object({}),
  "story": z.object({}),
  "values": z.object({}),
  "why-us": z.object({}),
  "services-list": z.object({}),
  "portfolio-hero": z.object({}),
  "portfolio-grid": z.object({}),
  "blog-hero": z.object({}),
  "blog-grid": z.object({}),
  "contact-hero": z.object({}),
  "contact-info": z.object({}),
  "portfolio-radial-gallery": z.object({}),
  "portfolio-marquee-gallery": z.object({}),
  "portfolio-offer-carousel": z.object({}),
  "portfolio-project-showcase": z.object({}),
  "hero-animated-video": heroAnimatedVideoPropsSchema,
  "parallax": parallaxPropsSchema,
  "portfolio-vertical-scroll": portfolioVerticalScrollPropsSchema,
}
