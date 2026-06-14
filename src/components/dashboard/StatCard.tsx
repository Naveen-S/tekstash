import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * StatCard — a single workspace summary metric (e.g. "Total Items").
 *
 * Shows a label, a large value and a short hint, with a tinted icon chip in the
 * top-right. Colors are passed in as full Tailwind class strings so v4 can pick
 * them up at build time.
 */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  iconChipClassName,
  iconClassName,
}: {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  iconChipClassName: string;
  iconClassName: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/20">
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            iconChipClassName,
          )}
        >
          <Icon className={cn("size-4", iconClassName)} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
