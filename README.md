
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
- Advanced discover filters (region, sorting, etc.)
- Personal movie collection (authenticated users)
- Regional featured movies carousel
- Paginated results
- Detailed movie pages with rich metadata

## Quick Start


### Core

1. Clone this repository.

2. Copy `.env.local.example` to `.env.local` and set:
   - `TMDB_API_READ_TOKEN` to your valid token

3. Install packages with `npm install`.

### Local database setup

0. Ensure Docker is running.

1. Run:

```bash
npm run db:init
```

2. Copy the local Supabase URL and Secret auth key into `.env.local` (sb_secret_...)

3. (Optional) Seed 3 users with movies into the db with:
```bash
npm run db:seed
```

### Finally

1. Start dev server with:
```bash
npm run dev
```

2. Open `http://localhost:3000`.

## Demo
A live demo is available [here](https://cinescope-demo.vercel.app). It is hosted on Vercel and Supabase.

The demo is set to the US region (ISO 3166-1) for regional movie sets.

## About
This project was built to explore full-stack development with authentication, external APIs, and modern React patterns using Next.js.

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
