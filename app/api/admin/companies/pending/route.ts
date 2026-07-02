import { NextResponse } from "next/server";
import { desc, eq, count, getTableColumns } from "drizzle-orm";
import { db } from "@/lib/db";
import { companies, reviews, interviews } from "@/drizzle/schema";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      ...getTableColumns(companies),
      reviewCount: count(reviews.id),
      interviewCount: count(interviews.id),
    })
    .from(companies)
    .leftJoin(reviews, eq(reviews.companyId, companies.id))
    .leftJoin(interviews, eq(interviews.companyId, companies.id))
    .where(eq(companies.status, "pending"))
    .groupBy(companies.id)
    .orderBy(desc(companies.createdAt));

  return NextResponse.json({ companies: rows });
}
