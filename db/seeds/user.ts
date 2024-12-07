import { DB } from "@/db";
import { user } from "@/db/schema"
import { faker } from "@faker-js/faker";

type Insertable = typeof user.$inferInsert;

export default async function seed(db: DB) {
  const insertable = Array.from({ length: 30 }, () => (
    {
      email: faker.internet.email(),
      clerkId: `user_${faker.string.uuid()}`,
    } satisfies Insertable
  ));

  await db.insert(user).values(insertable);
}