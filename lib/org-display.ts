export function formatEmploymentType(raw: string): string {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function timeAgo(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export const DIFFICULTY_LABELS = ["Easy", "Medium", "Hard", "Very Hard"] as const;

export type DifficultyLabel = (typeof DIFFICULTY_LABELS)[number];

export function difficultyLabel(n: number): DifficultyLabel {
  if (n <= 1) return "Easy";
  if (n <= 2) return "Medium";
  if (n <= 3) return "Hard";
  return "Very Hard";
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
