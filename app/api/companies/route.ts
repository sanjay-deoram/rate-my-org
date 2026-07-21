import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { companies } from "@/drizzle/schema";
import { sql, gt, ilike, desc, eq, and } from "drizzle-orm";
import { createCompanySchema } from "@/lib/schemas/company";
import { roundToOneDecimal } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const querySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().optional(),
});

const CDN = process.env.NEXT_PUBLIC_LOGO_CDN ?? "";

const statsFields = {
  slug: companies.slug,
  name: companies.name,
  logoKey: companies.logoKey,
  reviewCount: sql<number>`(SELECT COUNT(*) FROM reviews WHERE reviews.company_id = companies.id)`,
  interviewCount: sql<number>`(SELECT COUNT(*) FROM interviews WHERE interviews.company_id = companies.id)`,
  avgRating: sql<
    string | null
  >`(SELECT AVG(overall_rating) FROM reviews WHERE reviews.company_id = companies.id)`,
};

export async function GET(req: NextRequest) {
  const allowed = await checkRateLimit(req, { key: "companies-list", kind: "read" });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const parsed = querySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { search, limit, cursor } = parsed.data;

  const rows = await (search
    ? db
        .select(statsFields)
        .from(companies)
        .where(and(eq(companies.status, "approved"), ilike(companies.name, `%${search}%`)))
        .orderBy(desc(sql`similarity(${companies.name}, ${search})`), companies.name)
        .limit(limit + 1)
        .offset(cursor ? parseInt(cursor, 10) : 0)
    : db
        .select(statsFields)
        .from(companies)
        .where(
          cursor
            ? and(eq(companies.status, "approved"), gt(companies.slug, cursor))
            : eq(companies.status, "approved"),
        )
        .orderBy(companies.slug)
        .limit(limit + 1));

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  // search path: numeric offset cursor; browse path: slug keyset cursor
  const nextCursor = hasMore
    ? search
      ? String((cursor ? parseInt(cursor, 10) : 0) + limit)
      : items[items.length - 1].slug
    : null;

  return NextResponse.json(
    {
      items: items.map((r) => ({
        slug: r.slug,
        name: r.name,
        logoUrl: r.logoKey ? `${CDN}/${r.logoKey}` : null,
        reviewCount: Number(r.reviewCount),
        interviewCount: Number(r.interviewCount),
        avgRating: r.avgRating != null ? roundToOneDecimal(parseFloat(r.avgRating)) : null,
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

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  const allowed = await checkRateLimit(req, { key: "companies", kind: "write" });
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

  const parsed = createCompanySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { name, headquarters, industry, website } = parsed.data;

  // Duplicate check: same name + headquarters (case-insensitive), any status
  const [existing] = await db
    .select({ slug: companies.slug, status: companies.status })
    .from(companies)
    .where(
      and(
        sql`lower(${companies.name}) = lower(${name})`,
        sql`lower(${companies.headquarters}) = lower(${headquarters})`,
      ),
    )
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "A company with this name and location already exists.", slug: existing.slug },
      { status: 409 },
    );
  }

  // Generate a unique slug
  const baseSlug = toSlug(name);
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const [conflict] = await db
      .select({ id: companies.id })
      .from(companies)
      .where(eq(companies.slug, slug))
      .limit(1);

    if (!conflict) break;
    slug = `${baseSlug}-${toSlug(headquarters)}-${suffix}`;
    suffix++;
  }

  const [inserted] = await db
    .insert(companies)
    .values({
      name,
      headquarters,
      industry,
      website: website || null,
      slug,
      status: "pending",
    })
    .returning({
      id: companies.id,
      slug: companies.slug,
      name: companies.name,
      headquarters: companies.headquarters,
    });

  return NextResponse.json({ company: inserted }, { status: 201 });
}
