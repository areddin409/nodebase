// layout-client.tsx (new file)
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSidebarPersistence } from "@/hooks/use-sidebar-persistence";

export const DashboardLayoutClient = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { initialOpen, isLoaded } = useSidebarPersistence(true);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={initialOpen}>
      <AppSidebar />
      <SidebarInset className="bg-accent/20">{children}</SidebarInset>
    </SidebarProvider>
  );
};
