import { uuid, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"; // Assuming 'uuid' is the correct import for UUIDs

export const offersTable = pgTable("offers_table", {
  id: uuid("id").primaryKey().defaultRandom(), // Use UUID with a default random value
  userId: varchar("user_id", { length: 50 }).notNull(), // Assuming userId is also a UUID
  clientName: text("client_name").notNull(), // Added field for client's name
  clientAddress: text("client_address").notNull(), // Added field for client's address
  content: text("content").default(""), // Make content optional with default ""
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const chatMessagesTable = pgTable("chat_messages_table", {
  id: uuid("id").primaryKey().defaultRandom(), // Use UUID with a default random value
  offerId: uuid("offer_id")
    .notNull()
    .references(() => offersTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // Assuming sender is stored as text (User or AI)
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export type InsertOffer = typeof offersTable.$inferInsert;
export type Offer = typeof offersTable.$inferSelect;

export type InsertChatMessage = typeof chatMessagesTable.$inferInsert;
export type ChatMessage = typeof chatMessagesTable.$inferSelect;
