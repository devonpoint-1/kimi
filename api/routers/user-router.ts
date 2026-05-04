import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { users } from "@db/schema";
import { eq, like, or } from "drizzle-orm";

export const userRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(users);
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(users).where(eq(users.id, input.id));
      return result[0] ?? null;
    }),

  search: publicQuery
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(users)
        .where(
          or(
            like(users.name, `%${input.query}%`),
            like(users.phone, `%${input.query}%`),
            like(users.email, `%${input.query}%`)
          )
        );
    }),

  updateProfile: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        status: z.string().optional(),
        avatar: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(users).set(data).where(eq(users.id, id));
      return { success: true };
    }),

  updateLastSeen: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(users)
        .set({ lastSeen: new Date(), isOnline: false })
        .where(eq(users.id, input.id));
      return { success: true };
    }),

  setOnline: publicQuery
    .input(z.object({ id: z.number(), online: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(users)
        .set({ isOnline: input.online, lastSeen: new Date() })
        .where(eq(users.id, input.id));
      return { success: true };
    }),
});
