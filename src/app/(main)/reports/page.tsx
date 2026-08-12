export const dynamic = 'force-dynamic'

import { getFinancialReports } from './actions'
import { ReportChart } from './ReportChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDownRight, ArrowUpRight, Wallet, Receipt, TrendingUp } from 'lucide-react'

export default async function ReportsPage({
  searchParams
}: {
  searchParams: Promise<{ days?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const days = parseInt(resolvedSearchParams.days || '30')
  
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const { summary, chartData } = await getFinancialReports(startDate, endDate)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">Laporan Keuangan</h1>
          </div>
          <p className="text-slate-500 mt-2 text-lg">Analisis performa bisnis Anda dari waktu ke waktu.</p>
        </div>
        
        {/* Simple Date Filter (can be expanded later) */}
        <div className="flex bg-white/80 backdrop-blur-md rounded-xl p-1 shadow-sm border border-slate-200/50">
          {[7, 30, 90].map((d) => (
            <a 
              key={d}
              href={`/reports?days=${d}`}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${days === d ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {d} Hari
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Revenue */}
        <Card className="border-0 shadow-lg shadow-emerald-500/10 bg-white/80 backdrop-blur hover:-translate-y-1 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Total Pendapatan</CardTitle>
            <div className="p-2 bg-emerald-100/50 rounded-lg">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{formatCurrency(summary.totalRevenue)}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Dari {summary.ordersCount} pesanan lunas</p>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="border-0 shadow-lg shadow-rose-500/10 bg-white/80 backdrop-blur hover:-translate-y-1 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Total Pengeluaran</CardTitle>
            <div className="p-2 bg-rose-100/50 rounded-lg">
              <Receipt className="w-4 h-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{formatCurrency(summary.totalExpenses)}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Biaya operasional</p>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card className={`border-0 shadow-lg bg-white/80 backdrop-blur hover:-translate-y-1 transition-transform duration-300 ${summary.netProfit >= 0 ? 'shadow-blue-500/10' : 'shadow-red-500/10'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Laba Bersih</CardTitle>
            <div className={`p-2 rounded-lg ${summary.netProfit >= 0 ? 'bg-blue-100/50' : 'bg-red-100/50'}`}>
              {summary.netProfit >= 0 ? <Wallet className="w-4 h-4 text-blue-600" /> : <ArrowDownRight className="w-4 h-4 text-red-600" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${summary.netProfit >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
              {formatCurrency(summary.netProfit)}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Pendapatan - Pengeluaran</p>
          </CardContent>
        </Card>
      </div>

      <div className="border border-slate-200/60 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-500/5 p-6">
        <h2 className="text-xl font-semibold mb-6 text-slate-800">Tren Arus Kas</h2>
        <ReportChart data={chartData} />
      </div>
    </div>
  )
}
