import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
    hello: baseProcedure
        .input(
            z.object({
                text: z.string(),
            }),
        )
        .query((opts) => {
            return {
                greeting: `hello ${opts.input.text}`,
            };
        }),
});

// export type definition of API
export type AppRouter = typeof appRouter;


//query is get type of api call
//mutation is post type of api call
//procedure is both get and post
