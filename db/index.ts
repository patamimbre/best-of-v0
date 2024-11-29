import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';


config({ path: '.env' }); // or .env.local

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  casing: 'snake_case',
});
