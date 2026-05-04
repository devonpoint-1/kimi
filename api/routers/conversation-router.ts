import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { conversations, conversationParticipants, messages, users } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

export const conversationRouter = createRouter({
  list: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      // Get all conversation IDs where user is a participant
      const participantRows = await db
        .select()
        .from(conversationParticipants)
        .where(eq(conversationParticipants.userId, input.userId));

      const conversationIds = participantRows.map((p) => p.conversationId);

      if (conversationIds.length === 0) return [];

      // Get conversations with last message
      const result = [];
      for (const convId of conversationIds) {
        const conv = await db
          .select()
          .from(conversations)
          .where(eq(conversations.id, convId));

        if (conv.length === 0) continue;

        const participants = await db
          .select()
          .from(conversationParticipants)
          .where(eq(conversationParticipants.conversationId, convId));

        const lastMessage = await db
          .select()
          .from(messages)
          .where(eq(messages.conversationId, convId))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        const participantUsers = [];
        for (const p of participants) {
          const u = await db.select().from(users).where(eq(users.id, p.userId));
          if (u.length > 0) {
            participantUsers.push({ ...u[0], isAdmin: p.isAdmin });
          }
        }

        result.push({
          ...conv[0],
          participants: participantUsers,
          lastMessage: lastMessage[0] ?? null,
        });
      }

      return result.sort((a, b) => {
        const aTime = a.lastMessage?.createdAt ?? a.createdAt;
        const bTime = b.lastMessage?.createdAt ?? b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const conv = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.id));

      if (conv.length === 0) return null;

      const participants = await db
        .select()
        .from(conversationParticipants)
        .where(eq(conversationParticipants.conversationId, input.id));

      const participantUsers = [];
      for (const p of participants) {
        const u = await db.select().from(users).where(eq(users.id, p.userId));
        if (u.length > 0) {
          participantUsers.push({ ...u[0], isAdmin: p.isAdmin });
        }
      }

      return { ...conv[0], participants: participantUsers };
    }),

  create: publicQuery
    .input(
      z.object({
        type: z.enum(["individual", "group"]),
        participantIds: z.array(z.number()),
        name: z.string().optional(),
        createdBy: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [conv] = await db.insert(conversations).values({
        type: input.type,
        name: input.name ?? null,
        createdBy: input.createdBy,
      });

      const convId = Number(conv.insertId);

      for (const userId of input.participantIds) {
        await db.insert(conversationParticipants).values({
          conversationId: convId,
          userId,
          isAdmin: userId === input.createdBy,
        });
      }

      return { id: convId };
    }),

  addParticipant: publicQuery
    .input(
      z.object({
        conversationId: z.number(),
        userId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(conversationParticipants).values({
        conversationId: input.conversationId,
        userId: input.userId,
        isAdmin: false,
      });
      return { success: true };
    }),

  removeParticipant: publicQuery
    .input(
      z.object({
        conversationId: z.number(),
        userId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(conversationParticipants)
        .where(
          and(
            eq(conversationParticipants.conversationId, input.conversationId),
            eq(conversationParticipants.userId, input.userId)
          )
        );
      return { success: true };
    }),
});
