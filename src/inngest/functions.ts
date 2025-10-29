import { inngest } from "./client";

/**
 * Inngest Background Functions
 *
 * This file contains all the background functions that handle asynchronous processing
 * in the application. These functions are triggered by events and run independently
 * of the main application flow, making them perfect for:
 *
 * - Email notifications
 * - Data processing workflows
 * - Integration with external APIs
 * - Scheduled tasks
 * - User onboarding flows
 *
 * All functions defined here are automatically registered with the Inngest API
 * endpoint in `/api/inngest/route.ts`
 *
 * @see https://www.inngest.com/docs/functions
 */

/**
 * Hello World Background Function
 *
 * A simple example function that demonstrates the basic Inngest function structure.
 * This function is triggered by the "test/hello.world" event and includes:
 *
 * - Event data access via `event.data`
 * - Step-based execution with `step.sleep()` for delays
 * - Return values that are logged and can be accessed in the Inngest dashboard
 *
 * Function Configuration:
 * - ID: "hello-world" - Unique identifier for this function
 * - Trigger: "test/hello.world" - Event name that triggers this function
 *
 * @param event - The event object containing data and metadata
 * @param step - Provides step utilities like sleep, run, waitForEvent, etc.
 *
 * @returns Promise<{ message: string }> - Success message with user email
 *
 * @example
 * ```typescript
 * // Trigger this function by sending an event:
 * await inngest.send({
 *   name: "test/hello.world",
 *   data: { email: "user@example.com" }
 * });
 * ```
 *
 * @see https://www.inngest.com/docs/functions/create
 */
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // Add a 1-second delay - useful for rate limiting or processing delays
    await step.sleep("wait-a-moment", "1s");

    // Return a personalized message using the event data
    return { message: `Hello ${event.data.email}!` };
  }
);
