import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { Movie } from "./backend.d";
import MovieDetailModal from "./components/MovieDetailModal";
import Navbar from "./components/Navbar";
import PostMovieModal from "./components/PostMovieModal";
import ProfileSetup from "./components/ProfileSetup";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import HomePage from "./pages/HomePage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

function AppInner() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editMovie, setEditMovie] = useState<Movie | null>(null);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(null);
    setEditMovie(movie);
    setPostModalOpen(true);
  };

  const handleClosePost = () => {
    setPostModalOpen(false);
    setEditMovie(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onAddMovie={() => setPostModalOpen(true)} />
      <HomePage
        onMovieClick={setSelectedMovie}
        onAddMovie={() => setPostModalOpen(true)}
      />
      <MovieDetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onEdit={handleEdit}
      />
      <PostMovieModal
        open={postModalOpen}
        onClose={handleClosePost}
        editMovie={editMovie}
      />
      <ProfileSetup open={showProfileSetup} />
      <footer className="border-t border-border bg-background py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
