
import { protectedProcedure, createTRPCRouter } from '../init';

import { workflowsRouter } from '@/features/workflows/server/routers';

export const appRouter = createTRPCRouter({
    workflows: workflowsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;


//query is get type of api call
//mutation is post type of api call
//procedure is both get and post
