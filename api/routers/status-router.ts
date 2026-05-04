import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { statuses, statusViews, users } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

export const statusRouter = createRouter({
  list: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      // Get all statuses from contacts (simplified: all users except self)
      const allStatuses = await db
        .select()
        .from(statuses)
        .orderBy(desc(statuses.createdAt));

      const result = [];
      for (const s of allStatuses) {
        if (s.userId === input.userId) continue;

        const user = await db.select().from(users).where(eq(users.id, s.userId));
        const views = await db
          .select()
          .from(statusViews)
          .where(eq(statusViews.statusId, s.id));

        const isViewed = views.some((v) => v.viewerId === input.userId);

        result.push({
          ...s,
          user: user[0] ?? null,
          viewCount: views.length,
          isViewed,
        });
      }

      return result;
    }),

  myStatus: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const myStatuses = await db
        .select()
        .from(statuses)
        .where(eq(statuses.userId, input.userId))
        .orderBy(desc(statuses.createdAt));

      const result = [];
      for (const s of myStatuses) {
        const views = await db
          .select()
          .from(statusViews)
          .where(eq(statusViews.statusId, s.id));

        result.push({
          ...s,
          viewCount: views.length,
        });
      }

      return result;
    }),

  create: publicQuery
    .input(
      z.object({
        userId: z.number(),
        mediaUrl: z.string(),
        caption: z.string().optional(),
        type: z.enum(["image", "video", "text"]).default("text"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const [status] = await db.insert(statuses).values({
        userId: input.userId,
        mediaUrl: input.mediaUrl,
        caption: input.caption ?? null,
        type: input.type,
        expiresAt,
      });

      return { id: Number(status.insertId) };
    }),

  view: publicQuery
    .input(
      z.object({
        statusId: z.number(),
        viewerId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      // Check if already viewed
      const existing = await db
        .select()
        .from(statusViews)
        .where(
          and(
            eq(statusViews.statusId, input.statusId),
            eq(statusViews.viewerId, input.viewerId)
          )
        );

      if (existing.length === 0) {
        await db.insert(statusViews).values({
          statusId: input.statusId,
          viewerId: input.viewerId,
        });
      }

      return { success: true };
    }),
});
