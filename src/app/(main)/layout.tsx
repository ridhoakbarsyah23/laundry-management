import Link from 'next/link'
import { ReactNode } from 'react'
import { LayoutDashboard, ShoppingCart, Users, Briefcase, Receipt, Droplets, PieChart, UsersRound } from 'lucide-react'
import { LogoutButton } from './LogoutButton'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  const [dbUser] = await db.select().from(users).where(eq(users.auth_id, user.id))
  
  if (!dbUser) {
    redirect('/login')
  }

  const isOwner = dbUser.role === 'owner'

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col md:flex-row text-slate-800">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Sidebar with Glassmorphism */}
      <aside className="w-full md:w-72 bg-white/70 backdrop-blur-xl border-r border-slate-200/50 min-h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 flex flex-col transition-all duration-300">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Laundry<span className="text-blue-600">Hub</span>
            </h2>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {isOwner && (
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all duration-200 group"
            >
              <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              Dashboard
            </Link>
          )}

          <Link
            href="/orders"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all duration-200 group"
          >
            <ShoppingCart className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            Pesanan
          </Link>
          
          <Link
            href="/customers"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all duration-200 group"
          >
            <Users className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            Pelanggan
          </Link>

          {isOwner && (
            <>
              <Link
                href="/services"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all duration-200 group"
              >
                <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                Layanan
              </Link>
              
              <Link
                href="/expenses"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all duration-200 group"
              >
                <Receipt className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                Pengeluaran
              </Link>
              
              <div className="pt-4 mt-4 border-t border-slate-200/50">
                <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu Pemilik</p>
                <Link
                  href="/reports"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all duration-200 group"
                >
                  <PieChart className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  Laporan Keuangan
                </Link>
                <Link
                  href="/staff"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all duration-200 group"
                >
                  <UsersRound className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  Karyawan
                </Link>
              </div>
            </>
          )}
        </nav>
        
        {/* Logout Form */}
        <div className="p-4 mt-auto border-t border-slate-100">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 z-10 h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

