import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Link as LinkIcon, Loader2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, Genre } from "../backend";
import type { Movie } from "../backend.d";
import { useCreateMovie, useUpdateMovie } from "../hooks/useQueries";
import { GENRES } from "../lib/genres";

interface PostMovieModalProps {
  open: boolean;
  onClose: () => void;
  editMovie?: Movie | null;
}

const DEFAULT_FORM = {
  title: "",
  description: "",
  genre: Genre.drama,
  releaseYear: new Date().getFullYear(),
  rating: 7,
  posterUrl: "",
};

export default function PostMovieModal({
  open,
  onClose,
  editMovie,
}: PostMovieModalProps) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlMode, setUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();
  const isEdit = !!editMovie;

  useEffect(() => {
    if (editMovie) {
      setForm({
        title: editMovie.title,
        description: editMovie.description,
        genre: editMovie.genre,
        releaseYear: Number(editMovie.releaseYear),
        rating: Number(editMovie.rating),
        posterUrl: editMovie.posterUrl,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setUrlMode(false);
  }, [editMovie]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((p) => {
        setUploadProgress(p);
      });
      const url = blob.getDirectURL();
      await blob.getBytes();
      setForm((f) => ({ ...f, posterUrl: url }));
      toast.success("Poster uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      if (isEdit && editMovie) {
        await updateMovie.mutateAsync({
          id: editMovie.id,
          title: form.title,
          description: form.description,
          genre: form.genre,
          releaseYear: BigInt(form.releaseYear),
          rating: BigInt(form.rating),
          posterUrl: form.posterUrl,
        });
        toast.success("Movie updated!");
      } else {
        await createMovie.mutateAsync({
          title: form.title,
          description: form.description,
          genre: form.genre,
          releaseYear: BigInt(form.releaseYear),
          rating: BigInt(form.rating),
          posterUrl: form.posterUrl,
        });
        toast.success("Movie posted!");
      }
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update movie" : "Failed to post movie");
    }
  };

  const isPending = createMovie.isPending || updateMovie.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="post_movie.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit Movie" : "Post a Movie"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="movie-title">Title *</Label>
            <Input
              id="movie-title"
              placeholder="Movie title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="bg-input border-border"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="movie-description">Description</Label>
            <Textarea
              id="movie-description"
              placeholder="Brief synopsis or your thoughts..."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="bg-input border-border resize-none h-20"
            />
          </div>

          {/* Genre + Year row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Genre</Label>
              <Select
                value={form.genre}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, genre: v as Genre }))
                }
              >
                <SelectTrigger
                  className="bg-input border-border"
                  data-ocid="post_movie.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {GENRES.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="release-year">Release Year</Label>
              <Input
                id="release-year"
                type="number"
                min={1888}
                max={2030}
                value={form.releaseYear}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    releaseYear: Number(e.target.value),
                  }))
                }
                className="bg-input border-border"
              />
            </div>
          </div>

          {/* Rating slider */}
          <div className="space-y-2">
            <Label>
              Rating:{" "}
              <span className="text-accent font-bold">{form.rating}/10</span>
            </Label>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[form.rating]}
              onValueChange={([v]) => setForm((f) => ({ ...f, rating: v }))}
              className="[&_[role=slider]]:bg-accent"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          {/* Poster */}
          <div className="space-y-2">
            <Label>Poster Image</Label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setUrlMode(false)}
                className={`text-xs px-3 py-1 rounded-full transition-colors border ${
                  !urlMode
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUrlMode(true)}
                className={`text-xs px-3 py-1 rounded-full transition-colors border ${
                  urlMode
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Paste URL
              </button>
            </div>

            {urlMode ? (
              <div className="flex gap-2 items-center">
                <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  placeholder="https://example.com/poster.jpg"
                  value={form.posterUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, posterUrl: e.target.value }))
                  }
                  className="bg-input border-border"
                />
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors disabled:opacity-50"
                  data-ocid="post_movie.upload_button"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading {uploadProgress}%...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {form.posterUrl ? "Change poster" : "Upload poster image"}
                    </>
                  )}
                </button>
                {form.posterUrl && !urlMode && (
                  <p className="mt-1 text-xs text-muted-foreground truncate">
                    ✓ {form.posterUrl}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border"
              data-ocid="post_movie.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !form.title.trim()}
              className="bg-primary hover:bg-primary/80"
              data-ocid="post_movie.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  {isEdit ? "Updating..." : "Posting..."}
                </>
              ) : isEdit ? (
                "Update Movie"
              ) : (
                "Post Movie"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
