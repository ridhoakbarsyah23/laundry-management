import { NextResponse } from 'next/server'
import { db } from '@/db'
import { orders, customers } from '@/db/schema'
import { eq, and, gte, lt, desc } from 'drizzle-orm'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString())
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  const monthName = monthNames[month - 1] || month

  const allOrders = await db
    .select({
      order_number: orders.order_number,
      customer_name: customers.name,
      customer_phone: customers.phone,
      subtotal: orders.subtotal,
      discount: orders.discount,
      total: orders.total,
      payment_status: orders.payment_status,
      payment_method: orders.payment_method,
      laundry_status: orders.laundry_status,
      created_at: orders.created_at,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customer_id, customers.id))
    .where(and(gte(orders.created_at, startDate), lt(orders.created_at, endDate)))
    .orderBy(desc(orders.created_at))

  const headers = [
    'Tanggal',
    'No. Pesanan',
    'Nama Pelanggan',
    'No. HP',
    'Status Cucian',
    'Status Pembayaran',
    'Metode Bayar',
    'Subtotal',
    'Diskon',
    'Total',
  ]

  const csvRows = [headers.join(';')]

  allOrders.forEach(o => {
    const date = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(o.created_at)
    
    // Escape quotes and wrap in quotes for CSV
    const escapeCsv = (val: string | null | undefined) => `"${(val || '').toString().replace(/"/g, '""')}"`

    const row = [
      escapeCsv(date),
      escapeCsv(o.order_number),
      escapeCsv(o.customer_name),
      escapeCsv(o.customer_phone),
      escapeCsv(o.laundry_status),
      escapeCsv(o.payment_status),
      escapeCsv(o.payment_method),
      o.subtotal,
      o.discount,
      o.total,
    ]
    csvRows.push(row.join(';'))
  })

  const csvContent = csvRows.join('\n')

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="Laporan_Pesanan_${monthName}_${year}.csv"`,
    },
  })
}
