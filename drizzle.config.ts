import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load .env.local so drizzle-kit CLI commands (push, generate, migrate)
// have access to DATABASE_URL when run outside of Next.js.
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
