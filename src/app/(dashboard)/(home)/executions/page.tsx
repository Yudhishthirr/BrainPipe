import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
    await requireAuth();
    return <div>excucations Page </div>;
};

export default Page;