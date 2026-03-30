import * as React from "react"
import ToggleInterface from "@/components/ToggleInterface"
export default function Page() {

  return (
   <>
      <WebSiteJsonLd />
      <main className="flex grow flex-col items-center justify-center gap-4">
        <h1 className="text-5xl md:text-7xl font-bold">CineScope</h1>
        <cite className="text-xl md:text-2xl">Find your next watch</cite>
        <ToggleInterface></ToggleInterface>
      </main>
     
   </>
  )
}

export async function generateMetadata() {
  const title = "CineScope — Discover movies";
  const description = "Search and discover movies with filters, ratings, and details powered by TMDB.";
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "";

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
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
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
