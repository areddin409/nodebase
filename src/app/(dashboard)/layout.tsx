// layout.tsx (stays as Server Component)
import { DashboardLayoutClient } from "@/components/dashboard-layout-client";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
};

export default Layout;
