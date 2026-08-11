import { getOrderById } from '@/app/(main)/orders/actions'
import { notFound } from 'next/navigation'
import ReceiptActions from './ReceiptActions'

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrderById(id)
  
  if (!order) {
    notFound()
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-mono text-slate-800">
      
      {/* Floating Action Buttons for manual print and WhatsApp (hidden when printing) */}
      <ReceiptActions 
        phone={order.customer?.phone || undefined}
        customerName={order.customer?.name}
        orderNumber={order.order_number}
        total={order.total}
      />

      {/* Receipt Paper */}
      <div className="bg-white p-6 shadow-2xl w-full max-w-[320px] rounded-sm print:shadow-none print:p-0 print:m-0 print:w-[80mm] print:max-w-[80mm]">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold uppercase mb-1">LaundryHub</h1>
          <p className="text-xs text-slate-500">Jl. Contoh Alamat No. 123, Jakarta</p>
          <p className="text-xs text-slate-500">Tel: 0812-3456-7890</p>
        </div>

        <div className="border-t-2 border-dashed border-slate-300 my-4"></div>

        {/* Order Info */}
        <div className="text-xs space-y-1 mb-4">
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{formatDate(new Date(order.created_at))}</span>
          </div>
          <div className="flex justify-between">
            <span>Order:</span>
            <span className="font-bold">{order.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span className="font-bold">{order.customer?.name || 'Unknown'}</span>
          </div>
          {order.customer?.phone && (
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{order.customer.phone}</span>
            </div>
          )}
        </div>

        <div className="border-t-2 border-dashed border-slate-300 my-4"></div>

        {/* Items */}
        <div className="text-xs mb-4">
          <div className="flex justify-between font-bold mb-2">
            <span>Item</span>
            <span>Total</span>
          </div>
          {order.items.map((item) => (
            <div key={item.id} className="mb-2">
              <div className="font-semibold">{item.service_name}</div>
              <div className="flex justify-between text-slate-500">
                <span>{item.quantity} {item.service_unit} x {formatCurrency(item.price)}</span>
                <span className="text-slate-800">{formatCurrency(item.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-dashed border-slate-300 my-4"></div>

        {/* Totals */}
        <div className="text-xs space-y-2 mb-6">
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Status:</span>
            <span className="uppercase">{order.payment_status}</span>
          </div>
          {order.payment_method && (
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="uppercase">{order.payment_method}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="text-xs mb-6 p-2 bg-slate-50 border border-slate-200 rounded print:border-none print:p-0 print:bg-transparent">
            <strong>Notes:</strong> {order.notes}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs font-bold mb-1">Terima Kasih!</p>
          <p className="text-[10px] text-slate-500">Barang yang tidak diambil dalam 30 hari bukan tanggung jawab kami.</p>
        </div>
      </div>

    </div>
  )
}
