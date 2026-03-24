import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Auto-migrate: ensure all columns exist on startup (safe to run repeatedly)
export async function ensureSchema(): Promise<void> {
  const client = await pool.connect();
  try {
    // Add all optional columns if missing (safe to run repeatedly)
    await client.query(`
      ALTER TABLE user_profiles
        ADD COLUMN IF NOT EXISTS cycle_status TEXT DEFAULT 'cycling',
        ADD COLUMN IF NOT EXISTS cycle_reason TEXT,
        ADD COLUMN IF NOT EXISTS age INTEGER,
        ADD COLUMN IF NOT EXISTS relationship_status TEXT,
        ADD COLUMN IF NOT EXISTS partner_willingness TEXT
    `);
    // Drop NOT NULL constraint on last_period_start so no-period users can create profiles
    await client.query(`
      ALTER TABLE user_profiles
        ALTER COLUMN last_period_start DROP NOT NULL
    `);
    console.log('[db] Schema columns verified');
  } catch (err) {
    console.error('[db] Schema migration warning:', err);
  } finally {
    client.release();
  }
}
