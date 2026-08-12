'use server'

import { db } from '@/db'
import { inventory, inventoryLogs } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireOwner, requireUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getInventory() {
  await requireUser()
  return await db.select().from(inventory).orderBy(inventory.item_name)
}

export async function createInventoryItem(data: {
  item_name: string
  stock: number
  unit: string
  min_stock: number
}) {
  const { dbUser } = await requireOwner()
  
  const [newItem] = await db.insert(inventory).values({
    item_name: data.item_name,
    stock: data.stock.toString(),
    unit: data.unit,
    min_stock: data.min_stock.toString(),
  }).returning()

  if (data.stock > 0) {
    await db.insert(inventoryLogs).values({
      inventory_id: newItem.id,
      type: 'in',
      amount: data.stock.toString(),
      notes: 'Stok awal',
      created_by: dbUser.id,
    })
  }

  revalidatePath('/inventory')
  return newItem
}

export async function updateInventoryItem(id: string, data: {
  item_name: string
  unit: string
  min_stock: number
}) {
  await requireOwner()
  
  const [updated] = await db.update(inventory)
    .set({
      item_name: data.item_name,
      unit: data.unit,
      min_stock: data.min_stock.toString(),
      updated_at: new Date(),
    })
    .where(eq(inventory.id, id))
    .returning()

  revalidatePath('/inventory')
  return updated
}

export async function deleteInventoryItem(id: string) {
  await requireOwner()

  // First delete the logs associated with this inventory item to prevent foreign key errors
  await db.delete(inventoryLogs).where(eq(inventoryLogs.inventory_id, id))

  // Then delete the inventory item itself
  await db.delete(inventory).where(eq(inventory.id, id))

  revalidatePath('/inventory')
}

export async function logInventoryUsage(data: {
  inventory_id: string
  type: 'in' | 'out'
  amount: number
  notes?: string
}) {
  const { dbUser } = await requireOwner()

  // Get current stock
  const [item] = await db.select().from(inventory).where(eq(inventory.id, data.inventory_id))
  if (!item) throw new Error('Item tidak ditemukan')

  const currentStock = parseFloat(item.stock)
  const amountToLog = data.amount
  
  if (data.type === 'out' && currentStock < amountToLog) {
    throw new Error('Stok tidak mencukupi untuk pemakaian ini')
  }

  const newStock = data.type === 'in' ? currentStock + amountToLog : currentStock - amountToLog

  // Log it
  await db.insert(inventoryLogs).values({
    inventory_id: data.inventory_id,
    type: data.type,
    amount: amountToLog.toString(),
    notes: data.notes || (data.type === 'in' ? 'Stok masuk manual' : 'Pemakaian manual'),
    created_by: dbUser.id,
  })

  // Update stock
  await db.update(inventory)
    .set({ 
      stock: newStock.toString(),
      updated_at: new Date()
    })
    .where(eq(inventory.id, data.inventory_id))

  revalidatePath('/inventory')
}

export async function getInventoryLogs(inventoryId: string) {
  await requireOwner()
  return await db.select()
    .from(inventoryLogs)
    .where(eq(inventoryLogs.inventory_id, inventoryId))
    .orderBy(desc(inventoryLogs.created_at))
    .limit(50)
}
