import { NodeType } from "@/generated/prisma/client";
import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { getExecutor } from "@/features/execution/lib/executor-registry";

export const executeWorkflow = inngest.createFunction(
    { id: "execute-workflow", triggers: { event: "workflow/execute.workflow" } },
    async ({ event, step }) => {

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
        console.log("Sorted Nodes: ", SortedNodes);
        // return SortedNodes;


        let context = event.data.initialData || {};

        // execute each node in order
        for (const node of SortedNodes) {
            const executor = getExecutor(node.type as NodeType);
            context = await executor({
                data: node.data as Record<string, unknown>,
                nodeId: node.id,
                // userId,
                context,
                step,
                // publish,
            });
        }

        return {
            workflowId:workflowId,
            result:context,
        }
        await step.sleep("test", "5s");
    }
);