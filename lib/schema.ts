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
  email_verified: boolean('email_verified').default(false).notNull(),
  created_at: timestamp('created_at', {
    mode: 'string',
  }).notNull(),
  updated_at: timestamp('updated_at', {
    mode: 'string',
  }),
  role: userRole('role').default('user').notNull(),
})

export const session = pgTable('session', {
  id: varchar('id', {
    length: 128,
  }).primaryKey(),
  user_id: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  active_expires: bigint('active_expires', {
    mode: 'number',
  }).notNull(),
  idle_expires: bigint('idle_expires', {
    mode: 'number',
  }).notNull(),
})

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.user_id],
    references: [user.id],
  }),
}))

export const key = pgTable('key', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  user_id: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  hashed_password: varchar('hashed_password', {
    length: 255,
  }),
})

export const emailVerificationToken = pgTable('email_verification_token', {
  id: varchar('id', {
    length: 63,
  }).primaryKey(),
  user_id: varchar('user_id', {
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
  user_id: varchar('user_id', {
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
  created_at: timestamp('created_at', {
    mode: 'string',
  }).notNull(),
  updated_at: timestamp('updated_at', {
    mode: 'string',
  }),
})

export const threadToUser = pgTable(
  'thread_to_user',
  {
    thread_id: varchar('thread_id', {
      length: 15,
    })
      .notNull()
      .references(() => thread.id)
      .array(),
    user_id: varchar('user_id', {
      length: 15,
    })
      .notNull()
      .references(() => user.id),
  },
  t => ({
    pk: primaryKey({ columns: [t.user_id, t.thread_id] }),
  })
)

export const message = pgTable('message', {
  id: varchar('id').primaryKey().notNull().$defaultFn(nanoid),
  from_user_id: varchar('from_user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  to_user_id: varchar('to_user_id', { length: 15 })
    .notNull()
    .references(() => user.id)
    .array(),
  thread_id: varchar('thread_id', {
    length: 15,
  }).references(() => thread.id),
  content: text('content').notNull(),
  created_at: timestamp('created_at', {
    mode: 'string',
  }).notNull(),
  updated_at: timestamp('updated_at', {
    mode: 'string',
  }),
  read: boolean('read').default(false).notNull(),
})

export const userRelations = relations(user, ({ many }) => ({
  session: many(session),
  key: many(key),
  email_verification_token: many(emailVerificationToken),
  password_reset_token: many(passwordResetToken),
  thread_to_user: many(threadToUser),
}))

export const keyRelations = relations(key, ({ one }) => ({
  user: one(user, {
    fields: [key.user_id],
    references: [user.id],
  }),
}))

export const emailVerificationTokenRelations = relations(emailVerificationToken, ({ one }) => ({
  user: one(user, {
    fields: [emailVerificationToken.user_id],
    references: [user.id],
  }),
}))

export const passwordResetTokenRelations = relations(passwordResetToken, ({ one }) => ({
  user: one(user, {
    fields: [passwordResetToken.user_id],
    references: [user.id],
  }),
}))

export const threadRelations = relations(thread, ({ many }) => ({
  thread_to_user: many(threadToUser),
  message: many(message),
}))

export const threadToUserRelations = relations(threadToUser, ({ one }) => ({
  thread: one(thread, {
    fields: [threadToUser.thread_id],
    references: [thread.id],
  }),
  user: one(user, {
    fields: [threadToUser.user_id],
    references: [user.id],
  }),
}))

export const messageRelations = relations(message, ({ one }) => ({
  thread: one(thread, {
    fields: [message.thread_id],
    references: [thread.id],
  }),
}))

export type User = InferSelectModel<typeof user>
export type NewUser = InferInsertModel<typeof user>
export type Message = InferSelectModel<typeof message>
export type NewMessage = InferInsertModel<typeof message>
