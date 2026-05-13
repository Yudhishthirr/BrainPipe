"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { NotionDialog, NotionFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchNotionRealtimeToken } from "./actions";
import { NOTION_CHANNEL_NAME } from "@/inngest/channels/notion";

type NotionNodeData = {
  webhookUrl?: string;
  content?: string;
};

type NotionNodeType = Node<NotionNodeData>;

export const NotionNode = memo((props: NodeProps<NotionNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: NOTION_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchNotionRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: NotionFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...values,
          }
        }
      }
      return node;
    }))
  };

  const handleConnectNotion = async () => {
    try {

      window.location.href =
       "/api/integrations/notion/connect";

    } catch (error) {
      console.log(error);
    }
  };


  const nodeData = props.data;
  const description = nodeData?.content
    ? `Send: ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <NotionDialog
        open={dialogOpen}
        onConnectNotion={handleConnectNotion}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/notion.svg"
        name="Notion"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

NotionNode.displayName = "NotionNode";
