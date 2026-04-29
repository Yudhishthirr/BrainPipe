import type { NodeExecutor } from "@/features/execution/types";


type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({nodeId,context,step}) => {
  

  // passsing data through step.run to ensure it is captured in execution logs and can be used in retries if needed
  const result = await step.run("manual-trigger", async () => context);

  return result;
};
