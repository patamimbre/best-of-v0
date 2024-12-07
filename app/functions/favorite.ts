import { db } from "@/db";
import { favorite } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { getAuth } from "@clerk/tanstack-start/server";
import { createServerFn } from "@tanstack/start";
import { and } from "drizzle-orm";
import { getWebRequest } from "vinxi/http";
import { z } from "zod";

export const toggleFavorite = createServerFn({ method: "POST" })
  .validator((data: { componentId: string }) =>
    z.object({ componentId: z.string() }).parse(data)
  )
  .handler(async ({ data: { componentId } }) => {
    const { userId } = await getAuth(getWebRequest());
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const bothIdsCondition = and(
      eq(favorite.userId, userId!),
      eq(favorite.componentId, componentId)
    );

    const alreadyFavorite = await db.query.favorite.findFirst({
      where: bothIdsCondition,
    });

    if (alreadyFavorite) {
      await db.delete(favorite).where(bothIdsCondition);
    } else {
      await db.insert(favorite).values({ userId: userId!, componentId });
    }
  });
