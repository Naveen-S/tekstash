/**
 * Mock data — single source of truth for the dashboard UI.
 *
 * This is a temporary stand-in for the database. It powers the workspace
 * dashboard (sidebar item types, collection cards, recently-used items,
 * header stats) until Prisma + Neon are wired up. Keep it as plain data:
 * no helpers, no derived logic — just typed constants to import.
 *
 * Structure mirrors the spec in context/project-overview.md (§3, §5) and the
 * reference screenshots in context/screenshots/.
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type ItemTypeSlug =
  | "snippet"
  | "prompt"
  | "note"
  | "command"
  | "link"
  | "file"
  | "image";

/** Drives storage + rendering. See project-overview §3.1. */
export type ContentCategory = "text" | "url" | "file";

export type Tier = "free" | "pro";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  /** Avatar URL, or null to fall back to initials. */
  image: string | null;
  /** Initials shown when there is no avatar image. */
  initials: string;
  isPro: boolean;
}

export interface ItemType {
  id: string;
  /** Stable system identifier, e.g. "snippet". */
  slug: ItemTypeSlug;
  /** Singular display name, e.g. "Snippet". */
  name: string;
  /** Plural label used in the sidebar nav, e.g. "Snippets". */
  label: string;
  contentCategory: ContentCategory;
  tier: Tier;
  /** Hex accent color for borders/dots. */
  color: string;
  /** lucide-react icon name. */
  icon: string;
  /** Route to this type's listing page. */
  route: string;
  /** Item count shown as the sidebar badge. */
  count: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  /** Slug of the type this collection holds most of — drives card color. */
  dominantTypeSlug: ItemTypeSlug;
  itemCount: number;
  isFavorite: boolean;
  updatedAt: string;
}

