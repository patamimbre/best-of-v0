import { seed } from "drizzle-seed";
import { db } from "db";
import * as schema from "./schema";


async function main() {
  // clear the database
  await db.delete(schema.componentsTable);

  // TODO: Add refine seeding
  await seed(db, schema, { count: 10 });
}

main();