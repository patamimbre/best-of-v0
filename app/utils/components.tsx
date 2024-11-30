import {
  queryOptions,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { db } from "db";
import { components, favorites, SelectComponent } from "db/schema";
import {
  and,
  count,
  asc,
  desc,
  eq,
  like,
  or,
  sql,
  getTableColumns,
} from "drizzle-orm";
import { z } from "zod";
import { match } from "ts-pattern";
import { getAuth } from "@clerk/tanstack-start/server";
import { getWebRequest } from "vinxi/http";
import { toast } from "sonner";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { faker } from "@faker-js/faker";
import { Navigate, useNavigate } from "@tanstack/react-router";

export const orderByOptions = [
  { name: "newest", label: "Newest" },
  { name: "oldest", label: "Oldest" },
  { name: "popular", label: "Most Popular" },
];

export const filterByOptions = [
  { name: "all", label: "All" },
  { name: "favorites", label: "Favorites" },
];

const orderBySchema = z.enum(
  orderByOptions.map((o) => o.name) as [string, ...string[]]
);

const filterBySchema = z.enum(
  filterByOptions.map((o) => o.name) as [string, ...string[]]
);

export const searchComponentsSchema = z.object({
  q: z.string().optional().describe("Search query"),
  orderBy: orderBySchema.optional().describe("Order by").catch("newest"),
  filterBy: filterBySchema.optional().describe("Filter by").catch("all"),
});
type SearchParams = z.infer<typeof searchComponentsSchema>;

export const componentsQueryOptions = (params: SearchParams) =>
  queryOptions({
    queryKey: ["components", params],
    // TODO: Optimize by storing each component in the query cache individually (and then invalidate just that component on favorite toggle)
    queryFn: () => getComponents({ data: params }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const userComponentsQueryOptions = () =>
  queryOptions({
    queryKey: ["components", "user"],
    queryFn: () => getUserComponents(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

export const getComponentQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["components", id],
    queryFn: () => getComponent({ data: { id } }),
  });

export const getComponent = createServerFn()
  .validator((data: { id: string }) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data: { id } }) => {
    const [result] = await db.select().from(components).where(eq(components.id, id)).limit(1);
    return result;
  });

const getComponents = createServerFn()
  .validator((data?: SearchParams) => searchComponentsSchema.parse(data))
  .handler(async ({ data: { q, orderBy, filterBy } }) => {
    const result = await db
      .select({
        ...getTableColumns(components),
        favoriteUserIds: sql<
          string[]
        >`json_group_array(DISTINCT ${favorites.userId})`,
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
            )
          : undefined
      )
      .orderBy(
        match(orderBy)
          .with("newest", () => desc(components.createdAt))
          .with("oldest", () => asc(components.createdAt))
          .with("popular", () => desc(sql`count(DISTINCT ${favorites.id})`))
          .otherwise(() => desc(components.createdAt))
      );

    // TODO: Make the fav filtering at the SQL level
    if (filterBy === "favorites") {
      const { userId } = await getAuth(getWebRequest());
      return result.filter((c) => c.favoriteUserIds.includes(userId!));
    }

    return result;
  });

const getUserComponents = createServerFn()
  .handler(async () => {
    const { userId } = await getAuth(getWebRequest());
    return db.select().from(components).where(eq(components.userId, userId!));
  });

export type Component = SelectComponent;

export type ComponentWithFavorites = Awaited<
  ReturnType<typeof getComponents>
>[number];

const toggleFavorite = createServerFn({ method: "POST" })
  .validator((data: { componentId: string }) =>
    z.object({ componentId: z.string() }).parse(data)
  )
  .handler(async ({ data: { componentId } }) => {
    const { userId } = await getAuth(getWebRequest());
    if (!userId) {
      // This can happen if the user is not signed in.
      // We can just ignore the request.
    }

    const bothIdsCondition = and(
      eq(favorites.userId, userId!),
      eq(favorites.componentId, componentId)
    );

    const [{ c }] = await db
      .select({ c: count() })
      .from(favorites)
      .where(bothIdsCondition);

    if (c > 0) {
      await db.delete(favorites).where(bothIdsCondition);
    } else {
      await db.insert(favorites).values({ userId: userId!, componentId });
    }
  });

export function toggleFavoriteMutation(componentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleFavorite({ data: { componentId } }),
    //onSuccess: () => queryClient.invalidateQueries({ queryKey: ["components", { id: componentId }] }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["components"] }),
    onError: () => {
      toast.error("Failed to toggle favorite");
    },
  });
}

export const createComponentSchema = createInsertSchema(components, {
  // TODO(BES-26): Support images
  imageUrl: z.string().optional().default(faker.image.url()),
  tags: z.array(z.string()).nonempty("Please at least one item"),
  // ignore userId
  userId: z.string().optional(),
})

export const selectComponentSchema = createSelectSchema(components)

export const updateComponentSchema = createComponentSchema.refine(
  (data) => data.id !== undefined,
  {
    path: ["id"],
    message: "Id is required",
  }
);

export const createComponent = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof createComponentSchema>) => createComponentSchema.parse(data))
  .handler(async ({ data }) => {
    const { userId } = await getAuth(getWebRequest());
    await db.insert(components).values({ ...data, userId: userId! });
  });

export const updateComponent = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof updateComponentSchema>) => updateComponentSchema.parse(data))
  .handler(async ({ data }) => {
    const { userId } = await getAuth(getWebRequest());
    await db.update(components).set(data).where(and(eq(components.id, data.id!), eq(components.userId, userId!)));
  });

export const deleteComponent = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data: { id } }) => {
    const { userId } = await getAuth(getWebRequest());

    // Retrieve the component and verify it belongs to the user
    const [{ c }] = await db.select({
      c: count(),
    }).from(components).where(and(eq(components.id, id), eq(components.userId, userId!)));
    if (c === 0) throw new Error("Component not found");

    // Remove the component favorites
    // TODO(BES-43): Remove the favorites using cascade
    await db.delete(favorites).where(eq(favorites.componentId, id));

    // Remove the component
    await db.delete(components).where(and(eq(components.id, id), eq(components.userId, userId!)));
  });

export const componentBelongsToUser = createServerFn()
  .validator((data: { id: string }) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data: { id } }) => {
    const { userId } = await getAuth(getWebRequest());
    const [{ c }] = await db.select({ c: count() }).from(components).where(and(eq(components.id, id), eq(components.userId, userId!)));
    return c > 0;
  });

export function createComponentMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] }),
      toast.success("Component created successfully");
      // redirect to /
      navigate({ to: "/", params: {} })
    },
    onError: () => {
      toast.error("Failed to create component");
    },
  });
}

export function updateComponentMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] }),
      toast.success("Component updated successfully");
      // redirect to /my-components
      navigate({ to: "/my-components", params: {} })
    },
    onError: () => {
      toast.error("Failed to update component");
    },
  });
}

export function deleteComponentMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] }),
      toast.success("Component deleted successfully");
      // redirect to /my-components
      navigate({ to: "/my-components", params: {} })
    },
    onError: () => {
      toast.error("Failed to delete component");
    },
  });
}
