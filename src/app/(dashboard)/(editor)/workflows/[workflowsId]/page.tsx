import { requireAuth } from "@/lib/auth-utils";

const Page = async ({ params }: { params: Promise<{ workflowsId: string }> }) => {
    await requireAuth();
    const { workflowsId } = await params;
    return <div>WorkFlow id {workflowsId} </div>;
};

export default Page;