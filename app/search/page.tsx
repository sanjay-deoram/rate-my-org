import { db } from "@/lib/db";
import { companies } from "@/drizzle/schema";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search — Companies",
  description: "Browse companies in the database.",
};

export default async function SearchPage() {
  const rows = await db.select().from(companies).limit(50);

  return (
    <>
      <Nav />
      <main
        className="min-h-screen pt-20"
        style={{
          background:
            "radial-gradient(ellipse 100% 50% at 50% 0%, #e2e2e2 0%, #f3f2f2 40%, #fcf9f8 70%)",
        }}
      >
        <section className="mx-auto max-w-5xl px-5 py-20 md:px-12 md:py-24">
          {/* Header */}
          <div className="mb-12">
            <span className="text-on-surface-variant mb-4 block font-mono text-[10px] tracking-widest uppercase">
              Neon DB · companies
            </span>
            <h1 className="text-foreground mb-4 text-3xl font-black md:text-5xl">Companies</h1>
            <p className="text-on-surface-variant max-w-lg text-base leading-relaxed">
              Live data pulled directly from your Neon database via Drizzle ORM.
            </p>
          </div>

          {/* Stats bar */}
          <div className="bg-surface-container-lowest border-surface-container-highest mb-10 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:gap-6">
            <div>
              <span className="text-on-surface-variant mb-0.5 block font-mono text-[10px] tracking-widest uppercase">
                Total Rows
              </span>
              <span className="text-2xl font-black">{rows.length}</span>
            </div>
            <div className="bg-surface-container-highest h-px w-full sm:h-8 sm:w-px" />
            <div>
              <span className="text-on-surface-variant mb-0.5 block font-mono text-[10px] tracking-widest uppercase">
                Table
              </span>
              <span className="font-mono text-sm font-semibold">companies</span>
            </div>
            <div className="bg-surface-container-highest h-px w-full sm:h-8 sm:w-px" />
            <div>
              <span className="text-on-surface-variant mb-0.5 block font-mono text-[10px] tracking-widest uppercase">
                Columns
              </span>
              <span className="font-mono text-sm font-semibold">slug · name · logoKey</span>
            </div>
          </div>

          {/* Table */}
          {rows.length === 0 ? (
            <div className="bg-surface-container-lowest border-surface-container-highest flex flex-col items-center justify-center rounded-xl border py-24 text-center">
              <span className="mb-4 text-4xl">🗃️</span>
              <p className="text-on-surface-variant font-medium">No rows found in companies.</p>
            </div>
          ) : (
            <div className="scrollbar-design border-surface-container-highest bg-surface-container-lowest overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="border-surface-container-highest bg-surface-container border-b">
                    <th className="text-on-surface-variant px-6 py-4 text-left font-mono text-[10px] tracking-widest uppercase">
                      Slug
                    </th>
                    <th className="text-on-surface-variant px-6 py-4 text-left font-mono text-[10px] tracking-widest uppercase">
                      Name
                    </th>
                    <th className="text-on-surface-variant px-6 py-4 text-left font-mono text-[10px] tracking-widest uppercase">
                      Logo Key
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-surface-container-highest hover:bg-surface-container border-b transition-colors duration-150 last:border-0 ${
                        i % 2 === 0 ? "" : "bg-surface-container/30"
                      }`}
                    >
                      <td className="text-on-surface-variant px-6 py-4 font-mono text-[11px]">
                        {row.slug}
                      </td>
                      <td className="text-foreground px-6 py-4 font-semibold">{row.name}</td>
                      <td className="text-on-surface-variant px-6 py-4 font-mono text-[11px]">
                        {row.logoKey ?? (
                          <span className="text-surface-container-highest text-xs italic">
                            null
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
