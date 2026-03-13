import { Badge } from "@/components/ui/badge";
import { Calendar, Star } from "lucide-react";
import type { Movie } from "../backend.d";
import { genreColor, genreLabel } from "../lib/genres";

interface MovieCardProps {
  movie: Movie;
  index: number;
  onClick: (movie: Movie) => void;
}

export default function MovieCard({ movie, index, onClick }: MovieCardProps) {
  const rating = Number(movie.rating);
  const year = Number(movie.releaseYear);

  return (
    <button
      type="button"
      className="movie-card relative w-full overflow-hidden rounded-xl border border-border bg-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      onClick={() => onClick(movie)}
      data-ocid={`movie.item.${index}`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="poster-img h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <span className="font-display text-4xl text-muted-foreground/30">
              🎬
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="poster-overlay absolute inset-0" />

        {/* Rating badge top-right */}
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm px-2 py-0.5 border border-accent/30">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <span className="text-xs font-bold text-accent">{rating}</span>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <Badge
            className={`mb-1.5 text-xs px-2 py-0.5 border-0 ${genreColor(movie.genre)}`}
          >
            {genreLabel(movie.genre)}
          </Badge>
          <h3 className="font-display text-sm font-semibold text-white leading-tight line-clamp-2">
            {movie.title}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-white/70">
            <Calendar className="h-3 w-3" />
            <span>{year}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
