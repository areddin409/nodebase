"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSidebarPersistence } from "@/hooks/use-sidebar-persistence";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { initialOpen, isLoaded } = useSidebarPersistence(true);

  // Show loading state while reading from cookies to prevent flash
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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

export default Layout;
