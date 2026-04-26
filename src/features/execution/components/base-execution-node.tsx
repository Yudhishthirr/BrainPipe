"use client"

import { type NodeProps, Position } from "@xyflow/react"
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode } from "react";
import { BaseNode, BaseNodeContent } from "../../../components/react-flow/base-node";

import { BaseHandle } from "../../../components/react-flow/base-handle";
import { WorkflowNode } from "../../../components/workflow-node";

interface BaseExecutionNodeProps extends NodeProps<any> {
    name: string;
    description: string;
    icon?: LucideIcon | string;
    children?: ReactNode;
    onSettings?: () => void;
    onDoubleClick?: () => void;
    // status?: NodeStatus;
}


export const BaseExecutionNode = memo(({
    id,
    name,
    description,
    icon: Icon,
    children,
    onSettings,
    onDoubleClick,
    ...props
}: BaseExecutionNodeProps) => {

    const handleDelete = () => { }
    return (
        <WorkflowNode
            name={name}
            description={description}
            onSettings={onSettings}
            onDelete={onDoubleClick}
        >
            <BaseNode onDoubleClick={onDoubleClick}>
                <BaseNodeContent>

                    {/* {Icon && typeof Icon === "string" ? (
                        <Image src={Icon} alt={name} width={16} height={16} />
                    ) : (
                        <Icon className="size-4 text-muted-foreground" />
                    )} */}

                    {typeof Icon === "string" ? (
                        <Image src={Icon} alt={name} width={16} height={16} />
                    ) : Icon ? (
                        <Icon className="size-4 text-muted-foreground" />
                    ) : null}

                    {children}
                    <BaseHandle
                        id="target-1"
                        type="target"
                        position={Position.Right}
                    />
                    <BaseHandle
                        id="soruce-1"
                        type="source"
                        position={Position.Left}
                    />
                </BaseNodeContent>
            </BaseNode>
        </WorkflowNode>
    )
})

BaseExecutionNode.displayName = "BaseExecutionNode";