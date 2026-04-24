import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
    await requireAuth();
    return <div>WorkFlow Page </div>;
};

export default Page;