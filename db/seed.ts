import env from "@/env";
import { db } from "@/db";
import * as schema from "@/db/schema";
import * as seeds from "@/db/seeds";

if (!env.DB_SEEDING) {
  throw new Error("You must set DB_SEEDING to true to run seeding");
}

async function main() {
  for (const table of [
    schema.favorite,
    schema.component,
    schema.user,
  ]) {
    await db.delete(table);
  }

  // await seeds.user(db);
  await seeds.component(db);
  // await seeds.favorite(db);
}

main().catch(console.error);