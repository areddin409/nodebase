/**
 * HTTP Request Node Executor
 *
 * Handles HTTP requests with Handlebars template support for dynamic endpoints and bodies.
 *
 * Key Features:
 * - All HTTP methods (GET, POST, PUT, DELETE, PATCH) with Handlebars templating
 * - Automatic JSON validation and content-type detection
 * - Inngest integration for reliable background execution
 *
 * @see {@link https://handlebarsjs.com/} Handlebars Documentation
 * @see {@link https://github.com/sindresorhus/ky} Ky HTTP Client
 * @see {@link https://www.inngest.com/docs} Inngest Background Jobs
 */

import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import { httpRequestChannel } from "@/inngest/channels/http-request";

/**
 * Handlebars helper for safely embedding JSON in templates.
 * @example Template: {"user": {{{json userObject}}}}
 */
Handlebars.registerHelper("json", context => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

/** HTTP Request node configuration */
type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

/**
 * HTTP Request Node Executor
 *
 * Executes HTTP requests with Handlebars template support for endpoints and bodies.
 * Validates configuration, processes templates, makes requests, and stores responses.
 *
 * @param data - Node configuration (endpoint, method, body, variableName)
 * @param nodeId - Node identifier for status tracking
 * @param context - Workflow context for template variables
 * @param step - Inngest step utilities
 * @param publish - Status publishing function
 * @returns Updated workflow context with response data
 *
 * @example
 * // Configuration: { endpoint: "https://api.com/users/{{id}}", method: "GET", variableName: "user" }
 * // Context: { id: 1 } → { id: 1, user: { data: {...}, httpResponse: {...} } }
 */
export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "loading",
    })
  );

  try {
    // Execute HTTP request with Inngest step for reliability
    const result = await step.run(`http-request-${nodeId}`, async () => {
      if (!data.endpoint) {
        await publish(
          httpRequestChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError(
          "HTTP Request node: No endpoint configured"
        );
      }

      if (!data.variableName) {
        await publish(
          httpRequestChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError(
          "HTTP Request node: No variable name configured"
        );
      }

      if (!data.method) {
        await publish(
          httpRequestChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("HTTP Request node: No method configured");
      }

      // Process endpoint template with context variables
      let endpoint: string;
      try {
        const template = Handlebars.compile(data.endpoint);
        endpoint = template(context);
        if (!endpoint || typeof endpoint !== "string") {
          throw new Error(
            "Endpoint template did not resolve to a valid string"
          );
        }
      } catch (error) {
        throw new NonRetriableError(
          `HTTP Request node: Endpoint template error. ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
      const method = data.method;

      const options: KyOptions = { method };

      // Process request body for POST/PUT/PATCH methods
      if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
        const template = Handlebars.compile(data.body || "{}");
        const resolved = template(context);

        // Validate JSON body
        try {
          JSON.parse(resolved);
        } catch (error) {
          throw new NonRetriableError(
            `HTTP Request node: Invalid JSON in request body after template resolution. ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }

        options.body = resolved;
        options.headers = {
          "Content-Type": "application/json",
        };
      }

      // Execute HTTP request
      const response = await ky(endpoint, options);

      // Parse response based on content type
      const contentType = response.headers.get("content-type") || "";
      const responseData = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      // Create response payload with direct data access and full HTTP details
      const responsePayload = {
        data: responseData, // Direct access for templates
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };

      // Merge response into workflow context
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    });
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch (error) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
