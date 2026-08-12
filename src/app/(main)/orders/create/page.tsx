export const dynamic = 'force-dynamic'

import { getCustomers } from '@/app/(main)/customers/actions'
import { getServices } from '@/app/(main)/services/actions'
import { OrderForm } from './OrderForm'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShoppingBag } from 'lucide-react'

export default async function CreateOrderPage() {
  const customers = await getCustomers()
  const services = await getServices()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <Link href="/orders">
          <Button variant="ghost" className="w-fit text-slate-500 hover:text-blue-600 hover:bg-blue-50 pl-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Pesanan
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">Kasir (Point of Sale)</h1>
            <p className="text-slate-500 mt-1 text-lg">Buat transaksi cucian baru.</p>
          </div>
        </div>
      </div>

      <OrderForm
        customers={customers.map(c => ({ id: c.id, name: c.name }))}
        services={services.filter(s => s.status).map(s => ({ id: s.id, name: s.name, price: s.price, unit: s.unit }))}
      />
    </div>
  )
}
