import type { Config } from "drizzle-kit";
import env from "@/env";

export default {
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  casing: "snake_case",
  verbose: true,
  strict: true,
} satisfies Config;
