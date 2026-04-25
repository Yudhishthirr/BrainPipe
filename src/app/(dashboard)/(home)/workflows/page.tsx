import { WorkflowContainer, WorkflowError, WorkflowList, WorkflowLoading } from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { SearchParams } from "nuqs/server";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";

type Props = {
    searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
    await requireAuth();

    const params = await workflowsParamsLoader(searchParams)
    prefetchWorkflows(params); // 👈 server-side prefetch

    return (
        <WorkflowContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<WorkflowError />}>
                    <Suspense fallback={<WorkflowLoading />}>
                        <WorkflowList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowContainer>
    )
};

export default Page;