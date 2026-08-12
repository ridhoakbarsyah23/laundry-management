'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { customers } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function getCustomers() {
  return await db.select().from(customers).orderBy(desc(customers.created_at))
}

export async function createCustomer(formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  if (!name || !phone) {
    return { error: 'Name and phone are required' }
  }

  await db.insert(customers).values({
    name,
    phone,
    address,
  })

  revalidatePath('/customers')
  return { success: true }
}

export async function updateCustomer(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  if (!name || !phone) {
    return { error: 'Name and phone are required' }
  }

  await db.update(customers).set({
    name,
    phone,
    address,
  }).where(eq(customers.id, id))

  revalidatePath('/customers')
  return { success: true }
}

export async function deleteCustomer(id: string) {
  await db.delete(customers).where(eq(customers.id, id))
  revalidatePath('/customers')
  return { success: true }
}
