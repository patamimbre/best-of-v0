import { seed } from "drizzle-seed";
import { faker } from '@faker-js/faker';
import { db } from "db";
import * as schema from "./schema";


async function main() {
  // clear the database
  await db.delete(schema.componentsTable);


  // Bulk insert components
  await db.insert(schema.componentsTable).values(
    Array.from({ length: 10 }, () => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      developer: faker.internet.username(),
      v0Url: faker.internet.url(),
      githubUrl: faker.internet.url(),
      siteUrl: faker.internet.url(),
      imageUrl: faker.image.url(),
    })) 
  );

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