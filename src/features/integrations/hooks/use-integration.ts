"use client";

import { useQuery }
  from "@tanstack/react-query";

import { useTRPC }
  from "@/trpc/client";

export const useGetNotionDatabases =
  (enabled = true) => {

    const trpc = useTRPC();

    return useQuery(
      trpc.integrations
        .getNotionDatabases
        .queryOptions(
          undefined,
          {
            enabled,
            retry: false,
          }
        )
    );
};