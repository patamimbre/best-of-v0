import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

import component from './component';
import favorite from './favorite';

const user = sqliteTable("users", {
  id: text({ length: 128 }).$defaultFn(createId).primaryKey(),
  email: text().notNull().unique(),
});

export const userRelations = relations(user, ({ many }) => ({
  components: many(component),
  favorites: many(favorite),
}));

export default user;