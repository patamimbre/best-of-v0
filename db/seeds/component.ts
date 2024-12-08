import { DB } from "@/db";
import { component, user } from "@/db/schema";
import { faker } from "@faker-js/faker";
import components from "./components.json";
import { eq } from "drizzle-orm";

type Insertable = typeof component.$inferInsert;

export default async function seed(db: DB) {
  const adminClerkId = "user_2ptxZj2HFTZhkqU9ET2NO2GxKs0";

  // Create and admin user (if it doesn't exist)
  const adminUser = await db.query.user.findFirst({
    where: eq(user.clerkId, adminClerkId),
  });
  if (!adminUser) {
    await db.insert(user).values({
      email: "patamembrillo@proton.me",
      clerkId: adminClerkId,
    });
  }

  const insertable = components.map((component) => ({
    ...component,
    userId: adminClerkId,
  } satisfies Insertable));

  await db.insert(component).values(insertable);
}