import { db } from "@/lib/db";
import { playingWithNeon } from "@/drizzle/schema";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search — Playing With Neon",
  description: "Browse raw data from the playing_with_neon table.",
};

export default async function SearchPage() {
  const rows = await db.select().from(playingWithNeon);

  return (
    <>
      <Nav />
      <main
        className="pt-20 min-h-screen"
        style={{
          background:
            "radial-gradient(ellipse 100% 50% at 50% 0%, #e2e2e2 0%, #f3f2f2 40%, #fcf9f8 70%)",
        }}
      >
        <section className="max-w-5xl mx-auto px-8 md:px-12 py-24">
          {/* Header */}
          <div className="mb-12">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-4 block">
              Neon DB · playing_with_neon
            </span>
            <h1 className="text-5xl font-bold tracking-tighter text-foreground mb-4">
              Search
            </h1>
            <p className="text-base text-on-surface-variant max-w-lg leading-relaxed">
              Live data pulled directly from your Neon database via Drizzle ORM.
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-6 mb-10 p-4 bg-surface-container-lowest border border-surface-container-highest rounded-xl">
            <div>
              <span className="font-mono text-[10px] text-on-surface-variant block mb-0.5 uppercase tracking-widest">
                Total Rows
              </span>
              <span className="text-2xl font-black">{rows.length}</span>
            </div>
            <div className="h-8 w-px bg-surface-container-highest" />
            <div>
              <span className="font-mono text-[10px] text-on-surface-variant block mb-0.5 uppercase tracking-widest">
                Table
              </span>
              <span className="text-sm font-semibold font-mono">
                playing_with_neon
              </span>
            </div>
            <div className="h-8 w-px bg-surface-container-highest" />
            <div>
              <span className="font-mono text-[10px] text-on-surface-variant block mb-0.5 uppercase tracking-widest">
                Columns
              </span>
              <span className="text-sm font-semibold font-mono">
                id · name · value
              </span>
            </div>
          </div>

          {/* Table */}
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-surface-container-lowest border border-surface-container-highest rounded-xl text-center">
              <span className="text-4xl mb-4">🗃️</span>
              <p className="text-on-surface-variant font-medium">
                No rows found in playing_with_neon.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-lowest">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-container-highest bg-surface-container">
                    <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-widest text-on-surface-variant w-16">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                      Name
                    </th>
                    <th className="px-6 py-4 text-right font-mono text-[10px] uppercase tracking-widest text-on-surface-variant w-32">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-b border-surface-container-highest last:border-0 transition-colors duration-150 hover:bg-surface-container ${
                        i % 2 === 0 ? "" : "bg-surface-container/30"
                      }`}
                    >
                      <td className="px-6 py-4 font-mono text-[11px] text-on-surface-variant">
                        {row.id}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {row.name}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-on-surface-variant">
                        {row.value !== null && row.value !== undefined
                          ? row.value.toFixed(4)
                          : <span className="text-surface-container-highest italic text-xs">null</span>}
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
