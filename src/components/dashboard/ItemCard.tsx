import Link from "next/link";
import { Pin } from "lucide-react";

import { cn, formatBytes, formatRelativeDate } from "@/lib/utils";
import { itemTypeStyles, typeLabel } from "@/lib/item-type-styles";
import type { Item } from "@/lib/mockdata";

/**
 * ItemCard — a single item tile for the dashboard grids (pinned / recent).
 *
 * Border-left accent matches the item's type, the body preview adapts to the
 * content kind (code/text, link, or file), and tags render as muted pills.
 */
export function ItemCard({ item }: { item: Item }) {
  const style = itemTypeStyles[item.typeSlug];

  return (
    <Link
      href={`/items/${item.id}`}
      className={cn(
        "group flex flex-col rounded-xl border border-l-2 border-border bg-card p-4 transition-colors hover:border-foreground/20",
        style.borderL,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          <span className={cn("size-2 rounded-full", style.dot)} aria-hidden />
          <span className={style.text}>{typeLabel(item.typeSlug)}</span>
        </span>
        {item.isPinned && (
          <Pin
            className="size-3.5 fill-muted-foreground/40 text-muted-foreground"
            aria-label="Pinned"
          />
        )}
      </div>

      <h3 className="mt-2 truncate font-medium">{item.title}</h3>

      <ItemPreview item={item} />

      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>Updated {formatRelativeDate(item.updatedAt)}</span>
      </div>
    </Link>
  );
}

/** Body preview, varying by content kind (text/code, link, or file). */
function ItemPreview({ item }: { item: Item }) {
  if (item.url) {
    return (
      <p className="mt-2 truncate text-sm text-emerald-600 dark:text-emerald-400">
        {item.url}
      </p>
    );
  }

  if (item.fileName) {
    return (
      <p className="mt-2 truncate text-sm text-muted-foreground">
        {item.fileName}
        {item.fileSize != null && (
          <span className="ml-1.5 tabular-nums">
            · {formatBytes(item.fileSize)}
          </span>
        )}
      </p>
    );
  }

  if (item.content) {
    return (
      <pre
        className={cn(
          "mt-2 line-clamp-3 overflow-hidden rounded-md bg-muted/60 p-2 text-xs whitespace-pre-wrap text-muted-foreground",
          item.language && "font-mono",
        )}
      >
        {item.content}
      </pre>
    );
  }

  return null;
}
