import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interviews, companies } from "@/drizzle/schema";
import { eq, asc } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  const rows = await db
    .selectDistinct({
      name: companies.name,
      slug: companies.slug,
    })
    .from(interviews)
    .innerJoin(companies, eq(interviews.companyId, companies.id))
    .where(eq(companies.status, "approved"))
    .orderBy(asc(companies.name));

  return NextResponse.json(rows);
}
