"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, X, ChevronDown, ChevronRight } from "lucide-react";

// ─── shared mock card header ───────────────────────────────────────────────

type Experience = "Great" | "Neutral" | "Negative";

const EXPERIENCE_STYLES: Record<Experience, string> = {
  Great: "bg-tertiary-fixed-dim text-on-tertiary-fixed",
  Neutral: "bg-surface-container-high text-on-surface-variant",
  Negative: "bg-destructive text-white",
};

function CardMeta({ difficulty, experience }: { difficulty: number; experience: Experience }) {
  const labels = ["", "Very Easy", "Easy", "Medium", "Hard", "Very Hard"];
  return (
    <div className="mb-5 flex items-start justify-between">
      <div>
        <h3 className="mb-1 text-xl font-bold">Senior Software Engineer</h3>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
            Engineering
          </span>
          <span className="text-outline-variant font-mono text-sm">·</span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase",
              EXPERIENCE_STYLES[experience],
            )}
          >
            {experience}
          </span>
          <span className="text-outline-variant font-mono text-sm">·</span>
          <span className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
            3 days ago
          </span>
        </div>
      </div>
      <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
        <div className="bg-surface-container-high rounded px-3 py-1">
          <span className="font-mono text-xs font-bold tracking-widest uppercase">
            {labels[difficulty]}
          </span>
        </div>
        <span className="text-on-surface-variant font-mono text-xs">Offer: No</span>
      </div>
    </div>
  );
}

