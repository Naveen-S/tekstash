"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronUp,
  Clock,
  Download,
  Folder,
  Heart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Avatar } from "@base-ui/react/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  collections,
  currentUser,
  itemTypes,
  type ItemType,
  type ItemTypeSlug,
} from "@/lib/mockdata";
import { useSidebar } from "./SidebarProvider";

/**
 * SidebarBody — the inner navigation content shared by the desktop sidebar and
 * the mobile drawer (see {@link Sidebar}). Reads directly from mock data until
 * the database lands.
 *
 * Sections mirror the reference screenshots: item types (with colored dots and
 * count / PRO badges), the most recent collections, a small library nav, the
 * Go Pro upsell, and the user account footer.
 */

/** Type accent colors from mockdata, mapped to static Tailwind classes. */
const dotClass: Record<ItemTypeSlug, string> = {
  snippet: "bg-blue-500",
  command: "bg-orange-500",
  prompt: "bg-violet-500",
  note: "bg-yellow-300",
  link: "bg-emerald-500",
  file: "bg-gray-500",
  image: "bg-pink-500",
};

/** Most recent collections, newest first — drives the "Latest collections" list. */
const recentCollections = [...collections]
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  .slice(0, 4);

export function SidebarBody() {
  const pathname = usePathname();
  const { closeMobile } = useSidebar();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <Logo />

      <nav className="scrollbar-themed flex-1 overflow-y-auto px-3 pb-4">
        <SectionLabel>Item Types</SectionLabel>
        <ul className="mb-4 flex flex-col gap-0.5">
          {itemTypes.map((type) => (
            <li key={type.id}>
              <ItemTypeLink
                type={type}
                active={pathname === type.route}
                onNavigate={closeMobile}
              />
            </li>
          ))}
        </ul>

        <SectionLabel>Latest Collections</SectionLabel>
        <ul className="mb-4 flex flex-col gap-0.5">
          {recentCollections.map((collection) => (
            <li key={collection.id}>
              <NavRow
                href={`/collections/${collection.id}`}
                icon={Folder}
                label={collection.name}
                active={pathname === `/collections/${collection.id}`}
                onNavigate={closeMobile}
              />
            </li>
          ))}
        </ul>

        <SectionLabel>Library</SectionLabel>
        <ul className="flex flex-col gap-0.5">
          <li>
            <NavRow
              href="/favorites"
              icon={Heart}
              label="Favorites"
              active={pathname === "/favorites"}
              onNavigate={closeMobile}
            />
          </li>
          <li>
            <NavRow
              href="/recent"
              icon={Clock}
              label="Recently Used"
              active={pathname === "/recent"}
              onNavigate={closeMobile}
            />
          </li>
          <li>
            <NavRow
              href="/export"
              icon={Download}
              label="Export Data"
              active={pathname === "/export"}
              onNavigate={closeMobile}
            />
          </li>
        </ul>
      </nav>

      {!currentUser.isPro && (
        <div className="px-3 pb-3">
          <GoProCard />
        </div>
      )}

      <UserFooter />
    </div>
  );
}

function Logo() {
  return (
    <div className="flex h-14 items-center gap-2 px-4">
      <div className="flex size-7 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
        T
      </div>
      <span className="text-base font-semibold tracking-tight">
        Tek<span className="text-muted-foreground">Stash</span>
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 pt-2 pb-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
      {children}
    </p>
  );
}

const navRowClass = (active: boolean) =>
  cn(
    "flex h-8 items-center gap-2.5 rounded-md px-2 text-sm transition-colors",
    active
      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  );

function ItemTypeLink({
  type,
  active,
  onNavigate,
}: {
  type: ItemType;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link href={type.route} onClick={onNavigate} className={navRowClass(active)}>
      <span
        className={cn("size-2 shrink-0 rounded-full", dotClass[type.slug])}
        aria-hidden
      />
      <span className="truncate">{type.label}</span>
      {type.tier === "pro" ? (
        <span className="ml-auto rounded-sm bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-600 dark:text-amber-400">
          PRO
        </span>
      ) : (
        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
          {type.count}
        </span>
      )}
    </Link>
  );
}

function NavRow({
  href,
  icon: Icon,
  label,
  active,
  onNavigate,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link href={href} onClick={onNavigate} className={navRowClass(active)}>
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function GoProCard() {
  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <Sparkles className="size-4 text-violet-500" />
        Go Pro
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Unlimited items, file uploads &amp; AI features. From $8/mo.
      </p>
      <Button className="mt-3 w-full" size="sm">
        Upgrade
      </Button>
    </div>
  );
}

function UserFooter() {
  return (
    <button
      type="button"
      className="flex items-center gap-2.5 border-t border-sidebar-border px-3 py-3 text-left transition-colors hover:bg-sidebar-accent"
    >
      <Avatar.Root className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-rose-500 to-orange-500 text-xs font-semibold text-white select-none">
        {currentUser.image && (
          <Avatar.Image
            src={currentUser.image}
            alt={currentUser.name}
            className="size-full object-cover"
          />
        )}
        <Avatar.Fallback>{currentUser.initials}</Avatar.Fallback>
      </Avatar.Root>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">@{currentUser.username}</p>
        <p className="truncate text-xs text-muted-foreground">
          {currentUser.isPro ? "Pro plan" : "Free plan"}
        </p>
      </div>
      <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}
