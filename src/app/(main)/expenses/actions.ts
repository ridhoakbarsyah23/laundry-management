'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { expenses, users } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { createClient } from '@/utils/supabase/server'

export async function getExpenses() {
  const allExpenses = await db
    .select({
      id: expenses.id,
      category: expenses.category,
      amount: expenses.amount,
      description: expenses.description,
      date: expenses.date,
      created_by_name: users.name,
    })
    .from(expenses)
    .leftJoin(users, eq(expenses.created_by, users.id))
    .orderBy(desc(expenses.date))

  return allExpenses
}

export async function createExpense(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const [dbUser] = await db.select().from(users).where(eq(users.auth_id, user.id))
  if (!dbUser) throw new Error('User not synced in database.')

  const category = formData.get('category') as string
  const amount = parseInt(formData.get('amount') as string, 10)
  const description = formData.get('description') as string

  await db.insert(expenses).values({
    category,
    amount,
    description: description || null,
    created_by: dbUser.id,
  })

  revalidatePath('/expenses')
}
export async function updateExpense(id: string, formData: FormData) {
  const category = formData.get('category') as string
  const amount = parseInt(formData.get('amount') as string, 10)
  const description = formData.get('description') as string

  if (!category || isNaN(amount)) {
    return { error: 'Category and valid amount are required' }
  }

  await db.update(expenses).set({
    category,
    amount,
    description: description || null,
  }).where(eq(expenses.id, id))

  revalidatePath('/expenses')
  return { success: true }
}

export async function deleteExpense(id: string) {
  await db.delete(expenses).where(eq(expenses.id, id))
  revalidatePath('/expenses')
  return { success: true }
}
