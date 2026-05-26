"use client"

import * as React from "react"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { Menu, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui"
import { cn } from "@/lib/utils"
import { FlixFlexLogo } from "./logo"
import { DesktopNav } from "./desktop-nav"
import { MobileMenu } from "./mobile-menu"
import { NAV_LINKS } from "./nav-data"

interface FlixFlexNavbarProps {
  siteSettings?: Record<string, string>
}

export function FlixFlexNavbar({ siteSettings = {} }: FlixFlexNavbarProps) {
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 12)
  })

  return (
    <>
      <motion.header
        initial={false}
        className={cn(
          "fixed top-0 inset-x-0 z-50",
          "transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled
            ? "bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--border)]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
          <div
            className={cn(
              "flex items-center justify-between gap-6",
              "transition-[height] duration-300",
              scrolled ? "h-14" : "h-16 md:h-20"
            )}
          >
            {/* Logo */}
            <FlixFlexLogo
              size={scrolled ? "sm" : "md"}
              logoUrl={scrolled ? siteSettings.site_logo : (siteSettings.site_logo_transparent || siteSettings.site_logo_white)}
              logoHeight={siteSettings.site_logo_height ? parseInt(siteSettings.site_logo_height) : undefined}
            />

            {/* Desktop nav */}
            <nav aria-label="Ana navigasyon" className="hidden lg:block">
              <DesktopNav links={NAV_LINKS} />
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:flex">
                <ThemeToggle />
              </div>

              <Link
                href="/iletisim"
                className={cn(
                  "ff-shape-button",
                  "group hidden md:inline-flex items-center justify-center gap-1.5",
                  "px-4 py-2 text-[11px] font-medium",
                  "bg-[var(--ff-purple)] text-white border border-[var(--ff-purple)]",
                  "hover:bg-[var(--ff-purple-hover)] hover:border-[var(--ff-purple-hover)]",
                  "hover:shadow-[0_4px_20px_rgba(161,52,255,0.4)]",
                  "transition-all duration-200"
                )}
              >
                Randevu Al
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              {/* Mobile burger */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Menüyü aç"
                aria-expanded={mobileOpen}
                className={cn(
                  "ff-shape-button lg:hidden w-9 h-9 flex items-center justify-center",
                  "border border-[var(--foreground-faint)] text-[var(--foreground-faint)]",
                  "hover:border-[var(--ff-purple)] hover:text-[var(--ff-purple)]",
                  "transition-colors duration-200"
                )}
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay menu */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={NAV_LINKS}
        siteSettings={siteSettings}
      />
    </>
  )
}
