import type { Review, Interview, Sort } from "@/types/org-content";

export function sortReviews(items: Review[], sort: Sort): Review[] {
  return [...items].sort((a, b) => {
    if (sort === "highest") return b.overallRating - a.overallRating;
    if (sort === "lowest") return a.overallRating - b.overallRating;
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sort === "oldest" ? diff : -diff;
  });
}

export function sortInterviews(items: Interview[], sort: Sort): Interview[] {
  return [...items].sort((a, b) => {
    if (sort === "hardest") return b.difficulty - a.difficulty;
    if (sort === "easiest") return a.difficulty - b.difficulty;
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sort === "oldest" ? diff : -diff;
  });
}

export function toggle<T extends string>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}
