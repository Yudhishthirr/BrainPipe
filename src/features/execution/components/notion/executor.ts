import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/execution/types";
import { notionChannel } from "@/inngest/channels/notion";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type NotionData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const notionExecutor: NodeExecutor<NotionData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    notionChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.content) {
    await publish(
      notionChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Notion node: Message content is required");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run("notion-webhook", async () => {
      if (!data.webhookUrl) {
        await publish(
          notionChannel().status({
            nodeId,
            status: "error",
          }),
        );
        throw new NonRetriableError("Notion node: Webhook URL is required");
      }

      await ky.post(data.webhookUrl, {
        json: {
          content: content.slice(0, 2000), // Notion's max message length
          username,
        },
      });

      if (!data.variableName) {
        await publish(
          notionChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Notion node: Variable name is missing");
      }

      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });
    
    await publish(
      notionChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
     await publish(
      notionChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
