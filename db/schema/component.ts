import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";

import favorite from "./favorite";
import user from "./user";

const component = sqliteTable("components", {
  id: text({ length: 128 }).$defaultFn(createId).primaryKey(),
  userId: text().notNull().references(() => user.clerkId, { onDelete: 'cascade' }),
  name: text().notNull(),
  description: text().notNull(),
  tags: text({ mode: 'json' })
    .notNull()
    .$type<string[]>()
    .default(sql`'[]'`),
  v0Url: text().notNull().default(''),
  githubUrl: text().notNull().default(''),
  siteUrl: text().notNull().default(''),
  createdAt: integer({ mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  },
  (t) => ({
    userIdIdx: index("user_id_idx").on(t.userId),
    nameIdx: index("name_idx").on(t.name),
  })
);

export const componentRelations = relations(component, ({ one, many }) => ({
  user: one(user, { fields: [component.userId], references: [user.clerkId] }),
  favorites: many(favorite),
}));

export default component;