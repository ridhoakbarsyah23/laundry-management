'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { orders, orderItems, payments, customers, services, users } from '@/db/schema'
import { eq, desc, and, gte, lt, count } from 'drizzle-orm'
import { createClient } from '@/utils/supabase/server'

export async function getOrders() {
  const allOrders = await db
    .select({
      id: orders.id,
      order_number: orders.order_number,
      total: orders.total,
      laundry_status: orders.laundry_status,
      payment_status: orders.payment_status,
      created_at: orders.created_at,
      customer_name: customers.name,
      customer_phone: customers.phone,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customer_id, customers.id))
    .orderBy(desc(orders.created_at))

  return allOrders
}

export async function getOrderById(orderId: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    
  if (!order) return null

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, order.customer_id))

  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      price: orderItems.price,
      subtotal: orderItems.subtotal,
      service_name: services.name,
      service_unit: services.unit,
    })
    .from(orderItems)
    .leftJoin(services, eq(orderItems.service_id, services.id))
    .where(eq(orderItems.order_id, orderId))

  return {
    ...order,
    customer,
    items,
  }
}

export async function updateLaundryStatus(orderId: string, newStatus: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await db.update(orders)
    .set({ laundry_status: newStatus })
    .where(eq(orders.id, orderId))

  revalidatePath('/orders')
  revalidatePath('/dashboard')
}

export async function createOrder(data: {
  customer_id?: string
  new_customer_name?: string
  new_customer_phone?: string
  service_id: string
  quantity: number
  notes: string
  payment_method?: string // if provided, it's paid
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Fetch the actual user from public.users
  const [dbUser] = await db.select().from(users).where(eq(users.auth_id, user.id))
  if (!dbUser) throw new Error('User not synced in database. Please log out and log in again.')

  // Fetch service to get price
  const [service] = await db.select().from(services).where(eq(services.id, data.service_id))
  if (!service) throw new Error('Service not found')

  const subtotal = service.price * data.quantity
  const total = subtotal // MVP: no discount logic yet
  
  // Generate order number: ORD-DDMMYY-XXX
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay)
  endOfDay.setDate(startOfDay.getDate() + 1)

  const [countResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(and(gte(orders.created_at, startOfDay), lt(orders.created_at, endOfDay)))

  const seq = (countResult.count + 1).toString().padStart(3, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  const order_number = `ORD-${dd}-${mm}-${yyyy}-${seq}`

  // Use a transaction
  await db.transaction(async (tx) => {
    let customerId = data.customer_id
    
    // Create new customer if requested
    if (!customerId && data.new_customer_name && data.new_customer_phone) {
      const [newCustomer] = await tx.insert(customers).values({
        name: data.new_customer_name,
        phone: data.new_customer_phone,
      }).returning()
      customerId = newCustomer.id
    }
    
    if (!customerId) throw new Error('Customer is required')

    // 1. Create order
    const [newOrder] = await tx.insert(orders).values({
      order_number,
      customer_id: customerId,
      subtotal,
      total,
      notes: data.notes,
      payment_status: data.payment_method ? 'paid' : 'unpaid',
      payment_method: data.payment_method || null,
      created_by: dbUser.id,
    }).returning()

    // 2. Create order item
    await tx.insert(orderItems).values({
      order_id: newOrder.id,
      service_id: data.service_id,
      quantity: data.quantity.toString(),
      price: service.price,
      subtotal,
    })

    // 3. Create payment if paid
    if (data.payment_method) {
      await tx.insert(payments).values({
        order_id: newOrder.id,
        amount: total,
        method: data.payment_method,
        created_by: dbUser.id,
      })
    }
  })

  revalidatePath('/orders')
  revalidatePath('/dashboard')
  redirect('/orders')
}
