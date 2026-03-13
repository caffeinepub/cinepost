import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Film } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveUserProfile } from "../hooks/useQueries";

interface ProfileSetupProps {
  open: boolean;
}

export default function ProfileSetup({ open }: ProfileSetupProps) {
  const [name, setName] = useState("");
  const saveProfile = useSaveUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success("Profile created!");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="bg-card border-border max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
              <Film className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="font-display text-center text-xl">
            Welcome to CinePost
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Choose a display name to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="display-name">Your Name</Label>
            <Input
              id="display-name"
              placeholder="e.g. Alex Cinema"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-input border-border"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80"
            disabled={!name.trim() || saveProfile.isPending}
          >
            {saveProfile.isPending ? "Saving..." : "Get Started"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
