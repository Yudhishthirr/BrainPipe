import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
    await requireAuth();
    return <div>credention id Page </div>;
};

export default Page;