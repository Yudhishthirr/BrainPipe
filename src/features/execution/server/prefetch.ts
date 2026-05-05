import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.execution.getMany>;

/**
 * Prefetch all executions
 */
export const prefetchExecutions = (params: Input) => {
  return prefetch(trpc.execution.getMany.queryOptions(params));
};

/**
 * Prefetch a single execution
 */
export const prefetchExecution = (id: string) => {
  return prefetch(trpc.execution.getOne.queryOptions({ id }));
};
