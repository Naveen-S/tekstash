import { Boxes, FolderOpen, Heart, Star } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { collections, items, workspaceStats } from "@/lib/mockdata";

/**
 * Dashboard home — the workspace overview (Phase 3).
 *
 * Header stats, a Collections rail, Pinned Items and the 10 most-recent items,
 * all driven by mock data until the database lands. Sorting/slicing happens
 * here so `mockdata` stays plain, importable constants.
 */

const byUpdatedDesc = <T extends { updatedAt: string }>(a: T, b: T) =>
  b.updatedAt.localeCompare(a.updatedAt);

export default function DashboardPage() {
  const recentCollections = [...collections].sort(byUpdatedDesc);
  const pinnedItems = items.filter((item) => item.isPinned).sort(byUpdatedDesc);
  const recentItems = [...items].sort(byUpdatedDesc).slice(0, 10);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Workspace</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your snippets, prompts, commands, notes &amp; links — all in one place.
        </p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Items"
          value={workspaceStats.totalItems}
          hint="across all types"
          icon={Boxes}
          iconChipClassName="bg-blue-500/10"
          iconClassName="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Collections"
          value={workspaceStats.totalCollections}
          hint="organized groups"
          icon={FolderOpen}
          iconChipClassName="bg-violet-500/10"
          iconClassName="text-violet-600 dark:text-violet-400"
        />
        <StatCard
          label="Favorite Items"
          value={workspaceStats.favoriteItems}
          hint="starred for quick access"
          icon={Heart}
          iconChipClassName="bg-rose-500/10"
          iconClassName="text-rose-600 dark:text-rose-400"
        />
        <StatCard
          label="Favorite Collections"
          value={workspaceStats.favoriteCollections}
          hint="starred groups"
          icon={Star}
          iconChipClassName="bg-amber-500/10"
          iconClassName="text-amber-600 dark:text-amber-400"
        />
      </section>

      {/* Recent collections */}
      <section>
        <SectionHeader title="Collections" viewAllHref="/collections" />
        <div className="scrollbar-thin -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {/* Pinned items */}
      {pinnedItems.length > 0 && (
        <section>
          <SectionHeader title="Pinned Items" viewAllHref="/pinned" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Recently used */}
      <section>
        <SectionHeader title="Recently Used" viewAllHref="/recent" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
