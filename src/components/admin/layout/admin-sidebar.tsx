"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import * as Tooltip from "@radix-ui/react-tooltip"
import {
  LayoutDashboard,
  FileText,
  BriefcaseBusiness,
  SquarePen,
  Sparkles,
  Palette,
  ShieldCheck,
  Users,
  Settings,
  LogOut,
  HardDrive,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { SessionUser } from "@/lib/auth/types"

// ── Nav items ─────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Sayfalar", href: "/admin/sayfalar", icon: FileText, exact: false },
  { label: "Portfolyo", href: "/admin/portfolyo", icon: BriefcaseBusiness, exact: false },
  { label: "Hizmetler", href: "/admin/hizmetler", icon: Sparkles, exact: false },
  { label: "Blog & İçerik", href: "/admin/blog", icon: SquarePen, exact: false },
  { label: "Dosyalar", href: "/admin/medya", icon: HardDrive, exact: false },
  { label: "AI Asistan", href: "/admin/ai", icon: Sparkles, exact: false },
  { label: "Tema Ayarları", href: "/admin/theme", icon: Palette, exact: false },
  { label: "Roller & Yetkiler", href: "/admin/roller", icon: ShieldCheck, exact: false },
  { label: "Kullanıcılar", href: "/admin/kullanicilar", icon: Users, exact: false },
  { label: "Ayarlar", href: "/admin/ayarlar", icon: Settings, exact: false },
] as const

interface AdminSidebarProps {
  user: SessionUser
  siteLogo?: string
  logoHeight?: number
}

export function AdminSidebar({ user, siteLogo, logoHeight }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isHovered, setIsHovered] = React.useState(false)

  // Side effect: use isHovered as the 'expanded' state
  const collapsed = !isHovered

  function isActive(item: (typeof NAV_ITEMS)[number]): boolean {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={100}>
      <motion.nav
        aria-label="Admin navigasyonu"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "sticky top-0 h-screen z-40 w-fit shrink-0",
          "flex flex-col",
          "bg-[#0F0F1A] border-r border-[#2A2A2A]",
          "overflow-hidden"
        )}
        animate={{ width: isHovered ? 240 : 64 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Logo Section */}
        <div
          className={cn(
            "flex items-center border-b border-[var(--ff-purple)]/10",
            "h-[8vh] px-4 shrink-0",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                {siteLogo ? (
                  <Image
                    src={siteLogo}
                    alt="Logo"
                    width={160}
                    height={logoHeight || 24}
                    unoptimized
                    className="w-auto object-contain"
                    style={{ height: logoHeight || 24 }}
                  />
                ) : (
                  <span className="font-display font-extrabold text-lg tracking-tight text-white whitespace-nowrap">
                    Flix<span className="text-[var(--ff-purple)]">Flex</span>
                  </span>
                )}
              </motion.div>
            )}
            {collapsed && siteLogo && (
              <motion.img
                src={siteLogo}
                alt="Logo"
                className="w-6 h-6 object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
          <ul className="space-y-0.5 px-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item)
              const Icon = item.icon

              const linkContent = (
                <Link
                  href={item.href}
                  target={"external" in item && item.external ? "_blank" : undefined}
                  className={cn(
                    "group flex items-center gap-3 w-full",
                    "h-10 px-2.5",
                    "text-[13px] font-medium",
                    "transition-all duration-150 relative",
                    "border-l-2",
                    active
                      ? "border-l-[var(--ff-purple)] bg-[var(--ff-purple)]/10 text-[var(--ff-purple)]"
                      : "border-l-transparent text-white hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  )}
                >
                  <Icon
                    size={17}
                    className={cn(
                      "shrink-0 transition-colors duration-150",
                      active ? "text-[var(--ff-purple)]" : "text-white group-hover:text-[var(--foreground)]"
                    )}
                  />
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        key="label"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.18 }}
                        className="whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )

              if (collapsed) {
                return (
                  <li key={item.href}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        {linkContent}
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="right"
                          sideOffset={8}
                          className={cn(
                            "z-50 px-3 py-1.5",
                            "bg-[#222222] border border-[var(--border)]",
                            "text-[12px] font-medium text-white",
                            "shadow-xl",
                            "animate-ff-fadeIn"
                          )}
                        >
                          {item.label}
                          <Tooltip.Arrow className="fill-[#222222]" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </li>
                )
              }

              return <li key={item.href}>{linkContent}</li>
            })}
          </ul>
        </div>

        {/* View Site Action */}
        <div className="px-2 py-3 border-t border-[#2A2A2A] shrink-0">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link
                href="/"
                target="_blank"
                className={cn(
                  "flex items-center justify-center gap-3 w-full",
                  "h-10 px-2.5",
                  "bg-[var(--ff-purple)]/10 text-[var(--ff-purple)] hover:bg-[var(--ff-purple)] hover:text-white",
                  "transition-all duration-200 group overflow-hidden"
                )}
              >
                <ExternalLink
                  size={16}
                  className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key="view-site-label"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.18 }}
                      className="text-[13px] font-medium whitespace-nowrap"
                    >
                      Siteyi Gör
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </Tooltip.Trigger>
            {collapsed && (
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  sideOffset={8}
                  className="z-50 px-3 py-1.5 bg-[var(--ff-purple)] text-white text-[11px] font-bold shadow-xl animate-ff-fadeIn"
                >
                  Siteyi Git
                  <Tooltip.Arrow className="fill-[var(--ff-purple)]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        </div>

        {/* User profile mini-card */}
        <div className="border-t border-[#2A2A2A] p-2 shrink-0">
          <button
            type="button"
            onClick={() => router.push("/admin/profil")}
            className={cn(
              "w-full flex items-center gap-3",
              "px-2.5 h-12",
              "hover:bg-ff-purple/10",
              "transition-colors duration-150 group"
            )}
            aria-label="Profil sayfasına git"
          >
            {/* Avatar */}
            <div
              className={cn(
                "ff-shape-button shrink-0 w-7 h-7 flex items-center justify-center",
                "bg-[var(--ff-purple)] text-white",
                "text-[10px] font-bold font-display"
              )}
            >
              {user.initials}
            </div>

            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  key="user-info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex-1 text-left overflow-hidden"
                >
                  <p className="text-[12px] font-semibold text-white truncate leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-white truncate leading-tight mt-0.5">
                    {user.role}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!collapsed && (
              <LogOut
                size={13}
                className="shrink-0 text-white group-hover:text-[var(--ff-purple)] transition-colors duration-150"
              />
            )}
          </button>
        </div>
      </motion.nav>
    </Tooltip.Provider>
  )
}