export interface Item {
  id: string;
  title: string;
  typeSlug: ItemTypeSlug;
  /** Text/markdown body for text types; null for url/file types. */
  content: string | null;
  /** Target URL for `link` items. */
  url: string | null;
  /** Original filename for `file`/`image` items. */
  fileName: string | null;
  /** File size in bytes for `file`/`image` items. */
  fileSize: number | null;
  /** R2 object URL for `file`/`image` items. */
  fileUrl: string | null;
  /** Language hint for syntax highlighting on code blocks. */
  language: string | null;
  description: string | null;
  tags: string[];
  /** IDs of collections this item belongs to (many-to-many). */
  collectionIds: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Header summary cards on the dashboard. */
export interface WorkspaceStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

// ─────────────────────────────────────────────
// Current logged-in user
// ─────────────────────────────────────────────

export const currentUser: User = {
  id: "user_1",
  name: "Nikhil K",
  username: "nikhil_k",
  email: "nikhil@tekstash.dev",
  image: null,
  initials: "NK",
  isPro: false,
};

// ─────────────────────────────────────────────
// Item types (system types — fixed set)
// ─────────────────────────────────────────────

export const itemTypes: ItemType[] = [
  {
    id: "type_snippet",
    slug: "snippet",
    name: "Snippet",
    label: "Snippets",
    contentCategory: "text",
    tier: "free",
    color: "#3b82f6",
    icon: "Code",
    route: "/items/snippets",
    count: 128,
  },
  {
    id: "type_command",
    slug: "command",
    name: "Command",
    label: "Commands",
    contentCategory: "text",
    tier: "free",
    color: "#f97316",
    icon: "Terminal",
    route: "/items/commands",
    count: 54,
  },
  {
    id: "type_prompt",
    slug: "prompt",
    name: "Prompt",
    label: "Prompts",
    contentCategory: "text",
    tier: "free",
    color: "#8b5cf6",
    icon: "Sparkles",
    route: "/items/prompts",
    count: 37,
  },
  {
    id: "type_note",
    slug: "note",
    name: "Note",
    label: "Notes",
    contentCategory: "text",
    tier: "free",
    color: "#fde047",
    icon: "StickyNote",
    route: "/items/notes",
    count: 22,
  },
  {
    id: "type_link",
    slug: "link",
    name: "Link",
    label: "Links",
    contentCategory: "url",
    tier: "free",
    color: "#10b981",
    icon: "Link",
    route: "/items/links",
    count: 61,
  },
  {
    id: "type_file",
    slug: "file",
    name: "File",
    label: "Files",
    contentCategory: "file",
    tier: "pro",
    color: "#6b7280",
    icon: "File",
    route: "/items/files",
    count: 6,
  },
  {
    id: "type_image",
    slug: "image",
    name: "Image",
    label: "Images",
    contentCategory: "file",
    tier: "pro",
    color: "#ec4899",
    icon: "Image",
    route: "/items/images",
    count: 4,
  },
];

// ─────────────────────────────────────────────
// Collections
// ─────────────────────────────────────────────

export const collections: Collection[] = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    description: "Reusable component recipes and hook patterns.",
    dominantTypeSlug: "snippet",
    itemCount: 24,
    isFavorite: true,
    updatedAt: "2026-05-30T09:12:00.000Z",
  },
  {
    id: "col_interview_prep",
    name: "Interview Prep",
    description: "Algorithms, system design notes and talking points.",
    dominantTypeSlug: "snippet",
    itemCount: 18,
    isFavorite: false,
    updatedAt: "2026-05-29T15:40:00.000Z",
  },
  {
    id: "col_context_files",
    name: "Context Files",
    description: "Project context docs for onboarding and AI agents.",
    dominantTypeSlug: "file",
    itemCount: 9,
    isFavorite: false,
    updatedAt: "2026-05-28T11:05:00.000Z",
  },
  {
    id: "col_python_snippets",
    name: "Python Snippets",
    description: "Handy Python one-liners and utilities.",
    dominantTypeSlug: "snippet",
    itemCount: 31,
    isFavorite: true,
    updatedAt: "2026-05-27T18:22:00.000Z",
  },
  {
    id: "col_shell_devops",
    name: "Shell & DevOps",
    description: "Terminal commands, Docker and CI recipes.",
    dominantTypeSlug: "command",
    itemCount: 27,
    isFavorite: false,
    updatedAt: "2026-05-26T08:50:00.000Z",
  },
  {
    id: "col_ai_prompts",
    name: "AI Prompts",
    description: "System messages and prompts for coding agents.",
    dominantTypeSlug: "prompt",
    itemCount: 19,
    isFavorite: true,
    updatedAt: "2026-05-25T13:30:00.000Z",
  },
  {
    id: "col_useful_links",
    name: "Useful Links",
    description: "Docs, references and tools worth keeping around.",
    dominantTypeSlug: "link",
    itemCount: 42,
    isFavorite: false,
    updatedAt: "2026-05-24T20:15:00.000Z",
  },
  {
    id: "col_design_refs",
    name: "Design Refs",
    description: "UI inspiration screenshots and visual references.",
    dominantTypeSlug: "image",
    itemCount: 12,
    isFavorite: false,
    updatedAt: "2026-05-23T10:00:00.000Z",
  },
];

// ─────────────────────────────────────────────
// Items (recently used — populates the dashboard grid)
// ─────────────────────────────────────────────