function DifficultyBar({ difficulty }: { difficulty: number }) {
  return (
    <div className="mb-5 flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`h-1.5 w-8 rounded-full ${i <= difficulty ? "bg-primary" : "bg-surface-container-highest"}`}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VARIATION A — Round Builder
// ═══════════════════════════════════════════════════════════════════

const ROUND_TYPES = [
  "Phone Screen",
  "Technical",
  "Behavioral",
  "Technical + Behavioral",
  "System Design",
  "Take-Home",
  "Presentation",
  "HR / Culture",
  "Final / Offer",
  "Other",
] as const;

type RoundType = (typeof ROUND_TYPES)[number];

interface Round {
  id: number;
  type: RoundType;
  notes: string;
}

const ROUND_TAG_CLS = "border border-foreground/20 text-foreground";

function VariationAForm() {
  const [rounds, setRounds] = useState<Round[]>([{ id: 1, type: "Phone Screen", notes: "" }]);
  const [nextId, setNextId] = useState(2);

  function addRound() {
    setRounds((r) => [...r, { id: nextId, type: "Technical", notes: "" }]);
    setNextId((n) => n + 1);
  }

  function removeRound(id: number) {
    setRounds((r) => r.filter((round) => round.id !== id));
  }

  function updateRound(id: number, patch: Partial<Round>) {
    setRounds((r) => r.map((round) => (round.id === id ? { ...round, ...patch } : round)));
  }

  return (
    <div className="space-y-4">
      {rounds.map((round, idx) => (
        <div key={round.id} className="bg-surface-container-low space-y-3 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-outline font-mono text-xs tracking-widest uppercase">
                Round {idx + 1}
              </span>
              <select
                value={round.type}
                onChange={(e) => updateRound(round.id, { type: e.target.value as RoundType })}
                className="bg-surface-container-lowest border-outline-variant/20 rounded-lg border px-3 py-1.5 text-xs font-bold outline-none"
              >
                {ROUND_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {rounds.length > 1 && (
              <button
                onClick={() => removeRound(round.id)}
                className="text-outline-variant hover:text-destructive transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <textarea
            rows={3}
            value={round.notes}
            onChange={(e) => updateRound(round.id, { notes: e.target.value })}
            placeholder="Describe what happened in this round..."
            className="bg-surface-container-lowest placeholder:text-outline-variant focus:ring-primary w-full resize-none rounded-lg border-0 p-3 text-sm leading-relaxed outline-none focus:ring-1"
          />
        </div>
      ))}
      <button
        onClick={addRound}
        className="border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-foreground flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-5 py-3 text-sm font-medium transition-all"
      >
        <Plus size={16} /> Add Round
      </button>
    </div>
  );
}

function VariationACard() {
  const rounds: { type: RoundType; notes: string }[] = [
    {
      type: "Phone Screen",
      notes:
        "30-min recruiter call. Mostly background and motivation questions. Very conversational.",
    },
    {
      type: "Technical + Behavioral",
      notes:
        "45-min combined round — started with a LeetCode medium, then pivoted to STAR-format behavioral questions. One interviewer handled both.",
    },
    {
      type: "System Design",
      notes:
        "60-min system design: design a rate limiter. Expected familiarity with distributed systems and trade-offs.",
    },
    {
      type: "Final / Offer",
      notes:
        "30-min chat with the hiring manager. Culture fit, team dynamics, and comp discussion.",
    },
  ];

  return (
    <article className="bg-surface-container-lowest rounded-xl p-8">
      <CardMeta difficulty={4} experience="Negative" />
      <DifficultyBar difficulty={4} />
      <div className="space-y-3">
        {rounds.map((round, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex flex-col items-center gap-1 pt-1">
              <div className="bg-primary text-primary-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold">
                {idx + 1}
              </div>
              {idx < rounds.length - 1 && (
                <div
                  className="bg-outline-variant/20 my-0.5 w-px flex-1"
                  style={{ minHeight: 16 }}
                />
              )}
            </div>
            <div className="flex-1 pb-3">
              <span
                className={cn(
                  "mb-1.5 inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase",
                  ROUND_TAG_CLS,
                )}
              >
                {round.type}
              </span>
              <p className="text-on-surface-variant text-sm leading-relaxed">{round.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VARIATION B — Guided Sections
// ═══════════════════════════════════════════════════════════════════

function VariationBForm() {
  const [values, setValues] = useState({ overview: "", technical: "", behavioral: "", other: "" });

  const sections = [
    {
      key: "overview" as const,
      label: "Process Overview",
      required: true,
      placeholder:
        "How many rounds? What was the timeline? Walk us through the sequence from first contact to final decision...",
    },
    {
      key: "technical" as const,
      label: "Technical",
      required: false,
      placeholder:
        "What technical topics came up? Coding challenges, system design, architecture questions...",
    },
    {
      key: "behavioral" as const,
      label: "Behavioral",
      required: false,
      placeholder:
        "What behavioral themes did they probe? Common STAR questions, team dynamics, leadership scenarios...",
    },
    {
      key: "other" as const,
      label: "Other",
      required: false,
      placeholder:
        "Take-home assignments, presentations, case studies, or anything that doesn't fit above...",
    },
  ];

  return (
    <div className="space-y-8">
      {sections.map((s) => (
        <div key={s.key} className="space-y-3">
          <label className="text-on-surface-variant flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
            {s.label}
            {s.required ? (
              <span className="text-destructive">required</span>
            ) : (
              <span className="text-outline-variant/60">optional</span>
            )}
          </label>
          <textarea
            rows={4}
            value={values[s.key]}
            onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
            placeholder={s.placeholder}
            className="bg-surface-container-low placeholder:text-outline-variant focus:ring-primary w-full resize-none rounded-xl border-0 p-4 text-sm leading-relaxed outline-none focus:ring-1"
          />
        </div>
      ))}
    </div>
  );
}

function VariationBCard() {
  const [open, setOpen] = useState<string[]>(["overview", "technical"]);

  const sections = [
    {
      key: "overview",
      label: "Overview",
      content:
        "4 rounds over 3 weeks. Recruiter screen → take-home (4h) → technical panel → behavioral with hiring manager. Response times were slow between rounds — waited 8 days for feedback after the technical.",
    },
    {
      key: "technical",
      label: "Technical",
      content:
        "Take-home: build a REST API with auth in 4 hours. Technical panel: two interviewers, one LeetCode medium (sliding window), one system design for a URL shortener. Both 45 minutes each.",
    },
    {
      key: "behavioral",
      label: "Behavioral",
      content:
        "Final round with hiring manager. Standard STAR format. Questions around leadership, handling ambiguity, and a time you disagreed with a manager.",
    },
    { key: "other", label: "Other", content: null },
  ];

  function toggle(key: string) {
    setOpen((o) => (o.includes(key) ? o.filter((k) => k !== key) : [...o, key]));
  }

  return (
    <article className="bg-surface-container-lowest rounded-xl p-8">
      <CardMeta difficulty={4} experience="Neutral" />
      <DifficultyBar difficulty={4} />
      <div className="space-y-1">
        {sections
          .filter((s) => s.content)
          .map((s) => (
            <div key={s.key} className="overflow-hidden rounded-lg">
              <button
                onClick={() => toggle(s.key)}
                className="hover:bg-surface-container-low flex w-full items-center justify-between px-4 py-3 text-left text-xs font-bold tracking-widest uppercase transition-colors"
              >
                <span>{s.label}</span>
                {open.includes(s.key) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {open.includes(s.key) && (
                <div className="px-4 pb-4">
                  <p className="text-on-surface-variant text-sm leading-relaxed">{s.content}</p>
                </div>
              )}
            </div>
          ))}
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VARIATION C — Type Tags + Rich Textarea
// ═══════════════════════════════════════════════════════════════════

const ROUND_TYPE_OPTIONS = [
  "Phone Screen",
  "Technical",
  "Behavioral",
  "Technical + Behavioral",
  "System Design",
  "Take-Home",
  "Presentation",
  "HR / Culture",
  "Other",
] as const;

function VariationCForm() {
  const [selected, setSelected] = useState<string[]>(["Phone Screen", "Technical"]);
  const [description, setDescription] = useState("");

  function toggle(type: string) {
    setSelected((s) => (s.includes(type) ? s.filter((t) => t !== type) : [...s, type]));
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
          What round types occurred?{" "}
          <span className="text-outline-variant/60">(select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {ROUND_TYPE_OPTIONS.map((type) => {
            const active = selected.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggle(type)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-bold tracking-wide transition-all",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-foreground",
                )}
              >
                {active && <span className="mr-1.5">✓</span>}
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
          Walk us through it
        </label>
        <textarea
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the full process in your own words — what happened in each stage, how long it took, what questions came up, and anything that surprised you..."
          className="bg-surface-container-low placeholder:text-outline-variant focus:ring-primary w-full resize-none rounded-xl border-0 p-4 text-sm leading-relaxed outline-none focus:ring-1"
        />
      </div>
    </div>
  );
}

function VariationCCard() {
  const tags: (typeof ROUND_TYPE_OPTIONS)[number][] = ["Phone Screen", "Technical", "Behavioral"];
  const description =
    "Started with a 30-min recruiter call — very standard background check. Then a 45-min technical screen with two LeetCode mediums (arrays, DP). Final round was a behavioral panel with 2 senior engineers, heavy STAR format. Total of 3 rounds across 2 weeks. Communication was fast, heard back within 2 days each time. Process felt fair but the technical bar was high.";

  return (
    <article className="bg-surface-container-lowest rounded-xl p-8">
      <CardMeta difficulty={3} experience="Great" />
      <DifficultyBar difficulty={3} />
      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded-full px-3 py-1 font-mono text-[10px] font-bold tracking-wider uppercase",
              ROUND_TAG_CLS,
            )}
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════

const VARIATIONS = [
  {
    id: "A",
    title: "Round Builder",
    tagline: "Add each round individually — type + notes per round",
    form: <VariationAForm />,
    card: <VariationACard />,
  },
  {
    id: "B",
    title: "Guided Sections",
    tagline: "Fixed sections: Overview, Technical, Behavioral, Other",
    form: <VariationBForm />,
    card: <VariationBCard />,
  },
  {
    id: "C",
    title: "Type Tags + Description",
    tagline: "Pick round types that occurred, then describe freely",
    form: <VariationCForm />,
    card: <VariationCCard />,
  },
];

export default function DesignPreviewPage() {
  return (
    <div className="bg-background min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-4">
        <p className="text-outline font-mono text-xs tracking-widest uppercase">Design Preview</p>
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Interview Process Variations</h1>
        <p className="text-on-surface-variant mb-16 max-w-xl">
          Three approaches to capturing interview rounds. Each shows the form input (left) and how
          it renders on the interview card (right).
        </p>

        <div className="space-y-24">
          {VARIATIONS.map((v) => (
            <section key={v.id} className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full font-mono font-black">
                  {v.id}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{v.title}</h2>
                  <p className="text-on-surface-variant text-sm">{v.tagline}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-outline font-mono text-xs tracking-widest uppercase">
                    Form Input
                  </p>
                  <div className="bg-surface-container-low rounded-2xl p-8">{v.form}</div>
                </div>
                <div className="space-y-3">
                  <p className="text-outline font-mono text-xs tracking-widest uppercase">
                    Card Display
                  </p>
                  {v.card}
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="border-outline-variant/20 mt-16 border-t pt-8 text-center">
          <p className="text-on-surface-variant text-sm">
            Temp preview page — delete{" "}
            <code className="bg-surface-container-high rounded px-1.5 py-0.5 text-xs">
              app/design-preview/
            </code>{" "}
            after picking a variation.
          </p>
        </div>
      </div>
    </div>
  );
}
