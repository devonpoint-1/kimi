import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { userRouter } from "./routers/user-router";
import { conversationRouter } from "./routers/conversation-router";
import { messageRouter } from "./routers/message-router";
import { contactRouter } from "./routers/contact-router";
import { statusRouter } from "./routers/status-router";
import { callRouter } from "./routers/call-router";
import { settingsRouter } from "./routers/settings-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  user: userRouter,
  conversation: conversationRouter,
  message: messageRouter,
  contact: contactRouter,
  status: statusRouter,
  call: callRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
