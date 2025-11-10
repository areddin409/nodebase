"use client";

import { useState, useEffect } from "react";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

/**
 * Custom hook to handle sidebar collapse state persistence
 *
 * This hook reads the initial sidebar state from cookies and provides
 * a way to persist the state across browser sessions. It handles:
 * - Reading initial state from cookies
 * - Providing default state if no cookie exists
 * - Client-side only execution to avoid hydration issues
 *
 * @param defaultOpen - Default sidebar open state (defaults to true)
 * @returns Object containing the initial open state and loading status
 *
 * @example
 * ```tsx
 * const { initialOpen, isLoaded } = useSidebarPersistence(true);
 *
 * if (!isLoaded) {
 *   return <div>Loading...</div>;
 * }
 *
 * return (
 *   <SidebarProvider defaultOpen={initialOpen}>
 *     <AppSidebar />
 *   </SidebarProvider>
 * );
 * ```
 */
export const useSidebarPersistence = (defaultOpen: boolean = true) => {
  const [initialOpen, setInitialOpen] = useState(defaultOpen);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Read from cookie on client side only
    const getSidebarStateFromCookie = (): boolean => {
      if (typeof document === "undefined") {
        return defaultOpen;
      }

      const cookies = document.cookie.split(";");
      const sidebarCookie = cookies.find(cookie =>
        cookie.trim().startsWith(`${SIDEBAR_COOKIE_NAME}=`)
      );

      if (sidebarCookie) {
        const value = sidebarCookie.split("=")[1]?.trim();
        return value === "true";
      }

      return defaultOpen;
    };

    // Set the initial state from cookie
    const savedState = getSidebarStateFromCookie();
    setInitialOpen(savedState);
    setIsLoaded(true);
  }, [defaultOpen]);

  return { initialOpen, isLoaded };
};
