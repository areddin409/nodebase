import { Inngest } from "inngest";

/**
 * Inngest Client Configuration
 *
 * This file initializes the Inngest client which is used to:
 * - Send events to trigger background functions
 * - Receive and process events in background functions
 * - Manage the connection between your app and Inngest's event-driven infrastructure
 *
 * The client is configured with a unique app ID that identifies this application
 * in the Inngest dashboard and logs.
 *
 * @see https://www.inngest.com/docs/getting-started
 */

/**
 * Main Inngest client instance
 *
 * This client is used throughout the application to:
 * - Send events using `inngest.send()`
 * - Create background functions using `inngest.createFunction()`
 * - Handle event-driven workflows and background processing
 *
 * Configuration:
 * - id: Unique identifier for this application in Inngest
 *
 * @example
 * ```typescript
 * // Send an event
 * await inngest.send({
 *   name: "user/signup",
 *   data: { userId: "123", email: "user@example.com" }
 * });
 * ```
 */
export const inngest = new Inngest({ id: "my-app" });
