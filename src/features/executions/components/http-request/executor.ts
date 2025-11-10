import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: string;
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // TODO: Publish 'loading' state for HTTP request

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

  const result = await step.run(`http-request-${nodeId}`, async () => {
    const method = data.method || "GET";
    const endpoint = data.endpoint!;

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      options.body = data.body;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type") || "";
    const responseData = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    }

    //fallback to direct httpResponse for backward compatibility
    return {
      ...context,
      ...responsePayload,
    };
  });

  // TODO: publish 'success' state for HTTP request
  return result;
};
