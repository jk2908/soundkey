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

import { nanoid } from '@/utils/nanoid'

export const userRole = pgEnum('user_role', ['user', 'admin'])
export const messageType = pgEnum('message_type', ['message', 'system_message'])

export const user = pgTable('user', {
  id: varchar('id', {
    length: 15,
  }).primaryKey(),
  email: varchar('email', {
    length: 255,
  }).notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
  }).notNull(),
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
  activeExpires: bigint('active_expires', {
    mode: 'number',
  }).notNull(),
  idleExpires: bigint('idle_expires', {
    mode: 'number',
  }).notNull(),
})

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const key = pgTable('key', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  hashedPassword: varchar('hashed_password', {
    length: 255,
  }),
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
  expires: bigint('expires', {
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
  expires: bigint('expires', {
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
  id: varchar('id').primaryKey().notNull().$defaultFn(nanoid),
  messageId: varchar('message_id', {
    length: 15,
  })
    .notNull()
    .array()
    .references(() => message.id || systemMessage.id),
  createdAt: timestamp('created_at', {
    mode: 'string',
  }).notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
})

export const message = pgTable('message', {
  id: varchar('id').primaryKey().notNull().$defaultFn(nanoid),
  threadId: varchar('thread_id', {
    length: 15,
  }).notNull(),
  fromUserId: varchar('from_user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  toUserId: varchar('to_user_id', { length: 15 })
    .notNull()
    .references(() => user.id)
    .array(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
  }).notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
  read: boolean('read').default(false).notNull(),
  type: messageType('message_type').default('message').notNull(),
})

export const systemMessage = pgTable('system_message', {
  id: varchar('id').primaryKey().notNull().$defaultFn(nanoid),
  threadId: varchar('thread_id', {
    length: 15,
  }).notNull(),
  fromUserId: varchar('from_user_id', {
    enum: ['system'],
  }).notNull(),
  toUserId: varchar('to_user_id', { length: 15 })
    .notNull()
    .references(() => user.id)
    .array(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
  }).notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
  read: boolean('read').default(false).notNull(),
  type: messageType('message_type').default('system_message').notNull(),
})

export const userRelations = relations(user, ({ many }) => ({
  session: many(session),
  key: many(key),
  emailVerificationToken: many(emailVerificationToken),
  passwordResetToken: many(passwordResetToken),
  threadToUser: many(threadToUser),
}))

export const keyRelations = relations(key, ({ one }) => ({
  user: one(user, {
    fields: [key.userId],
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
  systemMessage: many(systemMessage),
}))

export type User = InferSelectModel<typeof user>
export type NewUser = InferInsertModel<typeof user>
export type Message = InferSelectModel<typeof message>
export type NewMessage = Omit<InferInsertModel<typeof message>, 'threadId'>
export type SystemMessage = Omit<InferSelectModel<typeof systemMessage>, 'messageType'>
export type NewSystemMessage = Omit<
  InferInsertModel<typeof systemMessage>,
  'threadId' | 'messageType' | 'fromUserId'
>
