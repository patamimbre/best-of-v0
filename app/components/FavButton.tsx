import { Heart } from "lucide-react";

import { Button } from "./ui/button";
import { FullComponent, SelectComponent } from "~/types/database";
import { useToggleFavoriteMutation } from "~/hooks/mutations";
import { useAuth } from "@clerk/tanstack-start";
import { cn } from "~/lib/utils";
import { toast } from "sonner";

export default function FavButton({ component }: { component: FullComponent }) {
  const { userId, isSignedIn } = useAuth();
  const { mutate: toggleFavorite } = useToggleFavoriteMutation(component.id);

  const handleFavoriteClick = () => {
    if (!isSignedIn) {
      toast.info("Please sign in to favorite components");
    } else {
      toggleFavorite();
    }
  }

  return (
    <Button variant="secondary" onClick={handleFavoriteClick}>
      <Heart
        className={cn(
          userId &&
            component.favorites.some((favorite) => favorite.userId === userId) &&
            "fill-red-500 stroke-red-500",
        )}
      />
      <span>{component.favorites.length}</span>
    </Button>
  );
}
