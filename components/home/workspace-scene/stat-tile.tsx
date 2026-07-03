import type { LucideIcon } from "lucide-react";

export function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-paper-soft rounded-xl p-4">
      <Icon size={16} className="text-token-green-deep mb-5" />
      <p className="text-3xl font-black tabular-nums">{value}</p>
      <p className="text-on-surface-variant mt-1 text-xs font-semibold">{label}</p>
    </div>
  );
}
