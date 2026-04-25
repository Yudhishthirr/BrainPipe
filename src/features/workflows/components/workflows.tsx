"use client"


import {
    EmptyView, EntityContainer, EntityHeader, EntityList,
    EntityPagination, EntitySearch, ErrorView, LoadingView, EntityItem
}
    from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflow";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon } from "lucide-react";
import type { Workflow } from "@/generated/prisma/client";

export const WorkflowList = () => {
    const workflows = useSuspenseWorkflow();
    if (workflows.data.items.length !== 0) {
        return (
            <EntityList
                items={workflows.data.items}
                getKey={(workflows) => workflows.id}
                renderItem={(workflows) => <WorkflowItem data={workflows} />}
                emptyView={<WorkflowsEmpty />}
            />
        )
    }
    return (
        <WorkflowsEmpty />
    )

}

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {

    const createWorkflow = useCreateWorkflow();
    const router = useRouter()


    const { handleError, modal } = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (error) => {
                handleError(error);
            }
        })
    }

    return (
        <>
            {modal}
            <EntityHeader
                title="Workflows"
                description="Manage your workflows"
                onNew={handleCreate}
                newButtonLabel="New Workflow"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
        </>
    )

}


export const WorkflowSearch = () => {
    const [params, setParams] = useWorkflowsParams()

    const { searchValue, onSearchChange } = useEntitySearch({ params, setParams })
    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
        />
    )
}

export const WorkflowPagination = () => {
    const [params, setParams] = useWorkflowsParams()
    const workflow = useSuspenseWorkflow()
    return (
        <EntityPagination
            disabled={workflow.isFetching}
            totalPages={workflow.data.totalPages}
            page={workflow.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    )
}

export const WorkflowContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <EntityContainer
                header={<WorkflowHeader />}
                search={<WorkflowSearch />}
                pagination={<WorkflowPagination />}
            >
                {children}
            </EntityContainer>
        </>
    )
}

export const WorkflowLoading = () => {
    return (
        <LoadingView message="Workflows" />
    )
}

export const WorkflowError = () => {
    return (
        <ErrorView message="Error" />
    )
}

export const WorkflowsEmpty = () => {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
                handleError(error);
            },
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            }
        });
    };

    return (
        <>
            {modal}
            <EmptyView
                onNew={handleCreate}
                message="You haven't created any workflows yet. Get started by creating your first workflow"
            />
        </>
    );
};


export const WorkflowItem = ({
    data,
}: {
    data: Workflow
}) => {
    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = () => {
        removeWorkflow.mutate({ id: data.id });
    }

    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, { addSuffix: true })}
                </>
            }
            image={
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground" />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeWorkflow.isPending}
        />
    )
}