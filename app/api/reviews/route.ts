import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews, companies } from "@/drizzle/schema";
import { reviewPostBodySchema } from "@/lib/schemas/review";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reviewPostBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { companySlug, ...reviewData } = parsed.data;

  const [company] = await db
    .select({ id: companies.id })
    .from(companies)
    .where(eq(companies.slug, companySlug))
    .limit(1);

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const [inserted] = await db
    .insert(reviews)
    .values({ ...reviewData, companyId: company.id })
    .returning({ id: reviews.id, createdAt: reviews.createdAt });

  return NextResponse.json({ review: inserted }, { status: 201 });
}
