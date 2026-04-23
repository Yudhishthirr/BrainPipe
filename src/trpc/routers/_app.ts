import { z } from 'zod';
import { baseProcedure, protectedProcedure, createTRPCRouter } from '../init';
import prisma from '@/lib/db';

export const appRouter = createTRPCRouter({
    getUsers: protectedProcedure.query(({ ctx }) => {
        console.log({ userId: ctx.auth.user.id })
        return prisma.user.findMany({
            where: {
                id: ctx.auth.user.id
            }
        });
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;


//query is get type of api call
//mutation is post type of api call
//procedure is both get and post
