import type { NodeExecutor } from "@/features/execution/types";
import { NonRetriableError } from "inngest";


// type HttpTriggerData = Record<string, unknown>;

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpTriggerExecutor: NodeExecutor<HttpRequestData> = async ({data,nodeId,context,step}) => {

  if (!data.endpoint) {
      throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }

  // passsing data through step.run to ensure it is captured in execution logs and can be used in retries if needed
  const result = await step.run("http-trigger", async () => context);

 

  return result;
};
