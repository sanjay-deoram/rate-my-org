import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";

config({ path: ".env" });

// ─── Config ──────────────────────────────────────────────────────────────────

const MANIFEST_PATH = path.resolve(__dirname, "../../python-scripts/manifest.json");
const LOGOS_DIR = path.resolve(__dirname, "../logos");
const CONCURRENCY = 20; // upload N files at a time

// ─── R2 Client ───────────────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ManifestEntry {
  companyId: string;
  name: string;
  slug: string;
  status: "ok" | "failed";
  originalUrl: string;
  failReason: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Check if a key already exists in R2 (skip re-uploads) */
async function existsInR2(key: string): Promise<boolean> {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

/** Upload a single logo to R2 */
async function uploadLogo(
  entry: ManifestEntry,
): Promise<{ slug: string; result: "uploaded" | "skipped" | "error"; error?: string }> {
  const key = `${entry.slug}.webp`;
  const filePath = path.join(LOGOS_DIR, key);

  if (!fs.existsSync(filePath)) {
    return { slug: entry.slug, result: "error", error: "File not found on disk" };
  }

  // Skip if already in R2
  if (await existsInR2(key)) {
    return { slug: entry.slug, result: "skipped" };
  }

  try {
    const body = fs.readFileSync(filePath);
    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    return { slug: entry.slug, result: "uploaded" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { slug: entry.slug, result: "error", error: message };
  }
}

/** Run promises in batches of `size` */
async function batchRun<T>(items: (() => Promise<T>)[], size: number): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size).map((fn) => fn());
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);

    const done = Math.min(i + size, items.length);
    process.stdout.write(`\r  Progress: ${done}/${items.length}`);
  }
  console.log(); // newline after progress
  return results;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Validate env
  const required = [
    "CLOUDFLARE_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
  ];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`❌ Missing env var: ${key}`);
      process.exit(1);
    }
  }

  // Load manifest
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`❌ manifest.json not found at: ${MANIFEST_PATH}`);
    process.exit(1);
  }
  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

  const toUpload = manifest.filter((e) => e.status === "ok");
  const skippedFailed = manifest.length - toUpload.length;

  console.log(`\n🚀 Upload-logos starting`);
  console.log(`   Total entries in manifest : ${manifest.length}`);
  console.log(`   To upload (status: ok)    : ${toUpload.length}`);
  console.log(`   Skipped (status: failed)  : ${skippedFailed}`);
  console.log(`   Concurrency               : ${CONCURRENCY}`);
  console.log(`   Bucket                    : ${BUCKET}\n`);

  const tasks = toUpload.map((entry) => () => uploadLogo(entry));
  const results = await batchRun(tasks, CONCURRENCY);

  // Tally
  const uploaded = results.filter((r) => r.result === "uploaded").length;
  const skipped = results.filter((r) => r.result === "skipped").length;
  const errors = results.filter((r) => r.result === "error");

  console.log(`\n✅ Done!`);
  console.log(`   Uploaded : ${uploaded}`);
  console.log(`   Skipped  : ${skipped} (already in R2)`);
  console.log(`   Errors   : ${errors.length}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  Errors:`);
    for (const e of errors) {
      console.log(`   - ${e.slug}: ${e.error}`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
