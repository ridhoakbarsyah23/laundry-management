import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { CheckCircle2, CircleDollarSign, Loader2, TrendingUp } from 'lucide-react'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq, gte, and, inArray } from 'drizzle-orm'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Calculate "Today" boundary
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  // 1. Total Transactions Today
  const todayOrders = await db
    .select()
    .from(orders)
    .where(gte(orders.created_at, startOfToday))

  const totalTransactions = todayOrders.length
  
  // 2. Revenue Today
  const revenueToday = todayOrders.reduce((sum, order) => sum + order.total, 0)

  // 3. In Process (All time)
  const inProcessOrders = await db
    .select()
    .from(orders)
    .where(inArray(orders.laundry_status, ['diterima', 'dicuci', 'dikeringkan', 'disetrika']))
  const inProcessCount = inProcessOrders.length

  // 4. Ready for Pickup (All time)
  const readyOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.laundry_status, 'siap diambil'))
  const readyCount = readyOrders.length

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2 text-lg">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! Here's an overview of your laundry business today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <Card className="border-0 shadow-lg shadow-blue-500/10 bg-white/80 backdrop-blur hover:-translate-y-1 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Total Transactions</CardTitle>
            <div className="p-2 bg-blue-100/50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{totalTransactions}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Today's orders</p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-0 shadow-lg shadow-emerald-500/10 bg-white/80 backdrop-blur hover:-translate-y-1 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Revenue</CardTitle>
            <div className="p-2 bg-emerald-100/50 rounded-lg">
              <CircleDollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
              }).format(revenueToday)}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Today's earnings</p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-0 shadow-lg shadow-amber-500/10 bg-white/80 backdrop-blur hover:-translate-y-1 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">In Process</CardTitle>
            <div className="p-2 bg-amber-100/50 rounded-lg">
              <Loader2 className="w-4 h-4 text-amber-600 animate-spin-slow" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{inProcessCount}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Currently washing</p>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border-0 shadow-lg shadow-purple-500/10 bg-white/80 backdrop-blur hover:-translate-y-1 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Ready for Pickup</CardTitle>
            <div className="p-2 bg-purple-100/50 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{readyCount}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Awaiting customer</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
