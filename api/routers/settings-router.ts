import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { userSettings } from "@db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = createRouter({
  get: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, input.userId));

      if (result.length === 0) {
        // Create default settings
        const [newSettings] = await db.insert(userSettings).values({
          userId: input.userId,
        });

        const created = await db
          .select()
          .from(userSettings)
          .where(eq(userSettings.id, Number(newSettings.insertId)));

        return created[0];
      }

      return result[0];
    }),

  update: publicQuery
    .input(
      z.object({
        userId: z.number(),
        language: z.string().optional(),
        theme: z.enum(["dark", "light"]).optional(),
        fontSize: z.enum(["small", "medium", "large"]).optional(),
        readReceipts: z.boolean().optional(),
        lastSeenPrivacy: z.enum(["everyone", "contacts", "nobody"]).optional(),
        profilePhotoPrivacy: z.enum(["everyone", "contacts", "nobody"]).optional(),
        aboutPrivacy: z.enum(["everyone", "contacts", "nobody"]).optional(),
        notificationsEnabled: z.boolean().optional(),
        soundEnabled: z.boolean().optional(),
        vibrationEnabled: z.boolean().optional(),
        showPreview: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { userId, ...data } = input;

      const existing = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, userId));

      if (existing.length === 0) {
        await db.insert(userSettings).values({
          userId,
          ...data,
        });
      } else {
        await db
          .update(userSettings)
          .set(data)
          .where(eq(userSettings.userId, userId));
      }

      return { success: true };
    }),
});
