import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";

export const componentsTable = sqliteTable("components", {
  id: text({ length: 128 }).$defaultFn(createId).primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  tags: text({ mode: 'json' })
    .notNull()
    .$type<string[]>()
    .default(sql`'[]'`),
  developer: text().notNull(),
  v0Url: text().notNull(),
  githubUrl: text().notNull(),
  siteUrl: text().notNull(),
  imageUrl: text().notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  favCount: integer().notNull().default(0),
});

export const favoritesTable = sqliteTable("favorites", {
  userId: text().notNull(),
  componentId: text().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.componentId] }),
  })
);

// A component can have many favorites from different userIds
export const favoritesRelations = relations(favoritesTable, ({ one }) => ({
  component: one(componentsTable, {
    fields: [favoritesTable.componentId],
    references: [componentsTable.id],
  }),
}));

export type InsertComponent = typeof componentsTable.$inferInsert;
export type SelectComponent = typeof componentsTable.$inferSelect;

export type InsertFavorite = typeof favoritesTable.$inferInsert;
export type SelectFavorite = typeof favoritesTable.$inferSelect;