import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews, companies } from "@/drizzle/schema";
import { reviewPostBodySchema } from "@/lib/schemas/review";
import { and, eq } from "drizzle-orm";
import { getSubmissionGeo, sendReviewNotification } from "@/lib/email/notify";
import { checkRateLimit } from "@/lib/rate-limit";
import { getOrCreateAnonId, setAnonCookie } from "@/lib/anon-id";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const allowed = await checkRateLimit(req, { key: "reviews", kind: "write" });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

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
    .select({ id: companies.id, name: companies.name })
    .from(companies)
    .where(eq(companies.slug, companySlug))
    .limit(1);

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const { anonId } = getOrCreateAnonId(req);

  const [existing] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(and(eq(reviews.companyId, company.id), eq(reviews.submitterId, anonId)))
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "You've already posted a review for this company." },
      { status: 409 },
    );
  }

  const [inserted] = await db
    .insert(reviews)
    .values({ ...reviewData, companyId: company.id, submitterId: anonId })
    .returning({ id: reviews.id, createdAt: reviews.createdAt });

  const geo = getSubmissionGeo(req);
  void sendReviewNotification(parsed.data, company, geo);

  const res = NextResponse.json({ review: inserted }, { status: 201 });
  setAnonCookie(res, anonId);
  return res;
}
