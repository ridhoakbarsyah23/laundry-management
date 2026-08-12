export const dynamic = 'force-dynamic'

import { getStaff } from './actions'
import { RoleSelect } from './RoleSelect'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UsersRound, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { requireOwner } from '@/lib/auth'

export default async function StaffPage() {
  const { dbUser: currentUser } = await requireOwner()
  const staffMembers = await getStaff()

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-100 rounded-xl">
            <UsersRound className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">Manajemen Karyawan</h1>
        </div>
        <p className="text-slate-500 mt-2 text-lg">Kelola peran karyawan dan lacak performa mereka.</p>
      </div>

      <div className="border border-slate-200/60 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-500/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-blue-50/50">
            <TableRow className="hover:bg-transparent border-b-slate-200/60">
              <TableHead className="text-blue-800 font-semibold h-14 pl-6">Nama</TableHead>
              <TableHead className="text-blue-800 font-semibold h-12">Email</TableHead>
              <TableHead className="text-blue-800 font-semibold h-12">Peran</TableHead>
              <TableHead className="text-blue-800 font-semibold h-12 text-center">Pesanan Diproses</TableHead>
              <TableHead className="text-blue-800 font-semibold h-12">Bergabung</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers.map((member) => (
              <TableRow key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-semibold text-slate-700 pl-6 py-4">{member.name}</TableCell>
                <TableCell className="text-slate-500 py-4">{member.email}</TableCell>
                <TableCell className="py-4">
                  <RoleSelect 
                    userId={member.id} 
                    currentRole={member.role as 'owner' | 'staff'} 
                    isCurrentUser={currentUser.id === member.id}
                  />
                </TableCell>
                <TableCell className="text-center py-4">
                  <div className="inline-flex items-center justify-center min-w-[2.5rem] h-8 px-2 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-100">
                    {member.orders_processed}
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 py-4">
                  {new Date(member.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {staffMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <p>Belum ada karyawan.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 shadow-sm">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div className="text-sm">
          <p className="font-semibold mb-1">Tentang Peran Karyawan</p>
          <p>
            <strong>Owner</strong> memiliki akses penuh untuk melihat laporan keuangan, pengeluaran, dan mengelola karyawan lain. 
            <strong> Staf</strong> hanya dapat mengakses halaman Pesanan dan Pelanggan untuk operasional harian.
          </p>
        </div>
      </div>
    </div>
  )
}
