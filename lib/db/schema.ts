import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const tokens = sqliteTable(
  'tokens',
  {
    id: text('id').primaryKey(),
    orderId: text('order_id'),
    label: text('label'),
    state: text('state', { enum: ['created', 'completed', 'revoked'] })
      .notNull()
      .default('created'),
    email: text('email'),
    emailSent: integer('email_sent', { mode: 'boolean' }).notNull().default(false),
    answers: text('answers'),
    scores: text('scores'),
    archetype: text('archetype'),
    resultImage: text('result_image'),
    shareImageCount: integer('share_image_count').notNull().default(0),
    createdAt: integer('created_at').notNull(),
    completedAt: integer('completed_at'),
  },
  (t) => ({
    orderIdIdx: index('tokens_order_id_idx').on(t.orderId),
    stateIdx: index('tokens_state_idx').on(t.state),
    createdAtIdx: index('tokens_created_at_idx').on(t.createdAt),
  }),
);

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export type Token = typeof tokens.$inferSelect;
export type NewToken = typeof tokens.$inferInsert;
export type Setting = typeof settings.$inferSelect;
