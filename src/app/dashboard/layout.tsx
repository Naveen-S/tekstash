import type { ReactNode } from "react";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/dashboard/SidebarProvider";
import { TopBar } from "@/components/dashboard/TopBar";

/**
 * Dashboard shell: collapsible sidebar on the left (an overlay drawer on
 * mobile), sticky top bar above the scrolling main content. Pages render into
 * `children`. Sidebar open/collapse state is shared via {@link SidebarProvider}.
 */
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
