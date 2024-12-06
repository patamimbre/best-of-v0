import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '@/db/schema';
import env from '@/env';
import { createClient } from '@libsql/client';

export const connection = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(connection, {
  schema,
  casing: 'snake_case',
  logger: true,
});

export type DB = typeof db;
export default db;
