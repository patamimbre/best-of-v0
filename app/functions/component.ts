import db from "@/db";
import { component, favorite } from "@/db/schema";
import { getAuth } from "@clerk/tanstack-start/server";
import { createServerFn } from "@tanstack/start";
import { and, asc, count, desc, eq, like, or, sql } from "drizzle-orm";
import { match } from "ts-pattern";
import { getWebRequest } from "vinxi/http";
import { z } from "zod";
import { createComponentSchema, updateComponentSchema } from "~/types/database";
import type { CreateComponentData, UpdateComponentData } from "~/types/database";
import type { SearchParams } from "~/types/search";
import { searchComponentsSchema } from "~/types/search";


export const getComponent = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data: { id } }) => db.query.component.findFirst({ where: eq(component.id, id) }));

export const getComponents = createServerFn({ method: "GET" })
  .validator((data?: SearchParams) => searchComponentsSchema.parse(data))
  .handler(async ({ data: { q, orderBy, filterBy } }) => {
    const { userId } = await getAuth(getWebRequest());

    const result = await db.query.component.findMany({
      with: {
        favorites: true,
        user: true,
      },
      where: q !== "" ? or(like(component.name, `%${q}%`), like(component.description, `%${q}%`)) : undefined,
      orderBy: match(orderBy)
        .with("newest", () => desc(component.createdAt))
        .with("oldest", () => asc(component.createdAt))
        .with("popular", () => desc(sql`count(DISTINCT ${favorite.id})`))
        .otherwise(() => desc(component.createdAt))
    });

    // TODO: Make the fav filtering at the SQL level
    if (filterBy === "favorites") {
      const { userId } = await getAuth(getWebRequest());
      return result.filter((c) => c.favorites.some((f) => f.userId === userId));
    }

    return result;
  });

export const getUserComponents = createServerFn({ method: "GET" })
  .handler(async () => {
    const { userId } = await getAuth(getWebRequest());
    return db.query.component.findMany({ where: eq(component.userId, userId!) });
  });

  export const createComponent = createServerFn({ method: "POST" })
  .validator((data: CreateComponentData) => createComponentSchema.parse(data))
  .handler(async ({ data }) => {
    const { userId } = await getAuth(getWebRequest());
    await db.insert(component).values({ ...data, userId: userId! });
  });

export const updateComponent = createServerFn({ method: "POST" })
  .validator((data: UpdateComponentData) => updateComponentSchema.parse(data))
  .handler(async ({ data }) => {
    const { userId } = await getAuth(getWebRequest());
    await db.update(component).set(data).where(and(eq(component.id, data.id!), eq(component.userId, userId!)));
  });

export const deleteComponent = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data: { id } }) => {
    const { userId } = await getAuth(getWebRequest());

    // Retrieve the component and verify it belongs to the user
    const componentExists = await db.query.component.findFirst({ where: and(eq(component.id, id), eq(component.userId, userId!)) });
    if (!componentExists) throw new Error("Component not found");

    // TODO(BES-43): Remove the favorites using cascade
    await db.delete(favorite).where(eq(favorite.componentId, id));

    // Remove the component
    await db.delete(component).where(and(eq(component.id, id), eq(component.userId, userId!)));
  });

export const componentBelongsToUser = createServerFn()
  .validator((data: { id: string }) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data: { id } }) => {
    const { userId } = await getAuth(getWebRequest());
    const componentExists = await db.query.component.findFirst({ where: and(eq(component.id, id), eq(component.userId, userId!)) });
    return !!componentExists;
  });
