import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
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

  const result = await step.run(`http-request-${nodeId}`, async () => {
    const method = data.method || "GET";
    const endpoint = data.endpoint!;

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      if (data.body) {
        options.body = data.body;
      }
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type") || "";
    const responseData = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  // TODO: publish 'success' state for HTTP request
  return result;
};
