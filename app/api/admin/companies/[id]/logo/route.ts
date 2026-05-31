import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PhotonImage, SamplingFilter, resize, crop } from "@cf-wasm/photon/workerd";

export const runtime = "edge";
import { db } from "@/lib/db";
import { companies } from "@/drizzle/schema";
import { requireAdmin } from "@/lib/admin-auth";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

function getS3Client() {
  const accountId = process.env.R2_ACCOUNT_ID ?? process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!accountId) throw new Error("R2_ACCOUNT_ID or CLOUDFLARE_ACCOUNT_ID env var is not set");
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [company] = await db
    .select({ id: companies.id })
    .from(companies)
    .where(eq(companies.id, id))
    .limit(1);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File must be an image (JPEG, PNG, WebP, GIF, AVIF)" },
      { status: 422 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be under 5 MB" }, { status: 422 });
  }

  let webp: Uint8Array;
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const input = PhotonImage.new_from_byteslice(bytes);
    const w = input.get_width();
    const h = input.get_height();
    const scale = Math.max(200 / w, 200 / h);
    const scaledW = Math.round(w * scale);
    const scaledH = Math.round(h * scale);
    const scaled = resize(input, scaledW, scaledH, SamplingFilter.Lanczos3);
    input.free();
    const x1 = Math.floor((scaledW - 200) / 2);
    const y1 = Math.floor((scaledH - 200) / 2);
    const cropped = crop(scaled, x1, y1, x1 + 200, y1 + 200);
    scaled.free();
    webp = cropped.get_bytes_webp();
    cropped.free();
  } catch (err) {
    console.error("[logo] photon error:", err);
    return NextResponse.json({ error: "Failed to process image" }, { status: 422 });
  }

  const logoKey = `logos/${id}.webp`;

  try {
    const s3 = getS3Client();
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: logoKey,
        Body: webp,
        ContentType: "image/webp",
      }),
    );
  } catch (err) {
    console.error("[logo] R2 upload error:", err);
    const msg = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  await db
    .update(companies)
    .set({ logoKey, updatedAt: sql`now()` })
    .where(eq(companies.id, id));

  return NextResponse.json({ logoKey });
}
