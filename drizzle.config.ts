// Loads .env.local before anything reads process.env — drizzle-kit runs
// outside Next.js, so nothing else populates the environment for it.
import "./src/lib/env/load";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
