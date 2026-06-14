"use client";

import { Dialog } from "@base-ui/react/dialog";

import { SidebarBody } from "./SidebarBody";
import { useSidebar } from "./SidebarProvider";

/**
 * Sidebar — responsive navigation shell.
 *
 * - **Desktop (`md+`)**: a sticky, full-height `aside` that collapses to zero
 *   width (and reflows the main content) when toggled.
 * - **Mobile**: an overlay drawer built on Base UI's Dialog (focus trap, scroll
 *   lock, backdrop, Escape to close).
 *
 * Both render the same {@link SidebarBody}. Toggle state lives in
 * {@link useSidebar}; the trigger is in the top bar.
 */
export function Sidebar() {
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Desktop: collapsible persistent sidebar */}
      <aside
        data-collapsed={isCollapsed}
        className="sticky top-0 hidden h-screen shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-in-out data-[collapsed=false]:w-64 data-[collapsed=true]:w-0 data-[collapsed=true]:border-r-0 md:block"
      >
        <SidebarBody />
      </aside>

      {/* Mobile: overlay drawer */}
      <Dialog.Root open={isMobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 md:hidden" />
          <Dialog.Popup className="fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar shadow-xl transition-transform duration-200 ease-in-out data-ending-style:-translate-x-full data-starting-style:-translate-x-full md:hidden">
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <SidebarBody />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
