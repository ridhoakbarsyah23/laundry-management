import { NextResponse } from 'next/server'
import { db } from '@/db'
import { expenses, users } from '@/db/schema'
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

  const allExpenses = await db
    .select({
      description: expenses.description,
      amount: expenses.amount,
      category: expenses.category,
      created_at: expenses.date,
      created_by_name: users.name,
    })
    .from(expenses)
    .leftJoin(users, eq(expenses.created_by, users.id))
    .where(and(gte(expenses.date, startDate), lt(expenses.date, endDate)))
    .orderBy(desc(expenses.date))

  const headers = [
    'Tanggal',
    'Kategori',
    'Keterangan',
    'Nominal',
    'Dicatat Oleh',
  ]

  const csvRows = [headers.join(';')]

  allExpenses.forEach(e => {
    const date = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(e.created_at)
    
    // Escape quotes and wrap in quotes for CSV
    const escapeCsv = (val: string | null | undefined) => `"${(val || '').toString().replace(/"/g, '""')}"`

    const row = [
      escapeCsv(date),
      escapeCsv(e.category),
      escapeCsv(e.description),
      e.amount,
      escapeCsv(e.created_by_name),
    ]
    csvRows.push(row.join(';'))
  })

  const csvContent = csvRows.join('\n')

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="Laporan_Pengeluaran_${monthName}_${year}.csv"`,
    },
  })
}
