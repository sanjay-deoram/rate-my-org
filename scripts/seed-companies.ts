import { db } from "../lib/db";
import { companies } from "../drizzle/schema";
import { sql } from "drizzle-orm";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";

config({ path: ".env" });

const MANIFEST_PATH = path.resolve(__dirname, "../../python-scripts/manifest.json");
const BATCH_SIZE = 500;

interface ManifestEntry {
  name: string;
  slug: string;
  status: "ok" | "failed";
}

async function main() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`❌ manifest.json not found at: ${MANIFEST_PATH}`);
    process.exit(1);
  }

  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  const entries = manifest.filter((e) => e.status === "ok");

  console.log(`\n🌱 Seed-companies starting`);
  console.log(`   Entries to upsert: ${entries.length}\n`);

  let upserted = 0;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE).map((e) => ({
      name: e.name,
      slug: e.slug,
      logoKey: `${e.slug}.webp`,
    }));

    await db
      .insert(companies)
      .values(batch)
      .onConflictDoUpdate({
        target: companies.slug,
        set: {
          name: sql`excluded.name`,
          logoKey: sql`excluded.logo_key`,
          updatedAt: sql`now()`,
        },
      });

    upserted += batch.length;
    process.stdout.write(`\r  Progress: ${upserted}/${entries.length}`);
  }

  console.log(`\n\n✅ Done! Upserted ${upserted} companies.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
