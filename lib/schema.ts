import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { generateId } from '@/utils/generate-id'

export const userRoles = ['user', 'admin', 'system'] as const
export const userRole = text('user_role', { enum: userRoles })

export const messageTypes = ['message', 'system_message'] as const
export const messageType = text('message_type', { enum: messageTypes })

export const user = sqliteTable('user', {
  id: text('id', {
    length: 15,
  })
    .primaryKey()
    .$defaultFn(generateId),
  email: text('email', {
    length: 255,
  })
    .unique()
    .notNull(),
  hashedPassword: text('hashed_password', {
    length: 255,
  }).notNull(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', {
    mode: 'timestamp_ms',
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', {
    mode: 'timestamp_ms',
  }),
  role: userRole.default('user').notNull(),
})

export const session = sqliteTable('session', {
  id: text('id', {
    length: 128,
  }).primaryKey(),
  userId: text('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', {
    mode: 'timestamp_ms',
  }).notNull(),
})

export const emailVerificationToken = sqliteTable('email_verification_token', {
  id: text('id', {
    length: 63,
  }).primaryKey(),
  userId: text('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', {
    mode: 'timestamp_ms',
  }).notNull(),
})

export const passwordResetToken = sqliteTable('password_reset_token', {
  id: text('id', {
    length: 63,
  }).primaryKey(),
  userId: text('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', {
    mode: 'timestamp_ms',
  }).notNull(),
})

export const threadToUser = sqliteTable(
  'thread_to_user',
  {
    threadId: text('thread_id', {
      length: 15,
    })
      .notNull()
      .references(() => thread.id),
    userId: text('user_id', {
      length: 15,
    })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  t => ({
    pk: primaryKey({ columns: [t.userId, t.threadId] }),
  })
)

export const thread = sqliteTable('thread', {
  id: text('id').primaryKey().notNull().$defaultFn(generateId),
  messageIds: text('message_ids', {
    length: 15,
  })
    .references(() => message.id)
    .notNull(),
  createdAt: integer('created_at', {
    mode: 'timestamp_ms',
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', {
    mode: 'timestamp_ms',
  }),
})

export const message = sqliteTable('message', {
  id: text('id').primaryKey().notNull().$defaultFn(generateId),
  threadId: text('thread_id', {
    length: 15,
  }).notNull(),
  senderId: text('sender_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  recipientIds: text('recipient_ids', { length: 15 })
    .references(() => user.id)
    .notNull(),
  body: text('body').notNull(),
  createdAt: integer('created_at', {
    mode: 'timestamp_ms',
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', {
    mode: 'timestamp_ms',
  }),
  read: integer('read', { mode: 'boolean' }).default(false).notNull(),
  type: messageType.notNull(),
})

export const userRelations = relations(user, ({ many }) => ({
  session: many(session),
  emailVerificationToken: many(emailVerificationToken),
  passwordResetToken: many(passwordResetToken),
  threadToUser: many(threadToUser),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const emailVerificationTokenRelations = relations(emailVerificationToken, ({ one }) => ({
  user: one(user, {
    fields: [emailVerificationToken.userId],
    references: [user.id],
  }),
}))

export const passwordResetTokenRelations = relations(passwordResetToken, ({ one }) => ({
  user: one(user, {
    fields: [passwordResetToken.userId],
    references: [user.id],
  }),
}))

export const threadToUserRelations = relations(threadToUser, ({ one }) => ({
  thread: one(thread, {
    fields: [threadToUser.threadId],
    references: [thread.id],
  }),
  user: one(user, {
    fields: [threadToUser.userId],
    references: [user.id],
  }),
}))

export const threadRelations = relations(thread, ({ many }) => ({
  threadToUser: many(threadToUser),
  message: many(message),
}))

export const messageRelations = relations(message, ({ one }) => ({
  thread: one(thread, {
    fields: [message.threadId],
    references: [thread.id],
  }),
}))

export type User = InferSelectModel<typeof user>
export type NewUser = Omit<InferInsertModel<typeof user>, 'id' | 'hashedPassword'> & {
  password: string
}
export type Message = InferSelectModel<typeof message>
export type NewMessage = Omit<
  InferInsertModel<typeof message>,
  'threadId' | 'recipientIds' | 'type'
> & { threadId?: string; recipientIds: string[]; type: MessageType }
export type EditMessage = Omit<InferInsertModel<typeof message>, 'threadId' | 'createdAt' | 'type'>
export type MessageType = (typeof messageTypes)[number]
export type UserRole = (typeof userRoles)[number]
