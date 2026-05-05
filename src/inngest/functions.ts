import { ExecutionStatus, NodeType } from "@/generated/prisma/client";
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
        retries: process.env.NODE_ENV === "production" ? 3 : 0,
        onFailure: async ({ event, step }) => {
            return prisma.execution.update({
                where: { inngestEventId: event.data.event.id },
                data: {
                    status: ExecutionStatus.FAILED,
                    error: event.data.error.message,
                    errorStack: event.data.error.stack,
                },
            });
        },
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
        const inngestEventId = event.id;


        if (!inngestEventId || !workflowId) {
            throw new NonRetriableError("Event ID or workflow ID is missing");
        }

        await step.run("create-execution", async () => {
            return prisma.execution.create({
                data: {
                    workflowId,
                    inngestEventId,
                },
            });
        });


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



        await step.run("update-execution", async () => {
            return prisma.execution.update({
                where: { inngestEventId, workflowId },
                data: {
                    status: ExecutionStatus.SUCCESS,
                    completedAt: new Date(),
                    output: context,
                },
            })
        });


        return {
            workflowId: workflowId,
            result: context,
        }
        
    }
);