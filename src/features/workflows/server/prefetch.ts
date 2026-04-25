import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type input = inferInput<typeof trpc.workflows.getMany>;

export const prefetchWorkflows = (params: input) => {

    return prefetch(trpc.workflows.getMany.queryOptions(params));
}


// Calls your tRPC route on the server
// Stores result inside React Query cache
// That cache is later sent to client via <HydrateClient>
// NOTE=> “Fetch data BEFORE UI renders”

// <HydrateClient>
// Server React Query cache ➜ Client


