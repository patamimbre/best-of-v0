import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";

export const componentsTable = sqliteTable("components", {
  id: text({ length: 128 }).$defaultFn(createId),
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
});

export type InsertComponent = typeof componentsTable.$inferInsert;
export type SelectComponent = typeof componentsTable.$inferSelect;
