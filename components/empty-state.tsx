export function EmptyState({ query }: { query: string }) {
  return (
    <div className="py-20 text-center">
      <p className="text-on-surface-variant text-sm">
        {query ? `No results for "${query}"` : "Nothing here yet. Be the first to share!"}
      </p>
    </div>
  );
}
