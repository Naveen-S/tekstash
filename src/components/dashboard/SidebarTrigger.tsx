"use client";

import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "./SidebarProvider";

/**
 * SidebarTrigger — top-bar button that toggles the sidebar: opens/closes the
 * overlay drawer on mobile, collapses/expands the persistent sidebar on desktop.
 */
export function SidebarTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
    >
      <PanelLeft />
    </Button>
  );
}
