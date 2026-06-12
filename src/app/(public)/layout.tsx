import NextTopLoader from "nextjs-toploader"
import { FlixFlexFooter, AppointmentModal, ParallaxProvider } from "@/components/public"
import { ThemedNavbar } from "@/components/public/navbar/themed-navbar"
import { PageTransition } from "@/components/shared/page-transition"
import { LoadingScreen } from "@/components/shared/loading-screen"
import { prisma } from "@/lib/prisma"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settingsData = prisma 
    ? await prisma.siteSetting.findMany({
        where: {
          key: { in: ["site_logo", "site_logo_white", "site_logo_height", "site_logo_mobile_height"] }
        }
      })
    : []

  const siteSettings = settingsData.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>)

  return (
    <ParallaxProvider>
      {/* Route progress bar — fills on navigation (Vercel/Linear style) */}
      <NextTopLoader
        color="#FF4FD8"
        height={2}
        showSpinner={false}
        shadow="0 0 12px #FF4FD8, 0 0 6px #FF4FD8"
        speed={300}
        easing="cubic-bezier(0.16, 1, 0.3, 1)"
        crawlSpeed={180}
      />
      <LoadingScreen
        logoUrl={siteSettings.site_logo_white || siteSettings.site_logo}
        logoHeight={siteSettings.site_logo_height ? parseInt(siteSettings.site_logo_height) : undefined}
      />
      <ThemedNavbar />
      <PageTransition>
        <main id="content" className="relative">
          {children}
        </main>
      </PageTransition>
      <FlixFlexFooter siteSettings={siteSettings} />
      <AppointmentModal />
    </ParallaxProvider>
  )
}

