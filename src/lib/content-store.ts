import type { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"
import {
  PORTFOLIO,
  type PortfolioItem as PublicPortfolioItem,
} from "@/components/public/sections/portfolio-data"
import {
  SERVICES,
  type Service as PublicService,
} from "@/components/public/sections/services-data"

type PortfolioWithServices = Prisma.PortfolioItemGetPayload<{
  include: { services: true }
}>

type ServiceMapInput = {
  id: string
  slug: string
  title: string
  description: string | null
  body: string | null
  icon: string | null
  features: unknown
  processSteps: unknown
  deliverables: unknown
  parentId: string | null
  children?: ServiceMapInput[]
  portfolios?: PortfolioWithServices[]
}

const DEFAULT_GRADIENT = "from-[#1A1A1A] via-[#2A1A3A] to-[#3D1A5C]"
const DEFAULT_ACCENT = "var(--ff-purple)"

function asStringArray(value: unknown, fallback: string[] = []): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : fallback
}

function asSidebarItems(value: unknown): PublicPortfolioItem["sidebarItems"] {
  if (!Array.isArray(value)) return undefined
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const record = item as Record<string, unknown>
      const heading = String(record.heading ?? "").trim()
      const body = String(record.body ?? "").trim()
      return heading && body ? { heading, body } : null
    })
    .filter(Boolean) as PublicPortfolioItem["sidebarItems"]
}

function asResultStats(value: unknown): PublicPortfolioItem["resultStats"] {
  if (!Array.isArray(value)) return undefined
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const record = item as Record<string, unknown>
      const valueNumber = Number(record.value)
      const label = String(record.label ?? "").trim()
      if (!Number.isFinite(valueNumber) || !label) return null
      return {
        value: valueNumber,
        suffix: typeof record.suffix === "string" ? record.suffix : undefined,
        prefix: typeof record.prefix === "string" ? record.prefix : undefined,
        label,
        description:
          typeof record.description === "string" ? record.description : undefined,
      }
    })
    .filter(Boolean) as PublicPortfolioItem["resultStats"]
}

export function mapPortfolio(item: PortfolioWithServices): PublicPortfolioItem {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    client: item.client ?? "FlixFlex",
    clientLogo: item.clientLogo,
    year: item.year ?? new Date().getFullYear(),
    category: item.category,
    description: item.description ?? "",
    coverImage: item.coverImage,
    images: item.images,
    gradient: item.gradient || DEFAULT_GRADIENT,
    accentColor: item.accentColor || DEFAULT_ACCENT,
    tall: item.tall,
    narrativeParagraphs: asStringArray(item.narrativeParagraphs),
    sidebarItems: asSidebarItems(item.sidebarItems),
    resultStats: asResultStats(item.resultStats),
    serviceSlugs: item.services.map((service) => service.slug),
  }
}

export function mapService(item: ServiceMapInput, depth: number = 0): PublicService {
  const MAX_DEPTH = 3
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description ?? "",
    body: item.body ?? "",
    iconKey: item.icon ?? undefined,
    features: Array.isArray(item.features)
      ? item.features.filter((f): f is string => typeof f === "string")
      : [],
    processSteps: Array.isArray(item.processSteps)
      ? (item.processSteps as unknown as PublicService["processSteps"])
      : [],
    deliverables: asStringArray(item.deliverables),
    parentId: item.parentId ?? undefined,
    children: depth < MAX_DEPTH && item.children?.length
      ? item.children.map((child) => mapService(child, depth + 1))
      : [],
    subServices: depth < MAX_DEPTH && item.children?.length
      ? item.children.map((child) => ({
          label: child.title,
          href: `/hizmetler/${child.slug}`,
          iconKey: child.icon ?? "Globe",
        }))
      : [],
    relatedPortfolio: item.portfolios
      ? item.portfolios
          .filter((portfolio) => portfolio.isPublished)
          .sort((a, b) => a.order - b.order)
          .map(mapPortfolio)
      : [],
  }
}

export async function listPublishedPortfolio(): Promise<PublicPortfolioItem[]> {
  if (!prisma) return PORTFOLIO

  try {
    const rows = await prisma.portfolioItem.findMany({
      where: { isPublished: true },
      include: { services: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    })

    return rows.length ? rows.map(mapPortfolio) : PORTFOLIO
  } catch (err) {
    console.error('[listPublishedPortfolio] DB error:', err)
    return PORTFOLIO
  }
}

export async function getPublishedPortfolioBySlug(
  slug: string,
): Promise<PublicPortfolioItem | null> {
  if (!prisma) return PORTFOLIO.find((item) => item.slug === slug) ?? null

  try {
    const row = await prisma.portfolioItem.findUnique({
      where: { slug },
      include: { services: true },
    })

    if (!row || !row.isPublished) {
      return PORTFOLIO.find((item) => item.slug === slug) ?? null
    }

    return mapPortfolio(row)
  } catch (err) {
    console.error('[getPublishedPortfolioBySlug] DB error:', err)
    return PORTFOLIO.find((item) => item.slug === slug) ?? null
  }
}

export async function listPublishedServices(): Promise<PublicService[]> {
  if (!prisma) return SERVICES

  try {
    const rows = await prisma.service.findMany({
      where: { isPublished: true },
      include: {
        portfolios: { include: { services: true } },
        children: true,
        parent: { select: { id: true, title: true } },
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    })

    return rows.length ? rows.map(mapService) : SERVICES
  } catch (err) {
    console.error('[listPublishedServices] DB error:', err)
    return SERVICES
  }
}

export async function listPublishedChildServices(): Promise<PublicService[]> {
  if (!prisma) return SERVICES

  try {
    const rows = await prisma.service.findMany({
      where: { isPublished: true, parentId: { not: null } },
      include: {
        portfolios: { include: { services: true } },
        children: true,
        parent: { select: { id: true, title: true } },
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    })

    return rows.length ? rows.map(mapService) : SERVICES
  } catch (err) {
    console.error('[listPublishedChildServices] DB error:', err)
    return SERVICES
  }
}

export async function getPublishedServiceBySlug(
  slug: string,
): Promise<PublicService & { children?: PublicService[]; parentId?: string | null } | null> {
  if (!prisma) return SERVICES.find((item) => item.slug === slug) ?? null

  try {
    const row = await prisma.service.findUnique({
      where: { slug },
      include: {
        portfolios: { include: { services: true } },
        children: {
      where: { isPublished: true },
          include: {
            portfolios: { include: { services: true } },
          },
          orderBy: { order: "asc" },
        },
        parent: { select: { id: true, title: true } },
      },
    })

    if (!row || !row.isPublished) {
      return SERVICES.find((item) => item.slug === slug) ?? null
    }

    const service = mapService(row)
    return {
      ...service,
      parentId: row.parentId,
      children: row.children.length > 0 ? row.children.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        description: c.description ?? "",
        body: c.body ?? "",
        iconKey: c.icon,
        features: c.features,
        processSteps: Array.isArray(c.processSteps) ? (c.processSteps as unknown as PublicService["processSteps"]) : [],
        deliverables: c.deliverables,
        relatedPortfolio: c.portfolios
          .filter((p) => p.isPublished)
          .sort((a, b) => a.order - b.order)
          .map(mapPortfolio),
      })) : undefined,
    }
  } catch (err) {
    console.error('[getPublishedServiceBySlug] DB error:', err)
    return SERVICES.find((item) => item.slug === slug) ?? null
  }
}
