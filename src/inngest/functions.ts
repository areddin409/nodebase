import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { inngest } from "./client";
import * as Sentry from "@sentry/nextjs";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    Sentry.logger.info("User triggered test log", {
      log_source: "sentry_test",
    });

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

    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    };
  }
);
