export function formatEmploymentType(raw: string): string {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (seconds < 60) return rtf.format(-seconds, "second");
  if (seconds < 3600) return rtf.format(-Math.floor(seconds / 60), "minute");
  if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), "hour");
  if (seconds < 2592000) return rtf.format(-Math.floor(seconds / 86400), "day");
  if (seconds < 31536000) return rtf.format(-Math.floor(seconds / 2592000), "month");
  return rtf.format(-Math.floor(seconds / 31536000), "year");
}

export function difficultyLabel(n: number): string {
  if (n <= 1) return "Easy";
  if (n <= 2) return "Easy–Medium";
  if (n <= 3) return "Medium";
  if (n <= 4) return "Hard";
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
