import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

export default async function Home() {
  await requireAuth();
  const data = await caller.getUsers();
  console.log({ data })

  return (
    <div>
      user data for demo
      {JSON.stringify(data)}
    </div>
  );
}
