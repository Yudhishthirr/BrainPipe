// src/inngest/client.ts
import { Inngest } from "inngest";
import { realtimeMiddleware } from "@inngest/realtime/middleware";


export const inngest = new Inngest({ 
    id: "brainpipi",
    middleware: [realtimeMiddleware()],
});