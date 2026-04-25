import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { companies } from "@/drizzle/schema";
import { sql, gt, ilike, desc } from "drizzle-orm";

export const runtime = "nodejs";

const querySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().optional(),
});

const CDN = process.env.NEXT_PUBLIC_LOGO_CDN ?? "";

export async function GET(req: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { search, limit, cursor } = parsed.data;

  let rows: { slug: string; name: string; logoKey: string | null }[];

  if (search) {
    rows = await db
      .select({
        slug: companies.slug,
        name: companies.name,
        logoKey: companies.logoKey,
      })
      .from(companies)
      .where(ilike(companies.name, `%${search}%`))
      .orderBy(desc(sql`similarity(${companies.name}, ${search})`), companies.name)
      .limit(limit + 1);
  } else {
    rows = await db
      .select({
        slug: companies.slug,
        name: companies.name,
        logoKey: companies.logoKey,
      })
      .from(companies)
      .where(cursor ? gt(companies.slug, cursor) : undefined)
      .orderBy(companies.name)
      .limit(limit + 1);
  }

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? items[items.length - 1].slug : null;

  return NextResponse.json(
    {
      items: items.map((r) => ({
        slug: r.slug,
        name: r.name,
        logoUrl: r.logoKey ? `${CDN}/${r.logoKey}` : null,
      })),
      nextCursor,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
}
