import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { calls, users } from "@db/schema";
import { eq, or, desc } from "drizzle-orm";

export const callRouter = createRouter({
  list: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const callRows = await db
        .select()
        .from(calls)
        .where(
          or(
            eq(calls.callerId, input.userId),
            eq(calls.receiverId, input.userId)
          )
        )
        .orderBy(desc(calls.createdAt));

      const result = [];
      for (const c of callRows) {
        const otherId = c.callerId === input.userId ? c.receiverId : c.callerId;
        const otherUser = await db.select().from(users).where(eq(users.id, otherId));

        result.push({
          ...c,
          otherUser: otherUser[0] ?? null,
          isCaller: c.callerId === input.userId,
        });
      }

      return result;
    }),

  initiate: publicQuery
    .input(
      z.object({
        callerId: z.number(),
        receiverId: z.number(),
        type: z.enum(["audio", "video"]).default("audio"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [call] = await db.insert(calls).values({
        callerId: input.callerId,
        receiverId: input.receiverId,
        type: input.type,
        status: "outgoing",
        startedAt: new Date(),
      });

      return { id: Number(call.insertId) };
    }),

  end: publicQuery
    .input(
      z.object({
        id: z.number(),
        duration: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(calls)
        .set({
          endedAt: new Date(),
          duration: input.duration,
          status: "received",
        })
        .where(eq(calls.id, input.id));

      return { success: true };
    }),

  miss: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(calls)
        .set({ status: "missed", endedAt: new Date() })
        .where(eq(calls.id, input.id));

      return { success: true };
    }),
});
