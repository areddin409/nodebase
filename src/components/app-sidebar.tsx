"use client";

import { CreditCardIcon, LogOutIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { PRO_SLUG, SIDEBAR_MENU_ITEMS } from "@/config/constants";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { ModeToggle } from "./dark-mode-toggle";

/**
 * Application Sidebar Component
 *
 * The main navigation sidebar for the NodeBase application. This component provides:
 * - Logo and branding in the header
 * - Dynamic navigation menu based on SIDEBAR_MENU_ITEMS configuration
 * - Active route highlighting
 * - Subscription-aware upgrade prompts
 * - User authentication controls (billing portal, sign out)
 * - Collapsible design for better UX
 *
 * Features:
 * - Icon-only collapsible mode for space efficiency
 * - Subscription status integration with upgrade prompts
 * - Client-side routing with prefetch for better performance
 * - Tooltip support for collapsed menu items
 * - Responsive design with proper spacing and typography
 *
 * Navigation Structure:
 * - Header: Logo and app name
 * - Content: Menu groups (Main, Credentials, Executions)
 * - Footer: Upgrade prompt, billing portal, sign out
 *
 * State Management:
 * - Uses Next.js router for navigation and active state
 * - Integrates subscription status for conditional UI
 * - Handles authentication state changes
 *
 * @component
 * @example
 * ```tsx
 * // Used in dashboard layout
 * <SidebarProvider>
 *   <AppSidebar />
 *   <SidebarInset>
 *     {children}
 *   </SidebarInset>
 * </SidebarProvider>
 * ```
 */
export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasActiveSubscription, subscription, isLoading } =
    useHasActiveSubscription();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <div className="flex items-center gap-x-3">
            <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
              <Link href="/" prefetch>
                <Image
                  src="/logos/logo.svg"
                  alt="Nodebase"
                  width={30}
                  height={30}
                />
                <span className="font-semibold text-sm">Nodebase</span>
              </Link>
            </SidebarMenuButton>
            <ModeToggle />
          </div>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_MENU_ITEMS.map(group => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        item.url === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.url)
                      }
                      asChild
                      className="gap-x-4 h-10 px-4"
                    >
                      <Link href={item.url} prefetch>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {!hasActiveSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={"Upgrade to Pro"}
                className="gap-x-4 h-10 px-4"
                onClick={() => authClient.checkout({ slug: PRO_SLUG })}
              >
                <StarIcon className="h-4 w-4" />
                <span>Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Billing Portal"}
              className="gap-x-4 h-10 px-4"
              onClick={() => authClient.customer.portal()}
            >
              <CreditCardIcon className="h-4 w-4" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Sign Out"}
              className="gap-x-4 h-10 px-4"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                })
              }
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
