import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interviews, companies } from "@/drizzle/schema";
import { interviewPostBodySchema } from "@/lib/schemas/interview";
import { and, eq } from "drizzle-orm";
import { getSubmissionGeo, sendInterviewNotification } from "@/lib/email/notify";
import { checkRateLimit } from "@/lib/rate-limit";
import { getOrCreateAnonId, setAnonCookie } from "@/lib/anon-id";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const allowed = await checkRateLimit(req, { key: "interviews", kind: "write" });
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

  const parsed = interviewPostBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { companySlug, ...data } = parsed.data;

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
    .select({ id: interviews.id })
    .from(interviews)
    .where(and(eq(interviews.companyId, company.id), eq(interviews.submitterId, anonId)))
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "You've already posted an interview experience for this company." },
      { status: 409 },
    );
  }

  const [inserted] = await db
    .insert(interviews)
    .values({ ...data, companyId: company.id, submitterId: anonId })
    .returning({ id: interviews.id, createdAt: interviews.createdAt });

  const geo = getSubmissionGeo(req);
  void sendInterviewNotification(parsed.data, company, geo);

  const res = NextResponse.json({ interview: inserted }, { status: 201 });
  setAnonCookie(res, anonId);
  return res;
}
