import { config } from "dotenv";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

config({ path: ".env" });

const client = postgres(process.env.DATABASE_URL ?? "");

declare global {
  var db: PostgresJsDatabase<typeof schema> | undefined;
}
let db: PostgresJsDatabase<typeof schema>;

if (process.env.NODE_ENV === "production") {
  db = drizzle(client, { schema });
} else {
  if (!global.db) global.db = drizzle(client, { schema });

  db = global.db;
}

export { db };
