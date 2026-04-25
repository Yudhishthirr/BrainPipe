"use client"


import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflow";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export const WorkflowContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <EntityContainer
                header={<WorkflowHeader />}
            >
                {children}
            </EntityContainer>
        </>
    )
}   