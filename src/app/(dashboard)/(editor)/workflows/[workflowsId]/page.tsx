import { EditorError, EditorLoading } from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { prefetchSingleWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = async ({ params }: { params: Promise<{ workflowsId: string }> }) => {

    await requireAuth();
    const { workflowsId } = await params;


    prefetchSingleWorkflow(workflowsId);

    // return <div>WorkFlow id {workflowsId} </div>;
    return (
        <HydrateClient>
            <ErrorBoundary fallback={<EditorError />}>
                <Suspense fallback={<EditorLoading />}>
                    <EditorHeader workflowId={workflowsId} />
                    <main className="flex-1">
                        {/* <Editor workflowId={workflowId} /> */}
                    </main>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>

    )
};

export default Page;