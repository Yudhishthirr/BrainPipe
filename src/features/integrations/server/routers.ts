import prisma from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { Client } from "@notionhq/client";
import z from "zod";

export const integrationsRouter = createTRPCRouter({
 getNotionDatabases:
  protectedProcedure.query(async ({ ctx }) => {

    const integration =
      await prisma.integration.findFirst({
        where: {
          userId: ctx.auth.user.id,
          provider: "notion",
        },
      });

    if (!integration) {
      throw new Error(
        "Notion not connected"
      );
    }

    const notion = new Client({
      auth:
        integration.accessToken,
    });

    const response =
      await notion.search({
        filter: {
          property: "object",
          value: "data_source",
        },
      });

    return response.results.map(
      (db) => ({
        id: db.id,

        title:
          "title" in db &&
          Array.isArray(db.title)
            ? db.title[0]?.plain_text
            : "Untitled",
      })
    );
  }),
  // create: protectedProcedure
  //   .input(
  //     z.object({
  //       accessToken: z.string(),
  //       refreshToken: z.string(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {

  //     return prisma.integration.create({
  //       data: {
  //         provider: "notion",

  //         accessToken:
  //           input.accessToken,

  //         refreshToken:
  //           input.refreshToken,

  //         userId:
  //           ctx.auth.user.id,
  //       },
  //     });
  //   }),

  // Implementation for creating an integration
})