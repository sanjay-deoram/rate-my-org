import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interviews, companies } from "@/drizzle/schema";
import { interviewFormSchema } from "@/lib/schemas/interview";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = interviewFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { companySlug, companyName: _name, ...data } = parsed.data;

  const [company] = await db
    .select({ id: companies.id })
    .from(companies)
    .where(eq(companies.slug, companySlug))
    .limit(1);

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const [inserted] = await db
    .insert(interviews)
    .values({ ...data, companyId: company.id })
    .returning({ id: interviews.id, createdAt: interviews.createdAt });

  return NextResponse.json({ interview: inserted }, { status: 201 });
}
