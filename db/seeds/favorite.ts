import { DB } from "@/db";
import { component, favorite, user } from "@/db/schema";
import { faker } from "@faker-js/faker";

type Insertable = typeof favorite.$inferInsert;

export default async function seed(db: DB) {
  // Pick all the component ids
  const components = await db.select({ id: component.id, userId: component.userId }).from(component);

  // Pick all the user ids
  const userIds = await db.select({ id: user.clerkId }).from(user);

  // Each component is favorited by a random number of users (except the component uploader)
  const insertable = components.flatMap((component) => {
    const favoriteUserIds = faker.helpers.arrayElements(userIds.filter((user) => user.id !== component.userId)).map((user) => user.id);
    return favoriteUserIds.map((userId) => ({
      componentId: component.id,
      userId,
    } satisfies Insertable));
  });

  await db.insert(favorite).values(insertable);
}