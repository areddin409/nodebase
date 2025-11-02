import { FolderOpenIcon, HistoryIcon, KeyIcon } from "lucide-react";

/**
 * Application Sidebar Navigation Configuration
 *
 * This constant defines the structure of the main navigation sidebar,
 * including menu groups, individual items, icons, and routing.
 *
 * Structure:
 * - Each group has a title and array of items
 * - Each item includes title, Lucide icon component, and URL path
 * - URLs correspond to route groups in the app directory
 *
 * Navigation Flow:
 * - /workflows - Main workflow management interface
 * - /credentials - API keys and credential storage
 * - /executions - Workflow execution history and logs
 *
 * Usage:
 * - Imported in AppSidebar component for rendering navigation
 * - Can be extended with additional menu groups or items
 * - Icons are from Lucide React icon library
 *
 * @example
 * ```typescript
 * // Adding a new menu group:
 * {
 *   title: "Analytics",
 *   items: [
 *     {
 *       title: "Dashboard",
 *       icon: BarChartIcon,
 *       url: "/dashboard",
 *     }
 *   ]
 * }
 * ```
 */
export const SIDEBAR_MENU_ITEMS = [
  {
    title: "Main",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
    ],
  },
  {
    title: "Credentials",
    items: [
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
    ],
  },
  {
    title: "Executions",
    items: [
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
];

export const PRO_SLUG = "Nodebase Pro"; // Custom slug for easy reference in Checkout URL, e.g. /checkout/Nodebase-Pro
