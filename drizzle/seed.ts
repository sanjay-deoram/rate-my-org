import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { companies, reviews, interviews } from "./schema";
import { sql } from "drizzle-orm";

config({ path: ".env" });

const client = neon(process.env.DATABASE_URL!);
const db = drizzle({ client });

async function seed() {
  console.log("Seeding Stripe...");

  // Insert Stripe (idempotent)
  const [stripe] = await db
    .insert(companies)
    .values({
      name: "Stripe",
      slug: "stripe",
      industry: "Financial Technology",
      headquarters: "San Francisco, CA",
      website: "https://stripe.com",
      size: "5,001–10,000",
      founded: 2010,
      description: "Financial infrastructure for the internet",
    })
    .onConflictDoNothing()
    .returning();

  // If already existed, look it up
  const stripeId =
    stripe?.id ??
    (
      await db
        .select({ id: companies.id })
        .from(companies)
        .where(sql`slug = 'stripe'`)
        .limit(1)
    )[0]?.id;

  if (!stripeId) throw new Error("Could not resolve Stripe company id");

  // Seed reviews
  await db
    .insert(reviews)
    .values([
      {
        companyId: stripeId,
        overallRating: 5,
        employmentStatus: "current_employee",
        employmentType: "full_time",
        jobTitle: "Software Engineer L4",
        headline: "The highest bar I've ever encountered.",
        pros: "Unrivaled technical talent. You are surrounded by people who wrote the books you learned from. Operational rigor is second to none.",
        cons: "The internal tooling is so specialized it can be hard to map back to industry standards if you leave. Fast pace can be draining.",
        adviceToManagement:
          "Management truly cares about the craft. It's not just about shipping; it's about shipping the right way. If you want to grow as an engineer, there is no better place on Earth right now.",
      },
      {
        companyId: stripeId,
        overallRating: 4,
        employmentStatus: "current_employee",
        employmentType: "full_time",
        jobTitle: "Product Manager",
        headline: "Demanding but deeply rewarding culture.",
        pros: "Extreme clarity of mission. Decisions are made through rigorous writing and debate. Compensation is at the top of the market.",
        cons: "Work-life balance can skew poorly during major product launches. The 'Stripe way' can feel dogmatic to newcomers.",
        adviceToManagement:
          "Everything is documented. The friction to get information is zero, which means you spend more time building and less time in meetings.",
      },
      {
        companyId: stripeId,
        overallRating: 4,
        employmentStatus: "former_employee",
        formerYear: 2023,
        employmentType: "full_time",
        jobTitle: "Data Engineer",
        headline: "Great learning environment, intense pace.",
        pros: "World-class infrastructure and data pipelines. Smart colleagues everywhere. Strong on-boarding program.",
        cons: "Long hours are normalized. Hard to fully disconnect. Promotion cycles can feel opaque.",
        adviceToManagement:
          "Invest more in mid-level mentorship. The jump from L3 to L4 felt unsupported compared to senior levels.",
      },
    ])
    .onConflictDoNothing();

  // Seed interviews
  await db
    .insert(interviews)
    .values([
      {
        companyId: stripeId,
        roleTitle: "Software Engineer",
        department: "Payments",
        difficulty: 4,
        overallExperience: "Great",
        rounds: [
          {
            type: "Phone Screen",
            notes: "30-min recruiter call. Background and motivation questions.",
          },
          {
            type: "Technical",
            notes: "LeetCode medium — sliding window array problem. 45 minutes.",
          },
          {
            type: "System Design",
            notes:
              "Design a payment processing pipeline. Focus on idempotency and fault tolerance.",
          },
          {
            type: "Behavioral",
            notes: "Deep-dive on past projects. Interviewers gave real-time feedback at the end.",
          },
        ],
        offerReceived: "Yes",
      },
      {
        companyId: stripeId,
        roleTitle: "Product Manager",
        department: "Platform",
        difficulty: 4,
        overallExperience: "Great",
        rounds: [
          { type: "Phone Screen", notes: "Initial recruiter screen, 20 minutes." },
          {
            type: "Phone Screen",
            notes: "Second screen with hiring manager. Product philosophy discussion.",
          },
          {
            type: "Technical + Behavioral",
            notes:
              "Product sense and analytical round. Estimation question on Stripe's transaction volume.",
          },
          {
            type: "Behavioral",
            notes: "Cross-functional leadership scenario. Stakeholder conflict resolution.",
          },
          {
            type: "Final / Offer",
            notes: "Two stakeholder scenario interviews back-to-back. Very structured.",
          },
        ],
        offerReceived: "Yes but Declined",
      },
    ])
    .onConflictDoNothing();

  console.log("Done. Stripe seeded with 3 reviews and 2 interviews.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
