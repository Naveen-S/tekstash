import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * SectionHeader — a dashboard section title with an optional "View all" link
 * on the right (e.g. "Collections", "Recently Used").
 */
export function SectionHeader({
  title,
  viewAllHref,
}: {
  title: string;
  viewAllHref?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold tracking-wide text-foreground">
        {title}
      </h2>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
