
# CineScope

**A personal project.**

A frontend for discovering and searching for movies using the TMDB API. Offers accounts, served by SupaBase, for managing a personal collection of them. Also includes regional featured movie lists, rich details and poster first record representation. 

Built with Next.js, Tailwind, React, zod, Shadcn, SupaBase, TMDB API.

## Features
- Separate search and discover functionalities
- Personal movie list, belonging to accounts
- Regional featured carousel and movie grid
- Results pagination
- Rich movie details

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
A live demo is available [here](https://cinescope-demo.vercel.app). It is set to US (ISO 3166-1) region. It is hosted on Vercel and Supabase.

## Notes
- **Not actively developed**
-  Featured movie selections might seem odd, as they are regional and include re-releases. 
- TMDB adult content is disabled everywhere 

## Future improvements
- Live TMDB region switching
- OAuth / OIDC
- Carousel rendering tweaks
- Carousel start/stop feature
- Personal catalog sharing

## Screenshots
![HOME](/assets/README_hero_home.jpeg)
![DISCOVER](/assets/README_discover_form.jpeg)
![QUERY](/assets/README_query.jpeg)
![DETAIL_TOP](/assets/README_detail_top.jpeg)
![DETAIL_BOTTOM](/assets/README_detail_bottom.jpeg)
![CATALOG](/assets/README_personal_catalog.jpeg)
![EMAIL](/assets/README_email_light.jpeg)
