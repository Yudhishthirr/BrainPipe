"use client"


import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflow";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export const WorkflowList = () => {
    const workflows = useSuspenseWorkflow();
    return (
        <div>
            {JSON.stringify(workflows.data, null, 2)}
        </div>
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