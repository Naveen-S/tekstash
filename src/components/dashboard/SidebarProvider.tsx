"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Breakpoint below which the sidebar is always an overlay drawer (Tailwind `md`). */
const MOBILE_QUERY = "(max-width: 767px)";

interface SidebarContextValue {
  /** Desktop: whether the persistent sidebar is collapsed (hidden). */
  isCollapsed: boolean;
  /** Mobile: whether the overlay drawer is open. */
  isMobileOpen: boolean;
  /** True while the viewport is below the `md` breakpoint. */
  isMobile: boolean;
  /** Toggle the drawer on mobile, or collapse/expand on desktop. */
  toggleSidebar: () => void;
  setMobileOpen: (open: boolean) => void;
  /** Convenience for closing the drawer after a mobile nav action. */
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track the viewport against the mobile breakpoint. Starts `false` so SSR and
  // the first client render agree (desktop layout); corrected on mount. Closing
  // the drawer here (rather than in a separate effect) avoids it being left open
  // behind the desktop layout when the viewport grows past `md`.
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const sync = () => {
      setIsMobile(mql.matches);
      if (!mql.matches) setIsMobileOpen(false);
    };
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen((open) => !open);
    } else {
      setIsCollapsed((collapsed) => !collapsed);
    }
  }, [isMobile]);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  const value = useMemo<SidebarContextValue>(
    () => ({
      isCollapsed,
      isMobileOpen,
      isMobile,
      toggleSidebar,
      setMobileOpen: setIsMobileOpen,
      closeMobile,
    }),
    [isCollapsed, isMobileOpen, isMobile, toggleSidebar, closeMobile],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
