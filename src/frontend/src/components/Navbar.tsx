import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Film, Loader2, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

interface NavbarProps {
  onAddMovie: () => void;
}

export default function Navbar({ onAddMovie }: NavbarProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const { data: userProfile } = useGetCallerUserProfile();
  const [_loggingOut, setLoggingOut] = useState(false);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      if (error.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await clear();
    queryClient.clear();
    setLoggingOut(false);
  };

  const initials = userProfile?.name
    ? userProfile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2.5 group"
          data-ocid="nav.link"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 border border-primary/30 group-hover:bg-primary/30 transition-colors">
            <Film className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Cine<span className="text-primary">Post</span>
          </span>
        </a>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Button
              onClick={onAddMovie}
              size="sm"
              className="hidden sm:flex bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary font-medium"
              data-ocid="home.add_movie_button"
            >
              + Add Movie
            </Button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {userProfile?.name ? initials : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              {userProfile?.name && (
                <span className="hidden md:block text-sm text-muted-foreground">
                  {userProfile.name}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
                data-ocid="nav.logout_button"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-1.5">Logout</span>
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              size="sm"
              className="bg-primary hover:bg-primary/80 text-primary-foreground"
              data-ocid="nav.login_button"
            >
              {isLoggingIn ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <LogIn className="h-4 w-4 mr-1.5" />
              )}
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
