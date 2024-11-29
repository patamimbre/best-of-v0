import { Heart } from "lucide-react";

import { Button } from "./ui/button";
import { SelectComponent } from "db/schema";
import { ComponentWithFavorites, toggleFavoriteMutation } from "~/utils/components";
import { useAuth } from "@clerk/tanstack-start";
import { cn } from "~/lib/utils";
import { toast } from "sonner";

export default function FavButton({
  component,
}: {
  component: ComponentWithFavorites;
}) {
  const { userId, isSignedIn } = useAuth();
  const { mutate: toggleFavorite } = toggleFavoriteMutation(component.id);

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
            component.favoriteUserIds.includes(userId) &&
            "fill-red-500 stroke-red-500",
        )}
      />
      <span>{component.favoritesCount}</span>
    </Button>
  );
}
