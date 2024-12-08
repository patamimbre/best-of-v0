import { createId } from "@paralleldrive/cuid2";
import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

import user from "./user";
import component from "./component";
import { relations } from "drizzle-orm";

const favorite = sqliteTable(
  "favorites",
  {
    id: text({ length: 128 }).$defaultFn(createId).primaryKey(),
    userId: text().notNull().references(() => user.clerkId, { onDelete: 'cascade' }),
    componentId: text().notNull().references(() => component.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    uniqueFavorite: unique("unique_favorite").on(table.userId, table.componentId),
  }),
);

export const favoriteRelations = relations(favorite, ({ one }) => ({
  component: one(component, { fields: [favorite.componentId], references: [component.id] }),
  user: one(user, { fields: [favorite.userId], references: [user.clerkId] }),
}));

export default favorite;