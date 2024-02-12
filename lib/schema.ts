import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import {
  bigint,
  boolean,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { generateId } from '@/utils/generate-id'

export const userRoles = ['user', 'admin', 'system'] as const
export const userRole = pgEnum('user_role', userRoles)

export const messageTypes = ['message', 'system_message'] as const
export const messageType = pgEnum('message_type', messageTypes)

export const user = pgTable('user', {
  id: varchar('id', {
    length: 15,
  })
    .primaryKey()
    .$defaultFn(generateId),
  userId: varchar('user_id', {
    length: 15,
  })
    .unique()
    .notNull(),
  email: varchar('email', {
    length: 255,
  })
    .unique()
    .notNull(),
  password: varchar('password', {
    length: 255,
  }).notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
  role: userRole('role').default('user').notNull(),
})

export const session = pgTable('session', {
  id: varchar('id', {
    length: 128,
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    mode: 'string',
  }).notNull(),
})

export const emailVerificationToken = pgTable('email_verification_token', {
  id: varchar('id', {
    length: 63,
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: bigint('expires_at', {
    mode: 'number',
  }).notNull(),
})

export const passwordResetToken = pgTable('password_reset_token', {
  id: varchar('id', {
    length: 63,
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: bigint('expires_at', {
    mode: 'number',
  }).notNull(),
})

export const threadToUser = pgTable(
  'thread_to_user',
  {
    threadId: varchar('thread_id', {
      length: 15,
    })
      .notNull()
      .references(() => thread.id),
    userId: varchar('user_id', {
      length: 15,
    })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  t => ({
    pk: primaryKey({ columns: [t.userId, t.threadId] }),
  })
)

export const thread = pgTable('thread', {
  id: varchar('id').primaryKey().notNull().$defaultFn(generateId),
  messageIds: varchar('message_ids', {
    length: 15,
  })
    .references(() => message.id)
    .array()
    .notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
})

export const message = pgTable('message', {
  id: varchar('id').primaryKey().notNull().$defaultFn(generateId),
  threadId: varchar('thread_id', {
    length: 15,
  }).notNull(),
  senderId: varchar('sender_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  recipientIds: varchar('recipient_ids', { length: 15 })
    .references(() => user.id)
    .array()
    .notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
  read: boolean('read').default(false).notNull(),
  type: messageType('message_type').notNull(),
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
export type NewUser = Omit<InferInsertModel<typeof user>, 'userId'>
export type Message = InferSelectModel<typeof message>
export type NewMessage = Omit<
  InferInsertModel<typeof message>,
  'threadId' | 'recipientIds' | 'type'
> & { threadId?: string; recipientIds: string[]; type: MessageType }
export type EditMessage = Omit<InferInsertModel<typeof message>, 'threadId' | 'createdAt' | 'type'>
export type MessageType = (typeof messageTypes)[number]
export type UserRole = (typeof userRoles)[number]
