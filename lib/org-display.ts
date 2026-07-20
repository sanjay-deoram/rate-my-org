export function formatEmploymentType(raw: string): string {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function timeAgo(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export const DIFFICULTY_LABELS = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"] as const;

export type DifficultyLabel = (typeof DIFFICULTY_LABELS)[number];

export function difficultyLabel(n: number): DifficultyLabel {
  const idx = Math.min(Math.max(Math.round(n), 1), 5) - 1;
  return DIFFICULTY_LABELS[idx];
}

export function sortItemsByCreatedAt<T extends { createdAt: Date | string }>(
  items: T[],
  order: "recent" | "oldest",
): T[] {
  return [...items].sort((a, b) => {
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return order === "recent" ? -diff : diff;
  });
}
