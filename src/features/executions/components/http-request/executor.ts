/**
 * HTTP Request Node Executor
 *
 * This module implements the executor for HTTP Request nodes in the NodeBase workflow
 * automation platform. It handles making HTTP requests with Handlebars template support
 * for dynamic endpoints and request bodies.
 *
 * Key Features:
 * - Support for all major HTTP methods (GET, POST, PUT, DELETE, PATCH)
 * - Handlebars templating for dynamic endpoint URLs and request bodies
 * - JSON validation for request bodies
 * - Automatic content-type detection for responses
 * - Integration with Inngest for reliable background execution
 * - Context variable storage for workflow continuity
 *
 * @see {@link https://handlebarsjs.com/} Handlebars Template Documentation
 * @see {@link https://github.com/sindresorhus/ky} Ky HTTP Client Documentation
 * @see {@link https://www.inngest.com/docs} Inngest Background Jobs
 */

import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

/**
 * Custom Handlebars Helper: JSON Formatter
 *
 * Registers a 'json' helper that safely formats JavaScript objects as JSON strings
 * within Handlebars templates. This is useful for embedding complex objects in
 * HTTP request bodies.
 *
 * @param context - The JavaScript object/value to be JSON-formatted
 * @returns SafeString containing formatted JSON to prevent HTML escaping
 *
 * @example
 * Template: {"user": {{{json userObject}}}}
 * Context: { userObject: { id: 1, name: "John" } }
 * Result: {"user": {"id": 1, "name": "John"}}
 */
Handlebars.registerHelper("json", context => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

/**
 * HTTP Request Node Configuration Data
 *
 * Defines the structure of configuration data that the HTTP Request node
 * requires for execution. This data is provided by the visual editor UI
 * and validates the user's configuration.
 */
type HttpRequestData = {
  /** Variable name where the HTTP response will be stored in the workflow context */
  variableName: string;
  /** HTTP endpoint URL (supports Handlebars templating for dynamic URLs) */
  endpoint: string;
  /** HTTP method to use for the request */
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  /** Optional request body for POST/PUT/PATCH requests (supports Handlebars templating) */
  body?: string;
};

/**
 * HTTP Request Node Executor
 *
 * Main executor function for HTTP Request nodes in NodeBase workflows.
 * This function handles the complete lifecycle of making HTTP requests with
 * template support and proper error handling.
 *
 * Execution Flow:
 * 1. Validates required configuration data (endpoint, variable name, method)
 * 2. Compiles Handlebars templates with workflow context
 * 3. Constructs HTTP request with appropriate headers and body
 * 4. Executes HTTP request using Ky HTTP client
 * 5. Processes response data based on content type
 * 6. Stores response in workflow context for subsequent nodes
 *
 * Template Support:
 * - Endpoint URLs can use variables: `https://api.example.com/users/{{userId}}`
 * - Request bodies support templating: `{"name": "{{userName}}", "id": {{id}}}`
 * - Context variables from previous nodes are available for interpolation
 *
 * Error Handling:
 * - Configuration validation with descriptive error messages
 * - JSON validation for request bodies in POST/PUT/PATCH requests
 * - HTTP errors are propagated with response details
 * - Template compilation errors are caught and reported
 *
 * @param params - Node execution parameters
 * @param params.data - HTTP request configuration data
 * @param params.nodeId - Unique identifier for this node instance
 * @param params.context - Current workflow context with variables from previous nodes
 * @param params.step - Inngest step utilities for reliable execution
 *
 * @returns Promise<WorkflowContext> Updated workflow context with HTTP response data
 *
 * @throws {NonRetriableError} When configuration is invalid or templates fail
 *
 * @example
 * // Node configuration:
 * {
 *   variableName: "apiResponse",
 *   endpoint: "https://jsonplaceholder.typicode.com/todos/{{todoId}}",
 *   method: "GET"
 * }
 *
 * // Context before execution:
 * { todoId: 1 }
 *
 * // Context after execution:
 * {
 *   todoId: 1,
 *   apiResponse: {
 *     httpResponse: {
 *       status: 200,
 *       statusText: "OK",
 *       data: { id: 1, title: "Learn NodeBase", completed: false }
 *     }
 *   }
 * }
 */
export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // TODO: Publish 'loading' state for HTTP request

  /**
   * Configuration Validation
   *
   * Validates that all required configuration fields are present.
   * Throws NonRetriableError for missing required fields to prevent
   * infinite retry loops in Inngest.
   */
  if (!data.endpoint) {
    //TODO: publish 'error' state for HTTP request
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }

  if (!data.variableName) {
    //TODO: publish 'error' state for HTTP request
    throw new NonRetriableError(
      "HTTP Request node: No variable name configured"
    );
  }

  if (!data.method) {
    //TODO: publish 'error' state for HTTP request
    throw new NonRetriableError("HTTP Request node: No method configured");
  }

  /**
   * HTTP Request Execution Step
   *
   * Uses Inngest's step.run() for reliable execution with automatic retries
   * and failure handling. The step is named uniquely using the node ID to
   * enable proper step tracking in Inngest UI.
   */
  const result = await step.run(`http-request-${nodeId}`, async () => {
    /**
     * Template Processing
     *
     * Compiles and executes Handlebars templates for dynamic endpoint URLs.
     * Templates can reference any variable from the current workflow context.
     */
    let endpoint: string;
    try {
      const template = Handlebars.compile(data.endpoint);
      endpoint = template(context);
      if (!endpoint || typeof endpoint !== "string") {
        throw new Error("Endpoint template did not resolve to a valid string");
      }
    } catch (error) {
      throw new NonRetriableError(
        `HTTP Request node: Endpoint template error. ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
    const method = data.method;

    const options: KyOptions = { method };

    /**
     * Request Body Processing
     *
     * For HTTP methods that support request bodies (POST, PUT, PATCH),
     * processes the body template and validates the resulting JSON.
     */
    if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      const template = Handlebars.compile(data.body || "{}");
      const resolved = template(context);

      /**
       * JSON Validation
       *
       * Validates that the resolved template produces valid JSON.
       * This prevents runtime errors when the HTTP client tries to send
       * malformed JSON to the target API.
       */
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

    /**
     * HTTP Request Execution
     *
     * Executes the HTTP request using Ky HTTP client.
     * Ky provides automatic JSON parsing, timeout handling,
     * and HTTP error status code handling.
     */
    const response = await ky(endpoint, options);

    /**
     * Response Processing
     *
     * Automatically detects response content type and parses accordingly.
     * JSON responses are parsed as objects, while other content types
     * are returned as text strings.
     */
    const contentType = response.headers.get("content-type") || "";
    const responseData = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    /**
     * Response Data Structure
     *
     * Creates a standardized response object that includes:
     * - HTTP status code and status text
     * - Response data (parsed JSON or raw text)
     * - Headers and other metadata available through response object
     */
    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    /**
     * Context Update
     *
     * Merges the HTTP response into the workflow context using the
     * configured variable name. This makes the response data available
     * to subsequent nodes in the workflow.
     */
    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  // TODO: publish 'success' state for HTTP request
  return result;
};
