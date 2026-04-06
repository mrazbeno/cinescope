import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/common/Providers"
import FeaturedCarousel from "@/components/carousel/FeaturedCarousel"
import type { Metadata } from "next"
import HeaderBar from "@/components/common/HeaderBar"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: { default: "CineScope - Movie Explorer", template: "%s | CineScope" },
  description: "Discover details, casts and ratings for your favourite movies.",

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    siteName: "CineScope - Movie Explorer",
    locale: "en_US",
    images: ["/seo/og-main.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/seo/og-main.jpeg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-US" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        className={`${geist.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <div className="relative flex items-center flex-col md:flex-row justify-center h-svh w-svw">
          <aside className="relative hidden lg:flex h-full pl-3 gap-3">
            <FeaturedCarousel
              labelText="Most popular"
              url="https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
              posterCount={20}
              isDirForward
            />
            <FeaturedCarousel
              labelText="Top rated"
              url="https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1"
              posterCount={20}
              isDirForward={false} />

          </aside>
          <div className="relative grow h-full min-h-0 overflow-y-auto flex flex-col items-center justify-center w-full">
            <Providers>
              <HeaderBar />
              {children}
            </Providers>
          </div>
          <aside className="relative hidden lg:flex h-full pr-3 gap-3">
            <FeaturedCarousel
              labelText="Upcoming"
              url="https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1"
              posterCount={20}
              isDirForward={false}
            />
            <FeaturedCarousel
              labelText="Now playing"
              url="https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1"
              posterCount={20}
              isDirForward
            />
          </aside>
        </div>

        <div className="fixed -z-10 h-full w-full top-0 left-0 bg-[#0f172a] hidden dark:block">
          <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_10%,rgba(255,255,255,0)_40%,rgba(42,22,97,1)_100%)]"></div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
