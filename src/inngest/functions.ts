import { NodeType } from "@/generated/prisma/client";
import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { getExecutor } from "@/features/execution/lib/executor-registry";
// import { ht } from "date-fns/locale";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { google } from "better-auth";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { discordChannel } from "./channels/discord";


export const executeWorkflow = inngest.createFunction(
    {
        id: "execute-workflow",
        retries: 0, //change it to producation
    },
    {
        event: "workflows/execute.workflow",
        channels: [
            httpRequestChannel(),
            manualTriggerChannel(),
            googleFormTriggerChannel(),
            discordChannel(),// Add the Google Form Trigger channel here
        ],
    },
    async ({ event, step, publish }) => {

        const workflowId = event.data.workflowId;

        if (!workflowId) {
            throw new NonRetriableError("Workflow ID is required");
        }

     
        // get nodes for workflow from database
        const SortedNodes = await step.run("prepare workflow", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: { id: workflowId },
                include: { nodes: true, connections: true },
            })

            if (!workflow) {
                throw new NonRetriableError("Workflow not found");
            }

            return topologicalSort(workflow.nodes, workflow.connections);
        });
        // console.log("Sorted Nodes: ", SortedNodes);
        // return SortedNodes;

        const userId = await step.run("find-user-id", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: { id: workflowId },
                select: {
                    userId: true,
                },
            });

            return workflow.userId;
        });
        let context = event.data.initialData || {};

        // execute each node in order
        for (const node of SortedNodes) {
            const executor = getExecutor(node.type as NodeType);
            context = await executor({
                data: node.data as Record<string, unknown>,
                nodeId: node.id,
                userId,
                context,
                step,
                publish,
            });
        }

        return {
            workflowId: workflowId,
            result: context,
        }
        await step.sleep("test", "5s");
    }
);