import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Edit, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { Movie } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useDeleteMovie } from "../hooks/useQueries";
import { genreColor, genreLabel } from "../lib/genres";

const STAR_POSITIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onEdit: (movie: Movie) => void;
}

export default function MovieDetailModal({
  movie,
  onClose,
  onEdit,
}: MovieDetailModalProps) {
  const { identity } = useInternetIdentity();
  const deleteMovie = useDeleteMovie();

  if (!movie) return null;

  const isOwner =
    identity && movie.owner.toString() === identity.getPrincipal().toString();
  const rating = Number(movie.rating);
  const year = Number(movie.releaseYear);

  const handleDelete = async () => {
    try {
      await deleteMovie.mutateAsync(movie.id);
      toast.success("Movie deleted");
      onClose();
    } catch {
      toast.error("Failed to delete movie");
    }
  };

  return (
    <Dialog open={!!movie} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-2xl p-0 overflow-hidden"
        data-ocid="movie_detail.dialog"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Poster */}
          <div className="relative sm:w-56 flex-shrink-0">
            <div className="aspect-[2/3] sm:aspect-auto sm:h-full min-h-48">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary min-h-48">
                  <span className="text-5xl">🎬</span>
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/60 sm:block hidden" />
          </div>

          {/* Info */}
          <div className="flex flex-col p-6 flex-1 min-w-0">
            <DialogHeader className="mb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Badge className={`mb-2 text-xs ${genreColor(movie.genre)}`}>
                    {genreLabel(movie.genre)}
                  </Badge>
                  <DialogTitle className="font-display text-2xl font-bold leading-tight">
                    {movie.title}
                  </DialogTitle>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </DialogHeader>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-bold text-accent text-lg">{rating}</span>
                <span className="text-muted-foreground text-sm">/10</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{year}</span>
              </div>
            </div>

            {/* Stars visual */}
            <div className="flex gap-0.5 mb-4">
              {STAR_POSITIONS.map((pos) => (
                <Star
                  key={pos}
                  className={`h-3.5 w-3.5 ${
                    pos <= rating
                      ? "fill-accent text-accent"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {movie.description}
            </p>

            {/* Actions */}
            {isOwner && (
              <div className="flex gap-2 mt-6 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(movie)}
                  className="flex-1 border-border hover:bg-muted"
                  data-ocid="movie_detail.edit_button"
                >
                  <Edit className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteMovie.isPending}
                  className="flex-1"
                  data-ocid="movie_detail.delete_button"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  {deleteMovie.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
