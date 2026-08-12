'use server'

import { db } from '@/db'
import { orders, expenses } from '@/db/schema'
import { eq, and, gte, lte, sum } from 'drizzle-orm'
import { requireOwner } from '@/lib/auth'

export async function getFinancialReports(startDate: Date, endDate: Date) {
  await requireOwner()

  // 1. Get Revenue (Paid Orders)
  const allOrders = await db.select().from(orders).where(
    and(
      gte(orders.created_at, startDate),
      lte(orders.created_at, endDate)
    )
  )

  const paidOrders = allOrders.filter(o => o.payment_status === 'paid')
  const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.total, 0)
  
  // 2. Get Expenses
  const allExpenses = await db.select().from(expenses).where(
    and(
      gte(expenses.date, startDate),
      lte(expenses.date, endDate)
    )
  )

  const totalExpenses = allExpenses.reduce((acc, curr) => acc + curr.amount, 0)

  // 3. Calculate Net Profit
  const netProfit = totalRevenue - totalExpenses

  // 4. Generate daily chart data for Recharts
  const chartDataMap = new Map<string, { date: string; revenue: number; expenses: number }>()
  
  // Initialize all dates in range with 0
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    chartDataMap.set(dateStr, { date: dateStr, revenue: 0, expenses: 0 })
  }

  // Populate revenue
  paidOrders.forEach(o => {
    const dateStr = o.created_at.toISOString().split('T')[0]
    if (chartDataMap.has(dateStr)) {
      chartDataMap.get(dateStr)!.revenue += o.total
    }
  })

  // Populate expenses
  allExpenses.forEach(e => {
    const dateStr = e.date.toISOString().split('T')[0]
    if (chartDataMap.has(dateStr)) {
      chartDataMap.get(dateStr)!.expenses += e.amount
    }
  })

  return {
    summary: {
      totalRevenue,
      totalExpenses,
      netProfit,
      ordersCount: paidOrders.length
    },
    chartData: Array.from(chartDataMap.values())
  }
}