export const items: Item[] = [
  {
    id: "item_useresource_hook",
    title: "useResource hook",
    typeSlug: "snippet",
    content:
      "export function useResource<T>(url: string) {\n" +
      "  const [data, setData] = useState<T | null>(null);\n" +
      "  const [loading, setLoading] = useState(true);\n" +
      "  useEffect(() => {\n" +
      "    fetch(url).then((r) => r.json()).then((d) => {\n" +
      "      setData(d);\n" +
      "      setLoading(false);\n" +
      "    });\n" +
      "  }, [url]);\n" +
      "  return { data, loading };\n" +
      "}",
    url: null,
    fileName: null,
    fileSize: null,
    fileUrl: null,
    language: "tsx",
    description: "Tiny data-fetching hook with loading state.",
    tags: ["react", "hooks", "typescript"],
    collectionIds: ["col_react_patterns"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-05-20T09:00:00.000Z",
    updatedAt: "2026-05-30T09:12:00.000Z",
  },
  {
    id: "item_prune_docker_images",
    title: "Prune dangling Docker images",
    typeSlug: "command",
    content: "docker image prune -f",
    url: null,
    fileName: null,
    fileSize: null,
    fileUrl: null,
    language: "bash",
    description: "Free up disk by removing untagged images.",
    tags: ["docker", "cleanup", "devops"],
    collectionIds: ["col_shell_devops"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-05-22T14:20:00.000Z",
    updatedAt: "2026-05-29T16:00:00.000Z",
  },
  {
    id: "item_code_review_system_message",
    title: "Code review system message",
    typeSlug: "prompt",
    content:
      "You are a senior engineer reviewing a pull request. Focus on correctness, " +
      "edge cases, and readability. Be concise and suggest concrete fixes.",
    url: null,
    fileName: null,
    fileSize: null,
    fileUrl: null,
    language: null,
    description: "System message for an AI code-review agent.",
    tags: ["ai", "code-review", "system-message"],
    collectionIds: ["col_ai_prompts"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-05-21T10:30:00.000Z",
    updatedAt: "2026-05-28T12:45:00.000Z",
  },
  {
    id: "item_prisma_7_announcement",
    title: "Prisma 7 announcement",
    typeSlug: "link",
    content: null,
    url: "https://www.prisma.io/blog/announcing-prisma-orm-7-0-0",
    fileName: null,
    fileSize: null,
    fileUrl: null,
    language: null,
    description: "Rust-free client and WASM query compiler.",
    tags: ["prisma", "orm", "release"],
    collectionIds: ["col_useful_links"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-05-19T08:00:00.000Z",
    updatedAt: "2026-05-27T09:00:00.000Z",
  },
  {
    id: "item_system_design_caching",
    title: "System design — caching layers",
    typeSlug: "note",
    content:
      "## Caching layers\n\n" +
      "- **Browser** — HTTP cache headers, SWR\n" +
      "- **CDN** — edge cache for static + ISR\n" +
      "- **App** — in-memory / Prisma client cache\n" +
      "- **DB** — query + connection pooling\n\n" +
      "Invalidate from the outside in.",
    url: null,
    fileName: null,
    fileSize: null,
    fileUrl: null,
    language: null,
    description: "Cheat sheet for the caching question.",
    tags: ["system-design", "caching", "interview"],
    collectionIds: ["col_interview_prep"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-05-18T19:10:00.000Z",
    updatedAt: "2026-05-26T20:30:00.000Z",
  },
  {
    id: "item_binary_search_iterative",
    title: "Binary search (iterative)",
    typeSlug: "snippet",
    content:
      "def binary_search(arr, target):\n" +
      "    lo, hi = 0, len(arr) - 1\n" +
      "    while lo <= hi:\n" +
      "        mid = (lo + hi) // 2\n" +
      "        if arr[mid] == target:\n" +
      "            return mid\n" +
      "        if arr[mid] < target:\n" +
      "            lo = mid + 1\n" +
      "        else:\n" +
      "            hi = mid - 1\n" +
      "    return -1",
    url: null,
    fileName: null,
    fileSize: null,
    fileUrl: null,
    language: "python",
    description: "Classic O(log n) lookup on a sorted array.",
    tags: ["python", "algorithms", "interview"],
    collectionIds: ["col_python_snippets", "col_interview_prep"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-05-17T12:00:00.000Z",
    updatedAt: "2026-05-25T14:00:00.000Z",
  },
  {
    id: "item_architecture_context_md",
    title: "architecture-context.md",
    typeSlug: "file",
    content: null,
    url: null,
    fileName: "architecture-context.md",
    fileSize: 8214,
    fileUrl: "https://r2.tekstash.dev/files/architecture-context.md",
    language: "markdown",
    description: "High-level architecture notes for the AI agent.",
    tags: ["context", "architecture", "docs"],
    collectionIds: ["col_context_files"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-05-16T11:00:00.000Z",
    updatedAt: "2026-05-24T11:00:00.000Z",
  },
  {
    id: "item_linear_dashboard_ref",
    title: "linear-dashboard-ref.png",
    typeSlug: "image",
    content: null,
    url: null,
    fileName: "linear-dashboard-ref.png",
    fileSize: 663552,
    fileUrl: "https://r2.tekstash.dev/images/linear-dashboard-ref.png",
    language: null,
    description: "Linear dashboard layout reference.",
    tags: ["design", "ui", "reference"],
    collectionIds: ["col_design_refs"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-05-19T16:00:00.000Z",
    updatedAt: "2026-05-23T10:00:00.000Z",
  },
  {
    id: "item_debounce_util",
    title: "debounce()",
    typeSlug: "snippet",
    content:
      "export function debounce<A extends unknown[]>(\n" +
      "  fn: (...args: A) => void,\n" +
      "  delay = 300,\n" +
      ") {\n" +
      "  let t: ReturnType<typeof setTimeout>;\n" +
      "  return (...args: A) => {\n" +
      "    clearTimeout(t);\n" +
      "    t = setTimeout(() => fn(...args), delay);\n" +
      "  };\n" +
      "}",
    url: null,
    fileName: null,
    fileSize: null,
    fileUrl: null,
    language: "typescript",
    description: "Type-safe debounce for input handlers.",
    tags: ["typescript", "utils", "performance"],
    collectionIds: ["col_react_patterns"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2026-06-01T09:00:00.000Z",
    updatedAt: "2026-06-08T14:30:00.000Z",
  },
  {
    id: "item_find_large_files",
    title: "Find the 20 largest files",
    typeSlug: "command",
    content: "du -ah . | sort -rh | head -n 20",
    url: null,
    fileName: null,
    fileSize: null,
    fileUrl: null,
    language: "bash",
    description: "Track down what is eating disk space.",
    tags: ["bash", "disk", "devops"],
    collectionIds: ["col_shell_devops"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-06-02T11:00:00.000Z",
    updatedAt: "2026-06-07T08:15:00.000Z",
  },
  {
    id: "item_tailwind_v4_docs",
    title: "Tailwind CSS v4 docs",
    typeSlug: "link",
    content: null,
    url: "https://tailwindcss.com/docs",
    fileName: null,
    fileSize: null,
    fileUrl: null,
    language: null,
    description: "CSS-first config and the @theme directive reference.",
    tags: ["tailwind", "css", "docs"],
    collectionIds: ["col_useful_links"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-06-03T13:00:00.000Z",
    updatedAt: "2026-06-05T17:45:00.000Z",
  },
  {
    id: "item_pr_description_prompt",
    title: "PR description generator",
    typeSlug: "prompt",
    content:
      "Summarize the following git diff into a concise pull request description " +
      "with a Title, a short Summary, and a bulleted list of changes. Keep it " +
      "factual and skip trivial formatting changes.",
    url: null,
    fileName: null,
    fileSize: null,
    fileUrl: null,
    language: null,
    description: "Turns a diff into a clean PR write-up.",
    tags: ["ai", "git", "productivity"],
    collectionIds: ["col_ai_prompts"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-05-30T10:00:00.000Z",
    updatedAt: "2026-06-02T10:00:00.000Z",
  },
];

// ─────────────────────────────────────────────
// Header stats
// ─────────────────────────────────────────────

export const workspaceStats: WorkspaceStats = {
  totalItems: 312,
  totalCollections: 14,
  favoriteItems: 23,
  favoriteCollections: 6,
};
