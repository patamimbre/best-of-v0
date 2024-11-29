import { seed } from "drizzle-seed";
import { faker } from "@faker-js/faker";
import { db } from "db";
import * as schema from "./schema";

async function main() {
  // clear the components and favorites tables. Avoid dropping the users table.
  await db.delete(schema.components);
  await db.delete(schema.favorites);

  // Bulk insert components
  const components = await db
    .insert(schema.components)
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
      }))
    )
    .returning({ componentId: schema.components.id });

  // Bulk insert favorites
  // Each component can have between 2 and 30 favorites
  const componentIdsUserIdsPairs = components.flatMap((component) =>
    Array.from({ length: faker.number.int({ min: 2, max: 30 }) }, () => ({
      componentId: component.componentId!,
      userId: faker.string.uuid(),
    }))
  );
  await db.insert(schema.favorites).values(componentIdsUserIdsPairs);

  // await seed(db, schema, { count: 10 }).refine((f) => ({
  //   components: {
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
