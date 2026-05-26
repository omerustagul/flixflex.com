import { FlixFlexFooter } from "@/components/public"
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
    <>
      <LoadingScreen />
      <ThemedNavbar />
      <PageTransition>
        <main id="content" className="relative">
          {children}
        </main>
      </PageTransition>
      <FlixFlexFooter siteSettings={siteSettings} />
    </>
  )
}
