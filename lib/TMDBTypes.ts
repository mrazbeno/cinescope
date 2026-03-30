import { type Option } from "../components/util/ComboBoxField";

export const sortByOptions: Option[] = [
    { value: "popularity.asc", label: "Popularity (Lowest → Highest)" },
    { value: "popularity.desc", label: "Popularity (Highest → Lowest)" },

    { value: "release_date.asc", label: "Release Date (Oldest → Newest)" },
    { value: "release_date.desc", label: "Release Date (Newest → Oldest)" },

    { value: "revenue.asc", label: "Revenue (Lowest → Highest)" },
    { value: "revenue.desc", label: "Revenue (Highest → Lowest)" },

    { value: "primary_release_date.asc", label: "Primary Release Date (Oldest → Newest)" },
    { value: "primary_release_date.desc", label: "Primary Release Date (Newest → Oldest)" },

    { value: "original_title.asc", label: "Title (A → Z)" },
    { value: "original_title.desc", label: "Title (Z → A)" },

    { value: "vote_average.asc", label: "Average Rating (Lowest → Highest)" },
    { value: "vote_average.desc", label: "Average Rating (Highest → Lowest)" },

    { value: "vote_count.asc", label: "Vote Count (Lowest → Highest)" },
    { value: "vote_count.desc", label: "Vote Count (Highest → Lowest)" },
]


export interface TMDBMovieSummary {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBListResponse {
  page: number;
  results: TMDBMovieSummary[];
  total_pages: number;
  total_results: number;
}


export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDMSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TMDBMovieDetail {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: string | null;
  budget: number;
  genres: TMDBGenre[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: TMDBProductionCompany[];
  production_countries: TMDBProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: TMDMSpokenLanguage[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// Credits
export interface TMDBCastMember {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  character: string;
  order: number;
  popularity: number;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  original_name?: string;
  profile_path: string | null;
  job: string;
  department: string;
}

export interface TMDBMovieCreditsResponse {
  id: number;
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}
