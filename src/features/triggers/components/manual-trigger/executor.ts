import type { NodeExecutor } from "@/features/execution/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";


type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({ data, nodeId, context, step, publish }) => {
  

   await publish(
    manualTriggerChannel().status({
      nodeId,
      status: "loading",
    }),
  );


  // passsing data through step.run to ensure it is captured in execution logs and can be used in retries if needed
  const result = await step.run("manual-trigger", async () => context);

  await publish(
    manualTriggerChannel().status({
      nodeId,
      status: "success",
    }),
  );
  
  return result;
};
