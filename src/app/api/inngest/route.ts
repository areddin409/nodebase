import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { execute } from "@/inngest/functions";

/**
 * Inngest API Route Handler
 *
 * This file creates the API endpoint that serves as the bridge between your Next.js
 * application and Inngest's background function infrastructure. It:
 *
 * - Registers all background functions with Inngest
 * - Handles incoming webhooks from Inngest to execute functions
 * - Provides the development server UI for testing functions locally
 * - Manages authentication and security for function execution
 *
 * Route: `/api/inngest`
 * Methods: GET, POST, PUT
 *
 * Development:
 * - Visit `/api/inngest` in your browser to see the Inngest development UI
 * - Functions are automatically hot-reloaded during development
 *
 * Production:
 * - Inngest will call this endpoint to execute your background functions
 * - All function logs and metrics are available in the Inngest dashboard
 *
 * @see https://www.inngest.com/docs/sdk/serve
 */

/**
 * HTTP Method Handlers for Inngest
 *
 * The `serve` function creates handlers for different HTTP methods:
 *
 * - GET: Returns function metadata and provides the development UI
 * - POST: Executes background functions when triggered by events
 * - PUT: Handles function registration and updates
 *
 * Configuration:
 * - client: The Inngest client instance for this application
 * - functions: Array of all background functions to register
 *
 * To add new functions:
 * 1. Create the function in `/inngest/functions.ts`
 * 2. Import it here
 * 3. Add it to the functions array
 *
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // Add all your background functions here
    // Each function added will be automatically registered with Inngest
    execute,
  ],
});
