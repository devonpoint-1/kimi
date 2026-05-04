import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { contacts, users } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const contactRouter = createRouter({
  list: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const contactRows = await db
        .select()
        .from(contacts)
        .where(eq(contacts.userId, input.userId));

      const result = [];
      for (const c of contactRows) {
        const contactUser = await db
          .select()
          .from(users)
          .where(eq(users.id, c.contactId));

        if (contactUser.length > 0) {
          result.push({
            ...c,
            contact: contactUser[0],
          });
        }
      }

      return result;
    }),

  add: publicQuery
    .input(
      z.object({
        userId: z.number(),
        contactId: z.number(),
        customName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(contacts).values({
        userId: input.userId,
        contactId: input.contactId,
        customName: input.customName ?? null,
      });
      return { success: true };
    }),

  remove: publicQuery
    .input(
      z.object({
        userId: z.number(),
        contactId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(contacts)
        .where(
          and(
            eq(contacts.userId, input.userId),
            eq(contacts.contactId, input.contactId)
          )
        );
      return { success: true };
    }),

  toggleBlock: publicQuery
    .input(
      z.object({
        id: z.number(),
        blocked: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(contacts)
        .set({ isBlocked: input.blocked })
        .where(eq(contacts.id, input.id));
      return { success: true };
    }),
});
