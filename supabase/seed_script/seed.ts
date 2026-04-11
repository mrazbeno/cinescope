import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { TMDBListResponse, TMDBMovieSummary } from "@/lib/tmdbTypes"
import { MovieStateRow, WatchStatus } from "@/lib/movieStateTypes";
import { fetchWithTmdbApiCreds } from "@/lib/tmdbApi";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(projectRoot, ".env.local") });

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL).");
}

if (!SUPABASE_SECRET_KEY) {
  throw new Error("Missing SUPABASE_SECRET_KEY.");
}

if (!process.env.TMDB_API_READ_TOKEN) {
  throw new Error("Missing TMDB_API_READ_TOKEN.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

type SeedUser = {
  email: string;
  password: string;
};

type MovieStatusInsert = MovieStateRow & {
  user_id: string;
};

const DEMO_USERS: SeedUser[] = [
  { email: "demo1@local.dev", password: "Password123!" },
  { email: "demo2@local.dev", password: "Password123!" },
  { email: "demo3@local.dev", password: "Password123!" },
];

const TMDB_SEED_URLS = [
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=2",
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=3",
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=2",
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=3",
  "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
  "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=2",
  "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=3",
  "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
  "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=2",
  "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=3",
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function listAllUsers() {
  const users: Array<{ id: string; email?: string | null }> = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    users.push(...data.users.map((u) => ({ id: u.id, email: u.email })));

    if (data.users.length < perPage) break;
    page += 1;
  }

  return users;
}

async function getOrCreateUser(seedUser: SeedUser): Promise<{ id: string; email: string }> {
  const existingUsers = await listAllUsers();
  const existing = existingUsers.find(
    (u) => (u.email ?? "").toLowerCase() === seedUser.email.toLowerCase()
  );

  if (existing?.id) {
    return { id: existing.id, email: seedUser.email };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: seedUser.email,
    password: seedUser.password,
    email_confirm: true,
    user_metadata: {
      seeded: true,
      display_name: seedUser.email.split("@")[0],
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error(`Failed to create user ${seedUser.email}`);

  return { id: data.user.id, email: seedUser.email };
}

async function fetchSeedMovies(): Promise<TMDBMovieSummary[]> {
  const lists = await Promise.all(
    TMDB_SEED_URLS.map(async (url) => {
      const res = await fetchWithTmdbApiCreds(url);

      if (!res.ok) {
        throw new Error(`TMDB request failed: ${res.status} ${res.statusText}`);
      }

      const json = (await res.json()) as TMDBListResponse;
      return json.results;
    })
  );

  const merged = lists.flat();

  const deduped = new Map<number, TMDBMovieSummary>();
  for (const movie of merged) {
    deduped.set(movie.id, movie);
  }

  return [...deduped.values()];
}

function maybeCreateRelationship() {
  const statuses = Object.values(WatchStatus);

  const isFavorite = Math.random() < 0.22;
  const watchStatus = Math.random() < 0.5 ? null : pickRandom(statuses);

  if (!isFavorite && watchStatus === null) {
    return null;
  }

  return { isFavorite, watchStatus };
}

function buildMovieRowsForUser(
  userId: string,
  movies: TMDBMovieSummary[],
  count = 18
): MovieStatusInsert[] {
  const rows: MovieStatusInsert[] = [];
  const pool = shuffle(movies);
  const usedMovieIds = new Set<number>();

  let cursor = 0;

  while (rows.length < count && cursor < pool.length) {
    const movie = pool[cursor++];
    if (usedMovieIds.has(movie.id)) continue;

    const relation = maybeCreateRelationship();
    if (!relation) continue;

    usedMovieIds.add(movie.id);

    rows.push({
      user_id: userId,
      tmdb_movie_id: String(movie.id),
      is_favorite: relation.isFavorite,
      watch_status: relation.watchStatus,
      title: movie.title ?? null,
      poster_path: movie.poster_path ?? null,
      release_date: movie.release_date ?? null,
    });
  }

  return rows;
}

async function clearSeededMovieStatuses(users: Array<{ id: string }>) {
  const userIds = users.map((u) => u.id);

  const { error } = await supabase
    .from("movie_statuses")
    .delete()
    .in("user_id", userIds);

  if (error) throw error;
}

async function seedMovieStatusesForUsers(
  users: Array<{ id: string; email: string }>,
  movies: TMDBMovieSummary[]
) {
  const rows = users.flatMap((u) => buildMovieRowsForUser(u.id, movies, 50));

  const { error } = await supabase
    .from("movie_statuses")
    .upsert(rows, { onConflict: "user_id,tmdb_movie_id" });

  if (error) throw error;

  return rows.length;
}

async function main() {
  console.log("Starting local seed...");

  const users: Array<{ id: string; email: string }> = [];
  for (const seedUser of DEMO_USERS) {
    const user = await getOrCreateUser(seedUser);
    users.push(user);
  }

  console.log("Ensured demo users:");
  for (const user of users) {
    console.log(`- ${user.email} (${user.id})`);
  }

  console.log("");
  console.log("Fetching TMDB movie lists...");
  const movies = await fetchSeedMovies();

  if (movies.length === 0) {
    throw new Error("No TMDB movies fetched for seed.");
  }

  console.log(`Fetched ${movies.length} unique TMDB movies.`);

  await clearSeededMovieStatuses(users);
  const insertedCount = await seedMovieStatusesForUsers(users, movies);

  console.log("");
  console.log(`Seed complete. Inserted/upserted ${insertedCount} movie_statuses rows.`);
  console.log("");
  console.log("Demo credentials:");
  for (const demoUser of DEMO_USERS) {
    console.log(`- ${demoUser.email} / ${demoUser.password}`);
  }
}

main().catch((error) => {
  console.error("Seed failed:");
  console.error(error);
  process.exit(1);
});