import { seed } from "drizzle-seed";
import { faker } from "@faker-js/faker";
import { db } from "db";
import * as schema from "./schema";
import { count } from "drizzle-orm";
import { eq } from "drizzle-orm";

async function main() {
  // clear the components and favorites tables. Avoid dropping the users table.
  await db.delete(schema.componentsTable);
  await db.delete(schema.favoritesTable);

  // Bulk insert components
  const componentsData = await db
    .insert(schema.componentsTable)
    .values(
      Array.from({ length: 10 }, () => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        tags: faker.lorem.words(3).split(" "),
        developer: faker.internet.username(),
        v0Url: faker.internet.url(),
        githubUrl: faker.internet.url(),
        siteUrl: faker.internet.url(),
        imageUrl: faker.image.url(),
        createdAt: faker.date.past(),
        favCount: faker.number.int({ min: 0, max: 100 }),
      }))
    )
    .returning({ componentId: schema.componentsTable.id, favCount: schema.componentsTable.favCount });

  // Bulk insert favorites
  const componentIdsUserIdsPairs = componentsData.flatMap(
    ({ componentId, favCount }) =>
      Array.from({ length: favCount }, () => ({
        componentId: componentId!,
        userId: faker.string.uuid(),
      }))
  );

  await db.insert(schema.favoritesTable).values(componentIdsUserIdsPairs);

  // await seed(db, schema, { count: 10 }).refine((f) => ({
  //   componentsTable: {
  //     columns: {
  //       name: f.companyName(),
  //       description: f.loremIpsum(),
  //       developer: f.firstName(),
  //       v0Url: f.string(),
  //       githubUrl: f.string(),
  //       siteUrl: f.string(),
  //       imageUrl: f.string(),
  //     }
  //   }
  // }))
}

main();
