"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { notionChannel } from "@/inngest/channels/notion";
import { inngest } from "@/inngest/client";

export type NotionToken = Realtime.Token<
  typeof notionChannel,
  ["status"]
>;

export async function fetchNotionRealtimeToken(): Promise<NotionToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: notionChannel(),
    topics: ["status"],
  });

  return token;
};
