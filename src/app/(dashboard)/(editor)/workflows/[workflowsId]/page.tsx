import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
    await requireAuth();
    return <div>WorkFlow idPage </div>;
};

export default Page;