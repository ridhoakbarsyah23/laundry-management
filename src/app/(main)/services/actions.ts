'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { services } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function getServices() {
  return await db.select().from(services).orderBy(desc(services.created_at))
}

export async function createService(formData: FormData) {
  const name = formData.get('name') as string
  const price = parseInt(formData.get('price') as string, 10)
  const unit = formData.get('unit') as string

  if (!name || isNaN(price)) {
    return { error: 'Name and valid price are required' }
  }

  await db.insert(services).values({
    name,
    price,
    unit,
  })

  revalidatePath('/services')
  return { success: true }
}

export async function toggleServiceStatus(id: string, currentStatus: boolean) {
  await db.update(services).set({ status: !currentStatus }).where(eq(services.id, id))
  revalidatePath('/services')
  return { success: true }
}
