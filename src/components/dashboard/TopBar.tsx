import { Plus, Search, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "./SidebarTrigger";

/**
 * TopBar — dashboard header.
 *
 * The sidebar trigger is wired up; the search field, theme toggle and "New
 * Item" button remain display-only for now. Their behaviour (search, theme
 * switching, item creation drawer) lands in later phases.
 */
export function TopBar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search snippets, prompts, commands, titles, types..."
          aria-label="Search"
          className="h-9 pl-8"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="icon" aria-label="Toggle theme">
          <Sun />
        </Button>
        <Button>
          <Plus />
          New Item
        </Button>
      </div>
    </header>
  );
}
