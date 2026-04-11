
# CineScope

A movie discovery and search app powered by the TMDB API.  

Users can create accounts (via Supabase) to manage a personal movie collection, explore regional featured lists, and view rich movie details.

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS + shadcn/ui
- Supabase (Auth + Database)
- Zod (validation)
- TMDB API

## Features
   - Movie search with debounced queries
   - Discover browsing with advanced filters and sorting
   - Regional featured movie sections
   - Paginated search and discover results
   - Detailed movie pages with rich metadata
   - Authenticated personal catalog for saving favorites and watch statuses
   - Email-based authentication flow via Supabase

## Quick Start

### Prerequisites
   - Node.js installed
   - Docker running locally

### Environment setup

1. Clone this repository.

2. Copy `.env.local.example` to `.env.local` and set:
   - `TMDB_API_READ_TOKEN` to your valid token

3. Install packages with `npm install`.

### Local database setup

1. Initialize the local Supabase environment:

```bash
npm run db:init
```

2. Copy the generated local Supabase URL and secret auth key into `.env.local`.

3. (Optional) Seed the database with sample users and movie entries:
```bash
npm run db:seed
```

### Run the app

1. Start the development server:
```bash
npm run dev
```

2. Then open: `http://localhost:3000`.

## Demo
A live demo is available [here](https://cinescope-demo.vercel.app). It is hosted on Vercel and Supabase.

The demo is set to the US region (ISO 3166-1) for regional movie sets.

## About
This project was built as a full-stack movie app combining TMDB-powered discovery, authenticated personal catalog features, and SEO-friendly public pages, while also exploring SEO patterns and content discoverability in Next.js.

## Status
This project is feature-complete and no longer actively developed.

## Screenshots
![HOME](/assets/README_hero_home.jpeg)
![DISCOVER](/assets/README_discover_form.jpeg)
![QUERY](/assets/README_query.jpeg)
![DETAIL_TOP](/assets/README_detail_top.jpeg)
![DETAIL_BOTTOM](/assets/README_detail_bottom.jpeg)
![CATALOG](/assets/README_personal_catalog.jpeg)
![EMAIL](/assets/README_email_light.jpeg)