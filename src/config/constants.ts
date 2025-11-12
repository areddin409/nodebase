/**
 * Application Configuration Constants
 *
 * Centralized configuration for pagination, navigation, and subscription settings.
 */

import { FolderOpenIcon, HistoryIcon, KeyIcon } from "lucide-react";

/** Pagination defaults for list views */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 5,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
};

/** Dashboard sidebar navigation structure */
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

/** Polar.sh premium subscription product slug */
export const PRO_SLUG = "Nodebase Pro";
