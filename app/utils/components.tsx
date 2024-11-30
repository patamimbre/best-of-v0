import { queryOptions, useQueryClient, useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { db } from "db";
import { components, favorites } from "db/schema";
import { and, count, asc, desc, eq, like, or, sql, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { match } from "ts-pattern";
import { getAuth } from "@clerk/tanstack-start/server";
import { getWebRequest } from "vinxi/http";
import { toast } from "sonner";

export const orderByOptions = [
  { name: "newest", label: "Newest" },
  { name: "oldest", label: "Oldest" },
  { name: "popular", label: "Most Popular" },
];

const orderBySchema = z.enum(
  orderByOptions.map((o) => o.name) as [string, ...string[]]
);
export const searchComponentsSchema = z.object({
  q: z.string().optional().describe("Search query"),
  orderBy: orderBySchema.optional().describe("Order by").catch("newest"),
});
type SearchParams = z.infer<typeof searchComponentsSchema>;

export const componentsQueryOptions = (params: SearchParams) =>
  queryOptions({
    queryKey: ["components", params],
    // TODO: Optimize by storing each component in the query cache individually (and then invalidate just that component on favorite toggle)
    queryFn: () => getComponents({ data: params }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

const getComponents = createServerFn()
  .validator((data?: SearchParams) => searchComponentsSchema.parse(data))
  .handler(async ({ data: { q, orderBy } }) =>
    db
      .select({
        ...getTableColumns(components),
        favoriteUserIds: sql<string[]>`json_group_array(DISTINCT ${favorites.userId})`,
        favoritesCount: sql<number>`count(DISTINCT ${favorites.id})`,
      })
      .from(components)
      .leftJoin(favorites, eq(components.id, favorites.componentId))
      .groupBy(components.id)
      .where(
        q && q.length > 0
          ? or(
              like(components.name, `%${q}%`),
              like(components.description, `%${q}%`),
              like(components.developer, `%${q}%`)
            )
          : undefined
      )
      .orderBy(
        match(orderBy)
          .with("newest", () => desc(components.createdAt))
          .with("oldest", () => asc(components.createdAt))
          .with("popular", () => desc(sql`count(DISTINCT ${favorites.id})`))
          .otherwise(() => desc(components.createdAt))
      )
  )

export type ComponentWithFavorites = Awaited<ReturnType<typeof getComponents>>[number];

const toggleFavorite = createServerFn({ method: "POST" })
  .validator((data: { componentId: string }) => z.object({ componentId: z.string() }).parse(data))
  .handler(async ({ data: { componentId } }) => {
    const { userId } = await getAuth(getWebRequest())
    if (!userId) {
      // This can happen if the user is not signed in.
      // We can just ignore the request.
    }


    const bothIdsCondition = and(
      eq(favorites.userId, userId!),
      eq(favorites.componentId, componentId)
    )

    const [{ c }] = await db.select({ c: count() }).from(favorites).where(bothIdsCondition)

    if (c > 0) {
      await db.delete(favorites).where(bothIdsCondition)
    } else {
      await db.insert(favorites).values({ userId: userId!, componentId })
    }
  });

export function toggleFavoriteMutation(componentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleFavorite({ data: { componentId } }),
    //onSuccess: () => queryClient.invalidateQueries({ queryKey: ["components", { id: componentId }] }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["components"] }),
    onError: () => {
      toast.error("Failed to toggle favorite");
    },
  });
}
