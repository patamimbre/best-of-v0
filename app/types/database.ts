import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { component, favorite, user } from "@/db/schema";
import { z } from "zod";

export const createComponentSchema = createInsertSchema(component, {
  tags: z.array(z.string()).nonempty("Please at least one item"),
  // ignore userId
  userId: z.string().optional(),
})

export const selectComponentSchema = createSelectSchema(component)

export const updateComponentSchema = createComponentSchema.refine(
  (data) => data.id !== undefined,
  {
    path: ["id"],
    message: "Id is required",
  }
);

export type CreateComponentData = z.infer<typeof createComponentSchema>;
export type SelectComponentData = z.infer<typeof selectComponentSchema>;
export type UpdateComponentData = z.infer<typeof updateComponentSchema>;

export type SelectComponent = typeof component.$inferSelect;
export type FullComponent = SelectComponent & {
  favorites: typeof favorite.$inferSelect[];
  user: typeof user.$inferSelect;
}
