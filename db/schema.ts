import { foreignKey, integer, primaryKey, sqliteTable, text, unique, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const components = sqliteTable("components", {
  id: text({ length: 128 }).$defaultFn(createId).primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  tags: text({ mode: 'json' })
    .notNull()
    .$type<string[]>()
    .default(sql`'[]'`),
  developer: text().notNull(),
  v0Url: text().notNull().default(sql`''`), // optional
  githubUrl: text().notNull().default(sql`''`), // optional
  siteUrl: text().notNull().default(sql`''`), // optional
  imageUrl: text().notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const favorites = sqliteTable("favorites", {
  id: text({ length: 128 }).$defaultFn(createId).primaryKey(),
  userId: text().notNull(),
  componentId: text().notNull().references(() => components.id),
  },
  (table) => ({
    favoritesComponentIdFk: foreignKey({
      columns: [table.componentId],
      foreignColumns: [components.id],
      name: 'favorites_component_id_fk',
    }),
    // no duplicated pairs of userId and componentId
    unique: uniqueIndex('unique_user_component').on(table.userId, table.componentId),
  })
);


export type InsertComponent = typeof components.$inferInsert;
export type SelectComponent = typeof components.$inferSelect;

export type InsertFavorite = typeof favorites.$inferInsert;
export type SelectFavorite = typeof favorites.$inferSelect;
