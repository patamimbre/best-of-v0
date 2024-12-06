import { migrate } from "drizzle-orm/libsql/migrator";
import { db, connection } from "@/db";
import env from "@/env";

if (!env.DB_MIGRATING) {
  throw new Error("You must set DB_MIGRATING to true to run migrations");
}

await migrate(db, { migrationsFolder: "db/migrations" });
await connection.close();