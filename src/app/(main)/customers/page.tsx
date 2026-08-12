export const dynamic = 'force-dynamic'

import { getCustomers } from './actions'
import { CustomerForm } from './CustomerForm'
import { CustomerActions } from './CustomerActions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">Pelanggan</h1>
          <p className="text-slate-500 mt-2 text-lg">Kelola data pelanggan laundry Anda.</p>
        </div>
        <CustomerForm />
      </div>

      <div className="border border-slate-200/60 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-500/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b-slate-200/60">
              <TableHead className="text-slate-600 font-semibold">Nama</TableHead>
              <TableHead className="text-slate-600 font-semibold">Nomor HP</TableHead>
              <TableHead className="text-slate-600 font-semibold">Alamat</TableHead>
              <TableHead className="text-slate-600 font-semibold">Terdaftar pada</TableHead>
              <TableHead className="text-right text-slate-600 font-semibold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.address || '-'}</TableCell>
                <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <CustomerActions customer={c} />
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  Belum ada pelanggan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
