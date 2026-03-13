import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Film, Plus, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Genre } from "../backend";
import type { Movie } from "../backend.d";
import MovieCard from "../components/MovieCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSearchMovies } from "../hooks/useQueries";
import { GENRES } from "../lib/genres";

const SKELETON_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h",
  "sk-i",
  "sk-j",
  "sk-k",
  "sk-l",
];

interface HomePageProps {
  onMovieClick: (movie: Movie) => void;
  onAddMovie: () => void;
}

type GenreFilter = "all" | Genre;

const SAMPLE_MOVIES: Movie[] = [
  {
    id: BigInt(1),
    title: "The Grand Illusion",
    description:
      "A masterpiece of humanist cinema set during World War I, exploring class, nationality, and the bonds that transcend war.",
    genre: Genre.drama,
    releaseYear: BigInt(1937),
    rating: BigInt(9),
    posterUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    owner: {
      toString: () => "",
      toText: () => "",
      toUint8Array: () => new Uint8Array(),
      compareTo: () => "eq",
      isAnonymous: () => true,
      _isPrincipal: true,
    } as any,
    createdAt: BigInt(0),
  },
  {
    id: BigInt(2),
    title: "Neon Horizons",
    description:
      "In a near-future megacity, a rogue AI hunts the last human memory archivist through neon-soaked alleyways.",
    genre: Genre.sciFi,
    releaseYear: BigInt(2023),
    rating: BigInt(8),
    posterUrl:
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&q=80",
    owner: {
      toString: () => "",
      toText: () => "",
      toUint8Array: () => new Uint8Array(),
      compareTo: () => "eq",
      isAnonymous: () => true,
      _isPrincipal: true,
    } as any,
    createdAt: BigInt(0),
  },
  {
    id: BigInt(3),
    title: "The Last Laugh",
    description:
      "A retired stand-up comedian discovers his old jokes have been stolen — and decides to steal them back.",
    genre: Genre.comedy,
    releaseYear: BigInt(2022),
    rating: BigInt(7),
    posterUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    owner: {
      toString: () => "",
      toText: () => "",
      toUint8Array: () => new Uint8Array(),
      compareTo: () => "eq",
      isAnonymous: () => true,
      _isPrincipal: true,
    } as any,
    createdAt: BigInt(0),
  },
  {
    id: BigInt(4),
    title: "Crimson Tide Rising",
    description:
      "A relentless thriller that follows a marine biologist who uncovers a government conspiracy hiding beneath the ocean.",
    genre: Genre.thriller,
    releaseYear: BigInt(2021),
    rating: BigInt(8),
    posterUrl:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80",
    owner: {
      toString: () => "",
      toText: () => "",
      toUint8Array: () => new Uint8Array(),
      compareTo: () => "eq",
      isAnonymous: () => true,
      _isPrincipal: true,
    } as any,
    createdAt: BigInt(0),
  },
  {
    id: BigInt(5),
    title: "Shadowlands",
    description:
      "Deep in rural Appalachia, a documentary crew films locals with haunting memories they cannot explain.",
    genre: Genre.horror,
    releaseYear: BigInt(2020),
    rating: BigInt(7),
    posterUrl:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80",
    owner: {
      toString: () => "",
      toText: () => "",
      toUint8Array: () => new Uint8Array(),
      compareTo: () => "eq",
      isAnonymous: () => true,
      _isPrincipal: true,
    } as any,
    createdAt: BigInt(0),
  },
  {
    id: BigInt(6),
    title: "Earth Unfiltered",
    description:
      "An astonishing environmental documentary capturing untouched wilderness and the communities fighting to preserve it.",
    genre: Genre.documentary,
    releaseYear: BigInt(2023),
    rating: BigInt(9),
    posterUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80",
    owner: {
      toString: () => "",
      toText: () => "",
      toUint8Array: () => new Uint8Array(),
      compareTo: () => "eq",
      isAnonymous: () => true,
      _isPrincipal: true,
    } as any,
    createdAt: BigInt(0),
  },
];

export default function HomePage({ onMovieClick, onAddMovie }: HomePageProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState<GenreFilter>("all");
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data: movies, isLoading, isError } = useSearchMovies(debouncedSearch);

  const allMovies =
    movies && movies.length > 0 ? movies : !isLoading ? SAMPLE_MOVIES : [];

  const filteredMovies =
    genreFilter === "all"
      ? allMovies
      : allMovies.filter((m) => m.genre === genreFilter);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden film-grain">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/cinepost-hero-bg.dim_1600x600.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-accent/80 font-medium tracking-widest text-sm uppercase mb-3">
              Your Cinematic Universe
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 leading-tight">
              Cine<span className="text-primary">Post</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-8">
              Discover, share, and celebrate films that move you.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-md mx-auto"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card/80 backdrop-blur border-border focus:border-primary/50 h-11"
              data-ocid="home.search_input"
            />
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Genre filters + Add button */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setGenreFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              genreFilter === "all"
                ? "bg-primary/20 border-primary/50 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
            }`}
            data-ocid="genre.tab"
          >
            All
          </button>
          {GENRES.map((g) => (
            <button
              type="button"
              key={g.value}
              onClick={() => setGenreFilter(g.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                genreFilter === g.value
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="genre.tab"
            >
              {g.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            {isAuthenticated && (
              <Button
                onClick={onAddMovie}
                size="sm"
                className="sm:hidden bg-primary hover:bg-primary/80 text-primary-foreground"
                data-ocid="home.add_movie_button"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>

        {/* States */}
        {isLoading ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            data-ocid="movie.loading_state"
          >
            {SKELETON_KEYS.map((key) => (
              <div
                key={key}
                className="aspect-[2/3] rounded-xl bg-card border border-border animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="movie.error_state"
          >
            <SlidersHorizontal className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">
              Failed to load movies. Please try again.
            </p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="movie.empty_state"
          >
            <Film className="h-14 w-14 text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-xl text-muted-foreground mb-2">
              No movies found
            </h3>
            <p className="text-muted-foreground/60 text-sm max-w-xs">
              {debouncedSearch
                ? `No results for "${debouncedSearch}"`
                : "Be the first to post a movie!"}
            </p>
            {isAuthenticated && (
              <Button
                onClick={onAddMovie}
                className="mt-6 bg-primary hover:bg-primary/80"
                data-ocid="home.add_movie_button"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Post a Movie
              </Button>
            )}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {filteredMovies.map((movie, idx) => (
              <motion.div
                key={String(movie.id)}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
              >
                <MovieCard
                  movie={movie}
                  index={idx + 1}
                  onClick={onMovieClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
