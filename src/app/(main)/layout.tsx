import Link from 'next/link'
import { ReactNode } from 'react'
import { LayoutDashboard, ShoppingCart, Users, Briefcase, Receipt, Droplets, PieChart, UsersRound } from 'lucide-react'
import { LogoutButton } from './LogoutButton'
import { Sidebar } from '@/components/Sidebar'
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

      <Sidebar isOwner={isOwner} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 md:p-12 z-10 h-screen overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

