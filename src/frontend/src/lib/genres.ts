import { Genre } from "../backend";

export const GENRES: { value: Genre; label: string }[] = [
  { value: Genre.action, label: "Action" },
  { value: Genre.animation, label: "Animation" },
  { value: Genre.comedy, label: "Comedy" },
  { value: Genre.documentary, label: "Documentary" },
  { value: Genre.drama, label: "Drama" },
  { value: Genre.horror, label: "Horror" },
  { value: Genre.other, label: "Other" },
  { value: Genre.romance, label: "Romance" },
  { value: Genre.sciFi, label: "Sci-Fi" },
  { value: Genre.thriller, label: "Thriller" },
];

export function genreLabel(genre: Genre): string {
  return GENRES.find((g) => g.value === genre)?.label ?? genre;
}

export function genreColor(genre: Genre): string {
  const map: Record<Genre, string> = {
    [Genre.action]: "bg-red-500/20 text-red-300",
    [Genre.animation]: "bg-yellow-500/20 text-yellow-300",
    [Genre.comedy]: "bg-orange-500/20 text-orange-300",
    [Genre.documentary]: "bg-green-600/20 text-green-300",
    [Genre.drama]: "bg-purple-500/20 text-purple-300",
    [Genre.horror]: "bg-red-900/40 text-red-400",
    [Genre.other]: "bg-muted text-muted-foreground",
    [Genre.romance]: "bg-pink-500/20 text-pink-300",
    [Genre.sciFi]: "bg-cyan-500/20 text-cyan-300",
    [Genre.thriller]: "bg-amber-700/20 text-amber-300",
  };
  return map[genre] ?? "bg-muted text-muted-foreground";
}
