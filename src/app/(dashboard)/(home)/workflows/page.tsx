import { WorkflowContainer, WorkflowList } from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

const Page = async () => {
    await requireAuth();

    prefetchWorkflows(); // 👈 server-side prefetch

    return (
        <WorkflowContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<p>Error</p>}>
                    <Suspense fallback={<p>Loading...</p>}>
                        <WorkflowList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowContainer>
    )
};

export default Page;