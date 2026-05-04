import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { messages, messageStatus, users } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const messageRouter = createRouter({
  list: publicQuery
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const msgs = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, input.conversationId))
        .orderBy(desc(messages.createdAt))
        .limit(100);

      const result = [];
      for (const msg of msgs) {
        const sender = await db
          .select()
          .from(users)
          .where(eq(users.id, msg.senderId));

        const status = await db
          .select()
          .from(messageStatus)
          .where(eq(messageStatus.messageId, msg.id));

        result.push({
          ...msg,
          sender: sender[0] ?? null,
          status: status,
        });
      }

      return result.reverse();
    }),

  send: publicQuery
    .input(
      z.object({
        conversationId: z.number(),
        senderId: z.number(),
        content: z.string(),
        type: z.enum(["text", "image", "video", "audio", "file", "voice"]).default("text"),
        mediaUrl: z.string().optional(),
        replyTo: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [msg] = await db.insert(messages).values({
        conversationId: input.conversationId,
        senderId: input.senderId,
        content: input.content,
        type: input.type,
        mediaUrl: input.mediaUrl ?? null,
        replyTo: input.replyTo ?? null,
      });

      const messageId = Number(msg.insertId);

      // Create initial sent status
      await db.insert(messageStatus).values({
        messageId,
        userId: input.senderId,
        status: "sent",
      });

      return { id: messageId };
    }),

  updateStatus: publicQuery
    .input(
      z.object({
        messageId: z.number(),
        userId: z.number(),
        status: z.enum(["sent", "delivered", "read"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(messageStatus)
        .where(
          eq(messageStatus.messageId, input.messageId)
        );

      if (existing.length > 0) {
        await db
          .update(messageStatus)
          .set({ status: input.status, updatedAt: new Date() })
          .where(eq(messageStatus.id, existing[0].id));
      } else {
        await db.insert(messageStatus).values({
          messageId: input.messageId,
          userId: input.userId,
          status: input.status,
        });
      }

      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(messages)
        .set({ isDeleted: true })
        .where(eq(messages.id, input.id));
      return { success: true };
    }),
});
