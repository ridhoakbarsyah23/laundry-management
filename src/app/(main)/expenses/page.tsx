export const dynamic = 'force-dynamic'

import { getExpenses } from './actions'
import { ExpenseForm } from './ExpenseForm'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function ExpensesPage() {
  const expenses = await getExpenses()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">Expenses</h1>
        <p className="text-slate-500 mt-2 text-lg">Track your daily laundry expenses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 border border-slate-200/60 rounded-2xl p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-500/5 h-fit">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">New Expense</h2>
          <ExpenseForm />
        </div>

        <div className="col-span-1 md:col-span-2 border border-slate-200/60 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-500/5 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b-slate-200/60">
                <TableHead className="text-slate-600 font-semibold">Date</TableHead>
                <TableHead className="text-slate-600 font-semibold">Category</TableHead>
                <TableHead className="text-slate-600 font-semibold">Description</TableHead>
                <TableHead className="text-slate-600 font-semibold">Amount</TableHead>
                <TableHead className="text-slate-600 font-semibold">By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{e.category}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {e.description || '-'}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(e.amount)}
                  </TableCell>
                  <TableCell>{e.created_by_name || 'System'}</TableCell>
                </TableRow>
              ))}
              {expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No expenses recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
