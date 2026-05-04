import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  bigint,
  int,
} from "drizzle-orm/mysql-core";

// المستخدمين
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  avatar: text("avatar"),
  status: text("status"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  publicKey: text("publicKey"),
  isOnline: boolean("isOnline").default(false),
  lastSeen: timestamp("lastSeen").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// المحادثات (فردية وجماعية)
export const conversations = mysqlTable("conversations", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", ["individual", "group"]).default("individual").notNull(),
  name: varchar("name", { length: 100 }),
  avatar: text("avatar"),
  description: text("description"),
  createdBy: bigint("createdBy", { mode: "number", unsigned: true }).references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Conversation = typeof conversations.$inferSelect;

// مشاركو المحادثات
export const conversationParticipants = mysqlTable("conversation_participants", {
  id: serial("id").primaryKey(),
  conversationId: bigint("conversationId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => conversations.id),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  isAdmin: boolean("isAdmin").default(false),
});

export type ConversationParticipant = typeof conversationParticipants.$inferSelect;

// الرسائل
export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: bigint("conversationId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => conversations.id),
  senderId: bigint("senderId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["text", "image", "video", "audio", "file", "voice"])
    .default("text")
    .notNull(),
  mediaUrl: text("mediaUrl"),
  replyTo: bigint("replyTo", { mode: "number", unsigned: true })
    .references(() => messages.id),
  isForwarded: boolean("isForwarded").default(false),
  isDeleted: boolean("isDeleted").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Message = typeof messages.$inferSelect;

// حالة الرسائل (sent, delivered, read)
export const messageStatus = mysqlTable("message_status", {
  id: serial("id").primaryKey(),
  messageId: bigint("messageId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => messages.id),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  status: mysqlEnum("status", ["sent", "delivered", "read"]).default("sent").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type MessageStatus = typeof messageStatus.$inferSelect;

// جهات الاتصال
export const contacts = mysqlTable("contacts", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  contactId: bigint("contactId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  customName: varchar("customName", { length: 100 }),
  isBlocked: boolean("isBlocked").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;

// الحالات (Stories)
export const statuses = mysqlTable("statuses", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  mediaUrl: text("mediaUrl").notNull(),
  caption: text("caption"),
  type: mysqlEnum("type", ["image", "video", "text"]).default("image").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type Status = typeof statuses.$inferSelect;

// مشاهدات الحالات
export const statusViews = mysqlTable("status_views", {
  id: serial("id").primaryKey(),
  statusId: bigint("statusId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => statuses.id),
  viewerId: bigint("viewerId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type StatusView = typeof statusViews.$inferSelect;

// المكالمات
export const calls = mysqlTable("calls", {
  id: serial("id").primaryKey(),
  callerId: bigint("callerId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  receiverId: bigint("receiverId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  type: mysqlEnum("type", ["audio", "video"]).default("audio").notNull(),
  status: mysqlEnum("status", ["missed", "received", "outgoing"]).default("outgoing").notNull(),
  duration: int("duration"),
  startedAt: timestamp("startedAt").defaultNow(),
  endedAt: timestamp("endedAt"),
});

export type Call = typeof calls.$inferSelect;

// إعدادات المستخدم
export const userSettings = mysqlTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id)
    .unique(),
  language: varchar("language", { length: 10 }).default("ar"),
  theme: mysqlEnum("theme", ["dark", "light"]).default("dark"),
  fontSize: mysqlEnum("fontSize", ["small", "medium", "large"]).default("medium"),
  readReceipts: boolean("readReceipts").default(true),
  lastSeenPrivacy: mysqlEnum("lastSeenPrivacy", ["everyone", "contacts", "nobody"]).default("everyone"),
  profilePhotoPrivacy: mysqlEnum("profilePhotoPrivacy", ["everyone", "contacts", "nobody"]).default("everyone"),
  aboutPrivacy: mysqlEnum("aboutPrivacy", ["everyone", "contacts", "nobody"]).default("everyone"),
  notificationsEnabled: boolean("notificationsEnabled").default(true),
  soundEnabled: boolean("soundEnabled").default(true),
  vibrationEnabled: boolean("vibrationEnabled").default(true),
  showPreview: boolean("showPreview").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type UserSettings = typeof userSettings.$inferSelect;
