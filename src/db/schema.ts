import { pgTable, uuid, text, timestamp, integer, boolean, decimal } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  auth_id: text('auth_id').unique().notNull(), // Links to Supabase auth.users
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  role: text('role').notNull().default('staff'), // 'owner' or 'staff'
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  address: text('address'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  unit: text('unit').notNull().default('kg'), // 'kg' or 'unit'
  status: boolean('status').notNull().default(true), // active/inactive
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  order_number: text('order_number').unique().notNull(),
  customer_id: uuid('customer_id').references(() => customers.id).notNull(),
  subtotal: integer('subtotal').notNull(),
  discount: integer('discount').default(0).notNull(),
  total: integer('total').notNull(),
  payment_status: text('payment_status').notNull().default('unpaid'), // 'unpaid', 'paid'
  payment_method: text('payment_method'), // 'cash', 'transfer'
  laundry_status: text('laundry_status').notNull().default('diterima'), // diterima, dicuci, dikeringkan, disetrika, siap diambil, selesai
  notes: text('notes'),
  created_by: uuid('created_by').references(() => users.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  order_id: uuid('order_id').references(() => orders.id).notNull(),
  service_id: uuid('service_id').references(() => services.id).notNull(),
  quantity: decimal('quantity').notNull(),
  price: integer('price').notNull(),
  subtotal: integer('subtotal').notNull(),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  order_id: uuid('order_id').references(() => orders.id).notNull(),
  amount: integer('amount').notNull(),
  method: text('method').notNull(),
  status: text('status').notNull().default('success'),
  paid_at: timestamp('paid_at').defaultNow().notNull(),
  created_by: uuid('created_by').references(() => users.id).notNull(),
});

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: text('category').notNull(),
  amount: integer('amount').notNull(),
  description: text('description'),
  date: timestamp('date').defaultNow().notNull(),
  created_by: uuid('created_by').references(() => users.id).notNull(),
});
