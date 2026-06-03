/**
 * Sidebar — Phase 1 placeholder.
 *
 * Renders the left navigation shell (fixed width, full height, sidebar
 * surface). Real content — item types, latest collections, library links and
 * the Go Pro card — arrives in a later dashboard phase. For now it is just a
 * labelled placeholder. Hidden below `md` where it will become a drawer later.
 */
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex flex-1 items-center justify-center">
        <h2 className="text-lg font-semibold text-muted-foreground">Sidebar</h2>
      </div>
    </aside>
  );
}
