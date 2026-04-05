import type { Metadata } from "next"

export const dynamic = 'force-dynamic'
 
export const metadata: Metadata = {
  title: "Personal catalog",
  description: "Browse your own catalog of movies you like.",
  alternates: {canonical: "/my-filter"},
  robots: {
    index: false,
    follow: false
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}