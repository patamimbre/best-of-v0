import { config } from "dotenv";
import { expand } from "dotenv-expand";


import { ZodError, z } from "zod";

const stringBoolean = z.coerce.string().transform((val) => val === "true").default("false");

const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
    CLERK_PUBLISHABLE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
    DB_MIGRATING: stringBoolean,
    DB_SEEDING: stringBoolean,
});

export type Env = z.infer<typeof EnvSchema>;

expand(config());

try {
  EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = "Missing required values in .env:\n";
    error.issues.forEach((issue) => {
      message += issue.path[0] + "\n";
    });
    const e = new Error(message);
    e.stack = "";
    throw e;
  } else {
    console.error(error);
  }
}

export default EnvSchema.parse(process.env);
