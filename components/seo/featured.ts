import type { Metadata } from "next";

export function featuredMetadata(title: string): Metadata {
  const pageTitle = `${title} Movies`;
  const description = `Browse the top ${title.toLowerCase()} movies with ratings, casts, and details.`;
  const urlBase = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const canonical = `${urlBase}/featured/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"))}`;

  return {
    title: pageTitle,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: pageTitle,
      description,
      siteName: "CineScope - Movie Explorer",
      url: canonical,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      creator: "",
    },
  };
}
