'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface ChartData {
  date: string
  revenue: number
  expenses: number
}

export function ReportChart({ data }: { data: ChartData[] }) {
  const formatCurrency = (value: number) => {
    if (value === 0) return '0'
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}K`
    return `Rp ${value}`
  }

  return (
    <div className="h-[400px] w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => {
              const d = new Date(val)
              return `${d.getDate()}/${d.getMonth()+1}`
            }}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            formatter={(value: any) => [
              new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value) || 0),
              ''
            ]}
            labelFormatter={(label: any) => {
              if (!label) return ''
              return new Date(String(label)).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line 
            type="monotone" 
            name="Pendapatan"
            dataKey="revenue" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            name="Pengeluaran"
            dataKey="expenses" 
            stroke="#f43f5e" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
