import { DB } from "@/db";
import { component, user } from "@/db/schema";
import { faker } from "@faker-js/faker";

type Insertable = typeof component.$inferInsert;

export default async function seed(db: DB) {

  // Pick all the user ids
  const userIds = await db.select({ id: user.clerkId }).from(user);

  // Create 10 components. The user id is picked from the list of user ids.
  const insertable = Array.from({ length: 10 }, () => (
    {
      name: faker.lorem.word(),
      userId: faker.helpers.arrayElement(userIds).id,
      description: faker.lorem.sentence(),
      imageUrl: faker.image.url(),
    } satisfies Insertable
  ));

  await db.insert(component).values(insertable);
}