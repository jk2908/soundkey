import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { bigint, boolean, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', ['user', 'admin'])

export const user = pgTable('user', {
  id: varchar('id', {
    length: 15,
  }).primaryKey(),
  email: varchar('email', {
    length: 255,
  }).notNull(),
  email_verified: boolean('email_verified').default(false).notNull(),
  role: userRole('role').default('user').notNull(),
})

export type User = InferSelectModel<typeof user>
export type UserInsert = InferInsertModel<typeof user>

export const userRelations = relations(user, ({ many }) => ({
  session: many(session),
  key: many(key),
  email_verification_token: many(emailVerificationToken),
  password_reset_token: many(passwordResetToken),
}))

export const session = pgTable('session', {
  id: varchar('id', {
    length: 128,
  }).primaryKey(),
  user_id: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
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
    references: [user.id]
  })
}))

export const key = pgTable('key', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  user_id: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  hashed_password: varchar('hashed_password', {
    length: 255,
  }),
})

export const keyRelations = relations(key, ({ one }) => ({
  user: one(user, {
    fields: [key.user_id],
    references: [user.id]
  }),
}))

export const emailVerificationToken = pgTable('email_verification_token', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  user_id: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  expires: bigint('expires', {
    mode: 'number',
  }).notNull(),
})

export const emailVerificationTokenRelations = relations(emailVerificationToken, ({ one }) => ({
  user: one(user, {
    fields: [emailVerificationToken.user_id],
    references: [user.id]
  }),
}))

export const passwordResetToken = pgTable('password_reset_token', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  user_id: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  expires: bigint('expires', {
    mode: 'number',
  }).notNull(),
})

export const passwordResetTokenRelations = relations(passwordResetToken, ({ one }) => ({
  user: one(user, {
    fields: [passwordResetToken.user_id],
    references: [user.id]
  }),
}))
