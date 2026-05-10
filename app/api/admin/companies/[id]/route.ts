import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { companies } from "@/drizzle/schema";
import { requireAdmin } from "@/lib/admin-auth";

const updateSchema = z
  .object({
    name: z.string().min(2).max(100),
    industry: z.string().min(2).max(100),
    headquarters: z.string().min(2).max(100),
    website: z.string().url().or(z.literal("")).optional(),
    size: z.string().max(100).optional(),
    description: z.string().max(2000).optional(),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: "At least one field required" });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });
  }

  const [updated] = await db
    .update(companies)
    .set({ ...parsed.data, updatedAt: sql`now()` })
    .where(eq(companies.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  return NextResponse.json({ company: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [deleted] = await db
    .delete(companies)
    .where(eq(companies.id, id))
    .returning({ id: companies.id });

  if (!deleted) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
