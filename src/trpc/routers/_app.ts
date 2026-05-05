
import { credentialsRouter } from '@/features/credentials/server/routers';
import { protectedProcedure, createTRPCRouter } from '../init';

import { workflowsRouter } from '@/features/workflows/server/routers';
import { executionsRouter } from '@/features/execution/server/routers';

export const appRouter = createTRPCRouter({
    workflows: workflowsRouter,
    credentials: credentialsRouter,
    execution: executionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;


//query is get type of api call
//mutation is post type of api call
//procedure is both get and post
