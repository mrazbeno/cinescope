import "server-only";

/**
 * Wrapper around fetch that adds TMDB auth token in header
 * @param input Fetch input
 * @param init Fetch init PLUS next cache revalidate
 * @returns Fetch response
 * @throws Error if TMDB_API_READ_TOKEN env var is empty
 */
export async function fetchWithTmdbApiCreds(
  input: string | URL,
  init?: RequestInit & { next?: { revalidate?: number } }
): Promise<Response> {
  const token = process.env.TMDB_API_READ_TOKEN;

  if (!token || token == "") {
    throw new Error("TMDB_API_READ_TOKEN is not configured.");
  }

  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");

  return fetch(input, {
    ...init,
    headers,
  });
}