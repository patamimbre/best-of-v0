import { createId } from "@paralleldrive/cuid2";
import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

import user from "./user";
import component from "./component";

const favorite = sqliteTable(
  "favorites",
  {
    id: text({ length: 128 }).$defaultFn(createId).primaryKey(),
    userId: text().notNull().references(() => user.id),
    componentId: text().notNull().references(() => component.id),
  },
  (table) => ({
    uniqueFavorite: unique("unique_favorite").on(table.userId, table.componentId),
  }),
);

export default favorite;