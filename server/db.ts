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
    // Add cycleStatus and cycleReason columns if missing (added in no-period update)
    await client.query(`
      ALTER TABLE user_profiles
        ADD COLUMN IF NOT EXISTS cycle_status TEXT DEFAULT 'cycling',
        ADD COLUMN IF NOT EXISTS cycle_reason TEXT
    `);
    console.log('[db] Schema columns verified');
  } catch (err) {
    console.error('[db] Schema migration warning:', err);
  } finally {
    client.release();
  }
}
