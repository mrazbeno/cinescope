import * as React from "react"
import ToggleInterface from "@/components/forms/ToggleInterface"
import Link from "next/link";

const GITHUB_URL: string = "https://github.com/mrazbeno/cinescope"
const IS_DEMO: boolean = process.env.NEXT_PUBLIC_IS_LIVE_DEMO == "TRUE"

export default function Page() {

  return (
    <>
      <WebSiteJsonLd />
      <main className="flex grow flex-col items-center justify-center gap-4">
        <h1 className="text-5xl md:text-7xl font-bold">CineScope</h1>
        <cite className="text-xl md:text-2xl">Find your next watch</cite>
        <ToggleInterface></ToggleInterface>
      </main>

      {IS_DEMO && (
        <footer className="w-full h-1/30 min-h-content border-t border-border/50">
          <div className="max-w-7xl mx-auto flex flex-row justify-center items-center h-full text-sm text-muted-foreground">
            <p>This is a small live demo of my project on <Link target="_blank" className="underline" href={GITHUB_URL}>Github</Link>. </p>
          </div>
        </footer>
      )}
    </>
  )
}

export async function generateMetadata() {
  const title = "CineScope — Discover movies";
  const description = "Search and discover movies with filters, ratings, and details powered by TMDB.";
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return {
    title,
    description,
    alternates: { canonical: url || "/" },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "CineScope",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function WebSiteJsonLd() {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const json = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CineScope",
    "url": base || undefined,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${base}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );


}
