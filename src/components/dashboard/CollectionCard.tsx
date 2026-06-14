import Link from "next/link";
import { Heart } from "lucide-react";

import { cn, formatRelativeDate } from "@/lib/utils";
import { itemTypeStyles } from "@/lib/item-type-styles";
import type { Collection } from "@/lib/mockdata";

/**
 * CollectionCard — a collection summary tile. The card is washed and iconed by
 * the type it holds most of (`dominantTypeSlug`), per the project overview's
 * "card color = most-held type" rule. Fixed width so it tiles in the horizontal
 * Collections rail.
 */
export function CollectionCard({ collection }: { collection: Collection }) {
  const style = itemTypeStyles[collection.dominantTypeSlug];
  const Icon = style.icon;

  return (
    <Link
      href={`/collections/${collection.id}`}
      className={cn(
        "group flex w-64 shrink-0 flex-col rounded-xl border border-border p-4 transition-colors hover:border-foreground/20",
        style.tint,
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            style.chip,
          )}
        >
          <Icon className={cn("size-4.5", style.text)} />
        </span>
        {collection.isFavorite && (
          <Heart className="size-4 fill-rose-500 text-rose-500" aria-label="Favorite" />
        )}
      </div>

      <h3 className="mt-3 truncate font-medium">{collection.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {collection.description}
      </p>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="tabular-nums">{collection.itemCount} items</span>
        <span aria-hidden>·</span>
        <span>{formatRelativeDate(collection.updatedAt)}</span>
      </div>
    </Link>
  );
}
