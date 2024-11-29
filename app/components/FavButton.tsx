import { Heart } from "lucide-react";

import { Button } from "./ui/button";
import { SelectComponent } from "db/schema";
import { ComponentWithFavorites, toggleFavoriteMutation } from "~/utils/components";
import { useAuth } from "@clerk/tanstack-start";
import { cn } from "~/lib/utils";

export default function FavButton({
  component,
}: {
  component: ComponentWithFavorites;
}) {
  const { userId } = useAuth();
  const { mutate: toggleFavorite } = toggleFavoriteMutation(component.id);

  return (
    <Button variant="secondary" onClick={() => toggleFavorite()}>
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
