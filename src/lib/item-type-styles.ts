/**
 * Per-type visual styling for items and collections.
 *
 * Tailwind v4 only generates classes it finds as complete literal strings, so
 * every accent class is written out in full here (no template interpolation).
 * Colors mirror the `color` hex on each system type in {@link mockdata} and the
 * sidebar dots in `SidebarBody`.
 */
import {
  Code,
  File as FileIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import type { ItemTypeSlug } from "./mockdata";

export interface ItemTypeStyle {
  /** lucide icon representing the type. */
  icon: LucideIcon;
  /** Solid dot/marker background. */
  dot: string;
  /** Accent foreground for icons and badge text. */
  text: string;
  /** Tinted background for icon chips and badges. */
  chip: string;
  /** Left accent border (pair with `border-l-2`). */
  borderL: string;
  /** Faint card background wash. */
  tint: string;
}

export const itemTypeStyles: Record<ItemTypeSlug, ItemTypeStyle> = {
  snippet: {
    icon: Code,
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    chip: "bg-blue-500/10",
    borderL: "border-l-blue-500",
    tint: "bg-blue-500/[0.04]",
  },
  command: {
    icon: Terminal,
    dot: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    chip: "bg-orange-500/10",
    borderL: "border-l-orange-500",
    tint: "bg-orange-500/[0.04]",
  },
  prompt: {
    icon: Sparkles,
    dot: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    chip: "bg-violet-500/10",
    borderL: "border-l-violet-500",
    tint: "bg-violet-500/[0.04]",
  },
  note: {
    icon: StickyNote,
    dot: "bg-yellow-400",
    text: "text-yellow-600 dark:text-yellow-400",
    chip: "bg-yellow-400/10",
    borderL: "border-l-yellow-400",
    tint: "bg-yellow-400/[0.04]",
  },
  link: {
    icon: LinkIcon,
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    chip: "bg-emerald-500/10",
    borderL: "border-l-emerald-500",
    tint: "bg-emerald-500/[0.04]",
  },
  file: {
    icon: FileIcon,
    dot: "bg-gray-500",
    text: "text-gray-600 dark:text-gray-400",
    chip: "bg-gray-500/10",
    borderL: "border-l-gray-500",
    tint: "bg-gray-500/[0.04]",
  },
  image: {
    icon: ImageIcon,
    dot: "bg-pink-500",
    text: "text-pink-600 dark:text-pink-400",
    chip: "bg-pink-500/10",
    borderL: "border-l-pink-500",
    tint: "bg-pink-500/[0.04]",
  },
};

/** Singular display label for a type slug, e.g. "snippet" → "Snippet". */
export function typeLabel(slug: ItemTypeSlug): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}
