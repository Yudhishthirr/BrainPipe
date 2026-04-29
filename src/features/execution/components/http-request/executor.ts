import type { NodeExecutor } from "@/features/execution/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";
// type HttpTriggerData = Record<string, unknown>;

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});


type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpTriggerExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step }) => {

  // passsing data through step.run to ensure it is captured in execution logs and can be used in retries if needed

  try {
    const result = await step.run("http-request", async () => {
      if (!data.endpoint) {
        // await publish(
        //   httpRequestChannel().status({
        //     nodeId,
        //     status: "error",
        //   }),
        // );
        throw new NonRetriableError("HTTP Request node: No endpoint configured");
      }

      if (!data.variableName) {
        // await publish(
        //   httpRequestChannel().status({
        //     nodeId,
        //     status: "error",
        //   }),
        // );
        throw new NonRetriableError("HTTP Request node: Variable name not configured");
      }

      if (!data.method) {
        // await publish(
        //   httpRequestChannel().status({
        //     nodeId,
        //     status: "error",
        //   }),
        // );
        throw new NonRetriableError("HTTP Request node: Method not configured");
      }

      const endpoint = Handlebars.compile(data.endpoint)(context);
      const method = data.method;

      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        const resolved = Handlebars.compile(data.body || "{}")(context);
        JSON.parse(resolved);
        options.body = resolved;
        options.headers = {
          "Content-Type": "application/json",
        };
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responsePayload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };

      return {
        ...context,
        [data.variableName]: responsePayload,
      }
    });

    // await publish(
    //   httpRequestChannel().status({
    //     nodeId,
    //     status: "success",
    //   }),
    // );

    return result;
  } catch (error) {
    // await publish(
    //   httpRequestChannel().status({
    //     nodeId,
    //     status: "error",
    //   }),
    // );
    throw error;
  }
    // return result;

 



  // return result;
};
