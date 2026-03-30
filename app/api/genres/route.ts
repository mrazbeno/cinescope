// pages/api/movies.ts
export async function GET(req: Request) {
  try {
    const url = "https://api.themoviedb.org/3/genre/movie/list";
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN ?? ""}`,
        "Content-Type": "application/json;charset=utf-8",
      },
      // cache on the server for one day
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch genres" }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch genres" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}