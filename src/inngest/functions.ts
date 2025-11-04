import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { inngest } from "./client";
import * as Sentry from "@sentry/nextjs";

/**
 * Development Notes
 *
 * - Use `npx inngest-cli@latest dev` to start the Inngest dev server
 * - Visit `/api/inngest` for the Inngest development UI
 * - All functions are automatically instrumented with Sentry
 * - AI SDK telemetry is sent to Vercel for monitoring
 * - Functions support retries, delays, and complex workflows
 *
 * @see https://www.inngest.com/docs - Inngest documentation
 * @see https://sdk.vercel.ai/docs - Vercel AI SDK documentation
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/ - Sentry documentation
 */

/**
 * Function Registration
 *
 * To register new Inngest functions:
 * 1. Create the function using inngest.createFunction()
 * 2. Export it from this module
 * 3. Add it to the serve array in /api/inngest/route.ts
 *
 * @example
 * // In this file:
 * export const myNewFunction = inngest.createFunction(
 *   { id: "my-new-function" },
 *   { event: "my/event" },
 *   async ({ event, step }) => {
 *     // Function logic here
 *   }
 * );
 *
 * // In /api/inngest/route.ts:
 * import { execute, myNewFunction } from "@/inngest/functions";
 *
 * export const { GET, POST, PUT } = serve({
 *   client: inngest,
 *   functions: [execute, myNewFunction], // Add here
 * });
 */

// Initialize AI model providers
/** Google Generative AI client instance */
const google = createGoogleGenerativeAI();

/** OpenAI client instance */
const openai = createOpenAI();

/** Anthropic client instance */
const anthropic = createAnthropic();

/**
 * Execute AI workflow function
 *
 * This function demonstrates the integration of multiple AI providers (Google Gemini,
 * OpenAI, and Anthropic Claude) within an Inngest background job. It showcases how to:
 * - Use step.ai.wrap() for AI SDK telemetry integration
 * - Handle multiple AI providers in parallel
 * - Log events to Sentry for monitoring
 * - Generate creative content using different AI models
 *
 * @event execute/ai - Triggered when AI execution is requested
 * @returns Object containing responses from all three AI providers
 *
 * @example
 * // Trigger this function from a tRPC procedure:
 * await inngest.send({
 *   name: "execute/ai",
 *   data: { userId: session.user.id }
 * });
 */
export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    // Log execution start for monitoring
    Sentry.logger.info("User triggered test log", {
      log_source: "sentry_test",
    });

    // Execute Google Gemini model with telemetry
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        system: "You are a helpful assistant.",
        prompt: "Generate a creative sonnet about a dinosaur learning to love.",
        model: google("gemini-2.5-flash"),
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    // Execute OpenAI GPT model with telemetry
    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        system: "You are a helpful assistant.",
        prompt: "Generate a creative sonnet about a dinosaur learning to love.",
        model: openai("gpt-5"),
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    // Execute Anthropic Claude model with telemetry
    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        system: "You are a helpful assistant.",
        prompt: "Generate a creative sonnet about a dinosaur learning to love.",
        model: anthropic("claude-3-5-haiku-20241022"),
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    // Return combined results from all AI providers
    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    };
  }
);
