import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";

import favorite from "./favorite";
import user from "./user";

const component = sqliteTable("components", {
  id: text({ length: 128 }).$defaultFn(createId).primaryKey(),
  userId: text().notNull().references(() => user.id),
  name: text().notNull(),
  description: text().notNull(),
  tags: text({ mode: 'json' })
    .notNull()
    .$type<string[]>()
    .default(sql`'[]'`),
  v0Url: text(),
  githubUrl: text(),
  siteUrl: text(),
  imageUrl: text().notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});



export const componentRelations = relations(component, ({ many }) => ({
  favorites: many(favorite),
}));

export default component;