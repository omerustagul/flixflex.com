export interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Hizmetler",
    links: [
      { label: "Marka Stratejisi",    href: "/hizmetler/marka-stratejisi" },
      { label: "Performans Reklamı",  href: "/hizmetler/performans-reklami" },
      { label: "Web & UX Tasarım",    href: "/hizmetler/web-tasarim" },
      { label: "İçerik & Yaratıcılık", href: "/hizmetler/icerik" },
    ],
  },
  {
    title: "Keşfet",
    links: [
      { label: "İşlerimiz",   href: "/isler"      },
      { label: "Blog",         href: "/blog"       },
      { label: "Hakkımızda",   href: "/hakkimizda" },
      { label: "Kariyer",      href: "/kariyer"    },
    ],
  },
  {
    title: "İletişim",
    links: [
      { label: "Brief Başlat",        href: "/iletisim?type=brief" },
      { label: "Bizimle Çalış",        href: "/iletisim?type=partner" },
      { label: "Basın & PR",            href: "/iletisim?type=press" },
      { label: "Genel Sorular",         href: "/iletisim"             },
    ],
  },
  {
    title: "Yasal",
    links: [
      { label: "Gizlilik Politikası",   href: "/yasal/gizlilik" },
      { label: "Kullanım Şartları",     href: "/yasal/kullanim" },
      { label: "Çerez Tercihleri",      href: "/yasal/cerezler"  },
      { label: "KVKK",                   href: "/yasal/kvkk"      },
    ],
  },
]

export interface SocialLink {
  label: string
  href:  string
  icon:  "instagram" | "linkedin" | "x" | "youtube" | "behance"
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com/flixflex", icon: "instagram" },
  { label: "LinkedIn",  href: "https://linkedin.com/company/flixflex", icon: "linkedin" },
  { label: "X",         href: "https://x.com/flixflex",          icon: "x" },
  { label: "YouTube",   href: "https://youtube.com/@flixflex",   icon: "youtube" },
  { label: "Behance",   href: "https://behance.net/flixflex",    icon: "behance" },
]
