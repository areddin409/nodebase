import { FolderOpenIcon, HistoryIcon, KeyIcon } from "lucide-react";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 5,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
};
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
