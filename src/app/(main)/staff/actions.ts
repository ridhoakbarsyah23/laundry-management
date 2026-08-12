'use server'

import { db } from '@/db'
import { users, orders } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { requireOwner } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getStaff() {
  await requireOwner()

  // We want to fetch all users and the count of orders they have processed
  // using a left join and group by
  
  const staffWithOrders = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      created_at: users.created_at,
      orders_processed: sql<number>`count(${orders.id})`.mapWith(Number)
    })
    .from(users)
    .leftJoin(orders, eq(orders.created_by, users.id))
    .groupBy(users.id)
    .orderBy(users.name)

  return staffWithOrders
}

export async function updateStaffRole(userId: string, newRole: 'owner' | 'staff') {
  const { dbUser } = await requireOwner()
  
  if (dbUser.id === userId) {
    throw new Error('You cannot change your own role.')
  }

  await db
    .update(users)
    .set({ role: newRole })
    .where(eq(users.id, userId))

  revalidatePath('/staff')
}
