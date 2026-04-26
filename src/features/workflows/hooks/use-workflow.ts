"use client"

// hooks that fetch all workflow using the suspense 

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"

import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";



// export const useSuspensesingleWorkflow = (id: string) => {
//     const trpc = useTRPC();
//     return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
// };


export const useSuspenseWorkflow = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
}

export const useCreateWorkflow = () => {


    const queryClient = useQueryClient()
    const trpc = useTRPC();

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} created successfully`);

            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));

        },
        onError: (error) => {
            toast.error(error.message);
        }
    }))
}


export const useRemoveWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" removed`);
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryFilter({ id: data.id }),
                );
            }
        })
    )
}

export const useSuspenseSingleWorkflow = (id: string) => {
    const trpc = useTRPC();
    console.log("id", id);
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
}

export const useUpdateWorkflowName = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.workflows.updateName.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" updated`);
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({}),
                );
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryOptions({ id: data.id }),
                );
            },
            onError: (error) => {
                toast.error(`Failed to update workflow: ${error.message}`);
            },
        }),
    );
};

// export const useUpdateWorkflow = () => {
//     const queryClient = useQueryClient();
//     const trpc = useTRPC();

//     return useMutation(
//         trpc.workflows.update.mutationOptions({
//             onSuccess: (data) => {
//                 toast.success(`Workflow "${data.name}" saved`);
//                 queryClient.invalidateQueries(
//                     trpc.workflows.getMany.queryOptions({}),
//                 );
//                 queryClient.invalidateQueries(
//                     trpc.workflows.getOne.queryOptions({ id: data.id }),
//                 );
//             },
//             onError: (error) => {
//                 toast.error(`Failed to save workflow: ${error.message}`);
//             },
//         }),
//     );
// };


// Runs in browser
// Reads from React Query cache
// If cache exists → instant data
// If not → fetch from API



// tRPC + React Query Flow (Step-by-step)

// 1. User opens /workflows page

// 2. page.tsx runs on server

// 3. requireAuth()
//    → checks if user is logged in

// 4. await prefetchWorkflows()
//    → calls tRPC getMany on server
//    → Prisma fetches workflows from DB
//    → data stored in React Query cache (server)

// 5. <HydrateClient>
//    → sends server cache to browser

// 6. Browser loads page

// 7. WorkflowList (client component) renders

// 8. useSuspenseWorkflow() runs

// 9. useSuspenseQuery(trpc.workflows.getMany.queryOptions())
//    → checks React Query cache

// 10. Cache already has data
//     → no API call
//     → no loading state

// 11. Data returned instantly

// 12. UI renders workflows