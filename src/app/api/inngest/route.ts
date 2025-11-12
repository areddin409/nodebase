import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { executeWorkflow } from "@/inngest/functions";

/**
 * Inngest API Route Handler
 *
 * API endpoint bridge between Next.js and Inngest background functions.
 * Handles function registration, execution webhooks, and provides development UI.
 *
 * Development:
 * - Visit `/api/inngest` for Inngest development UI
 * - Functions auto-reload during development
 *
 * @see {@link https://www.inngest.com/docs/sdk/serve} Inngest Serve Documentation
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // Add all your background functions here
    // Each function added will be automatically registered with Inngest
    executeWorkflow,
  ],
});
