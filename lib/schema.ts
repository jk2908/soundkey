import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { generateId } from '@/utils/generate-id'

export const userRoles = ['user', 'admin', 'system'] as const
export const userRole = text('user_role', { enum: userRoles })

export const messageTypes = ['message', 'system_message'] as const
export const messageType = text('message_type', { enum: messageTypes })

export const userTable = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId()),
  email: text('email')
    .unique()
    .notNull(),
  hashedPassword: text('hashed_password').notNull(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at'),
  role: userRole.default('user').notNull(),
})

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
  expiresAt: integer('expires_at').notNull(),
})

export const emailVerificationTokenTable = sqliteTable('email_verification_token', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
})

export const passwordResetTokenTable = sqliteTable('password_reset_token', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
})

export const threadToUserTable = sqliteTable(
  'thread_to_user',
  {
    threadId: text('thread_id')
      .notNull()
      .references(() => threadTable.id),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  },
  t => ({
    pk: primaryKey({ columns: [t.userId, t.threadId] }),
  })
)

export const threadTable = sqliteTable('thread', {
  id: text('id').primaryKey().notNull().$defaultFn(() => generateId()),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at'),
})

export const messageTable = sqliteTable('message', {
  id: text('id').primaryKey().notNull().$defaultFn(() => generateId()),
  threadId: text('thread_id').notNull(),
  senderId: text('sender_id')
    .notNull()
    .references(() => userTable.id),
  recipientIds: text('recipient_ids')
    .references(() => userTable.id)
    .notNull(),
  body: text('body').notNull(),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at'),
  read: integer('read', { mode: 'boolean' }).default(false).notNull(),
  type: messageType.notNull(),
})

export const userRelations = relations(userTable, ({ many }) => ({
  session: many(sessionTable),
  emailVerificationToken: many(emailVerificationTokenTable),
  passwordResetToken: many(passwordResetTokenTable),
  threadToUser: many(threadToUserTable),
}))

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}))

export const emailVerificationTokenRelations = relations(
  emailVerificationTokenTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [emailVerificationTokenTable.userId],
      references: [userTable.id],
    }),
  })
)

export const passwordResetTokenRelations = relations(passwordResetTokenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [passwordResetTokenTable.userId],
    references: [userTable.id],
  }),
}))

export const threadToUserRelations = relations(threadToUserTable, ({ one }) => ({
  thread: one(threadTable, {
    fields: [threadToUserTable.threadId],
    references: [threadTable.id],
  }),
  user: one(userTable, {
    fields: [threadToUserTable.userId],
    references: [userTable.id],
  }),
}))

export const threadRelations = relations(threadTable, ({ many }) => ({
  threadToUser: many(threadToUserTable),
  message: many(messageTable),
}))

export const messageRelations = relations(messageTable, ({ one }) => ({
  thread: one(threadTable, {
    fields: [messageTable.threadId],
    references: [threadTable.id],
  }),
}))

export type User = InferSelectModel<typeof userTable>
export type NewUser = Omit<InferInsertModel<typeof userTable>, 'id' | 'hashedPassword'> & {
  password: string
}
export type Message = InferSelectModel<typeof messageTable>
export type NewMessage = Omit<
  InferInsertModel<typeof messageTable>,
  'threadId' | 'recipientIds' | 'type'
> & { threadId?: string; recipientIds: string[]; type: MessageType }
export type EditMessage = Omit<
  InferInsertModel<typeof messageTable>,
  'threadId' | 'createdAt' | 'type'
>
export type MessageType = (typeof messageTypes)[number]
export type UserRole = (typeof userRoles)[number]
