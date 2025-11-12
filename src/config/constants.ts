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

// Common Stripe events users typically want to listen to
export const STRIPE_EVENTS = [
  {
    value: "payment_intent.succeeded",
    label: "Payment Intent Succeeded",
    description: "Payment successfully completed",
  },
  {
    value: "payment_intent.created",
    label: "Payment Intent Created",
    description: "Payment intent was created",
  },
  {
    value: "payment_intent.payment_failed",
    label: "Payment Intent Failed",
    description: "Payment attempt failed",
  },
  {
    value: "charge.succeeded",
    label: "Charge Succeeded",
    description: "Charge was successful",
  },
  {
    value: "charge.failed",
    label: "Charge Failed",
    description: "Charge attempt failed",
  },
  {
    value: "customer.created",
    label: "Customer Created",
    description: "New customer was created",
  },
  {
    value: "customer.updated",
    label: "Customer Updated",
    description: "Customer details were updated",
  },
  {
    value: "customer.deleted",
    label: "Customer Deleted",
    description: "Customer was deleted",
  },
  {
    value: "invoice.paid",
    label: "Invoice Paid",
    description: "Invoice was paid",
  },
  {
    value: "invoice.payment_failed",
    label: "Invoice Payment Failed",
    description: "Invoice payment failed",
  },
  {
    value: "subscription.created",
    label: "Subscription Created",
    description: "New subscription created",
  },
  {
    value: "subscription.updated",
    label: "Subscription Updated",
    description: "Subscription was updated",
  },
  {
    value: "subscription.deleted",
    label: "Subscription Deleted",
    description: "Subscription was cancelled",
  },
] as const;
