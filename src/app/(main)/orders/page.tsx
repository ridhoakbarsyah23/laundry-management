export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getOrders } from './actions'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusUpdater } from './StatusUpdater'
import { 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Hash, 
  User, 
  CalendarDays, 
  Banknote, 
  Activity, 
  CreditCard,
  Inbox,
  Printer,
  MessageCircle
} from 'lucide-react'

function getWhatsAppLink(order: any) {
  if (!order.customer_phone) return null
  let phone = order.customer_phone.replace(/\D/g, '')
  if (phone.startsWith('0')) {
    phone = '62' + phone.substring(1)
  }
  const formatCurrency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(order.total)
  
  const msg = `Halo ${order.customer_name || 'Kak'},\n\nTerima kasih telah mempercayakan cucian Anda di *LaundryHub*! 💧\n\nBerikut adalah rincian pesanan Anda:\n*Nomor Order:* ${order.order_number}\n*Total Tagihan:* ${formatCurrency}\n\nPesanan Anda sedang kami proses. Silakan simpan pesan ini sebagai bukti digital ya.\n\nTerima kasih! 🙏`
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">Orders</h1>
          </div>
          <p className="text-slate-500 mt-2 text-lg">Manage your laundry transactions and progress.</p>
        </div>
        <Link href="/orders/create">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 rounded-full px-6 h-11 transition-all hover:scale-105 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            <span className="font-semibold">Create New Order</span>
          </Button>
        </Link>
      </div>

      <div className="border border-slate-200/60 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-500/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-blue-50/50">
            <TableRow className="hover:bg-transparent border-b-slate-200/60">
              <TableHead className="text-blue-800 font-semibold h-14 pl-6">
                <div className="flex items-center gap-1.5"><Hash className="w-4 h-4" /> Order Number</div>
              </TableHead>
              <TableHead className="text-blue-800 font-semibold h-12">
                <div className="flex items-center gap-1.5"><User className="w-4 h-4" /> Customer</div>
              </TableHead>
              <TableHead className="text-blue-800 font-semibold h-12">
                <div className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Date</div>
              </TableHead>
              <TableHead className="text-blue-800 font-semibold h-12">
                <div className="flex items-center gap-1.5"><Banknote className="w-4 h-4" /> Total</div>
              </TableHead>
              <TableHead className="text-blue-800 font-semibold h-12">
                <div className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> Status</div>
              </TableHead>
              <TableHead className="text-blue-800 font-semibold h-12 text-right pr-6">
                <div className="flex items-center justify-end gap-1.5"><CreditCard className="w-4 h-4" /> Payment</div>
              </TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-semibold text-slate-700 pl-6 py-4">{o.order_number}</TableCell>
                <TableCell className="font-medium py-4">{o.customer_name || 'Unknown'}</TableCell>
                <TableCell className="text-slate-500 py-4">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="font-semibold text-slate-800 py-4">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(o.total)}
                </TableCell>
                <TableCell className="py-4">
                  <StatusUpdater orderId={o.id} currentStatus={o.laundry_status} />
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    o.payment_status === 'paid' 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {o.payment_status === 'paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {o.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                  </div>
                </TableCell>
                <TableCell className="text-right py-4 pr-6">
                  <div className="flex items-center justify-end gap-1">
                    {(() => {
                      const waLink = getWhatsAppLink(o);
                      return waLink ? (
                        <Link 
                          href={waLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Kirim Struk via WhatsApp"
                          className={`${buttonVariants({ variant: 'ghost', size: 'icon' })} h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors rounded-lg`}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Link>
                      ) : null;
                    })()}
                    <Link 
                      href={`/receipt/${o.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="Cetak Struk"
                      className={`${buttonVariants({ variant: 'ghost', size: 'icon' })} h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg`}
                    >
                      <Printer className="w-4 h-4" />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Inbox className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-lg font-medium text-slate-900 mb-1">No orders yet</p>
                    <p className="text-sm">When you create new orders, they will appear here.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
