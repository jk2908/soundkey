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

export const thread = pgTable('thread', {
  id: varchar('id').primaryKey().notNull().$defaultFn(nanoid),
  createdAt: timestamp('created_at', {
    mode: 'string',
  }).notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
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

export const message = pgTable('message', {
  id: varchar('id').primaryKey().notNull().$defaultFn(nanoid),
  fromUserId: varchar('from_user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  toUserId: varchar('to_user_id', { length: 15 })
    .notNull()
    .references(() => user.id)
    .array(),
  threadId: varchar('thread_id', {
    length: 15,
  }).references(() => thread.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
  }).notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
  read: boolean('read').default(false).notNull(),
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

export const threadRelations = relations(thread, ({ many }) => ({
  threadToUser: many(threadToUser),
  message: many(message),
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

export const messageRelations = relations(message, ({ one }) => ({
  thread: one(thread, {
    fields: [message.threadId],
    references: [thread.id],
  }),
}))

export type User = InferSelectModel<typeof user>
export type NewUser = InferInsertModel<typeof user>
export type Message = InferSelectModel<typeof message>
export type NewMessage = InferInsertModel<typeof message>
