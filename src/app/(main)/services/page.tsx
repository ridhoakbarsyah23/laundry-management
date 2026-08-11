export const dynamic = 'force-dynamic'

import { getServices } from './actions'
import { ServiceForm } from './ServiceForm'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">Services</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your laundry services and prices.</p>
        </div>
        <ServiceForm />
      </div>

      <div className="border border-slate-200/60 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-500/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b-slate-200/60">
              <TableHead className="text-slate-600 font-semibold">Service Name</TableHead>
              <TableHead className="text-slate-600 font-semibold">Price</TableHead>
              <TableHead className="text-slate-600 font-semibold">Unit</TableHead>
              <TableHead className="text-slate-600 font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(s.price)}
                </TableCell>
                <TableCell className="capitalize">{s.unit}</TableCell>
                <TableCell>
                  <Badge variant={s.status ? 'default' : 'secondary'}>
                    {s.status ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  No services found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
