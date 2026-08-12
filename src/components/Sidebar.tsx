'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingCart, Users, Briefcase, Receipt, Droplets, PieChart, UsersRound, Menu, X, Package } from 'lucide-react'
import { LogoutButton } from '@/app/(main)/LogoutButton'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  isOwner: boolean
}

export function Sidebar({ isOwner }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const closeSidebar = () => setIsOpen(false)

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, ownerOnly: true },
    { name: 'Pesanan', href: '/orders', icon: ShoppingCart },
    { name: 'Pelanggan', href: '/customers', icon: Users },
    { name: 'Layanan', href: '/services', icon: Briefcase, ownerOnly: true },
    { name: 'Pengeluaran', href: '/expenses', icon: Receipt, ownerOnly: true },
  ]

  const ownerLinks = [
    { name: 'Inventaris', href: '/inventory', icon: Package },
    { name: 'Laporan Keuangan', href: '/reports', icon: PieChart },
    { name: 'Karyawan', href: '/staff', icon: UsersRound },
  ]

  const renderLinks = (items: typeof links) => {
    return items.map(link => {
      if (link.ownerOnly && !isOwner) return null
      const Icon = link.icon
      const isActive = pathname.startsWith(link.href)
      
      return (
        <Link
          key={link.href}
          href={link.href}
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
            isActive 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
          {link.name}
        </Link>
      )
    })
  }

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            Laundry<span className="text-blue-600">Hub</span>
          </h2>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white/90 md:bg-white/70 backdrop-blur-xl border-r border-slate-200/50 
        shadow-[4px_0_24px_rgba(0,0,0,0.05)] md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 md:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Laundry<span className="text-blue-600">Hub</span>
            </h2>
          </div>
          <button onClick={closeSidebar} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-2 overflow-y-auto">
          {renderLinks(links)}
          
          {isOwner && (
            <div className="pt-4 mt-4 border-t border-slate-200/50">
              <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu Pemilik</p>
              {renderLinks(ownerLinks)}
            </div>
          )}
        </nav>
        
        <div className="p-4 mt-auto border-t border-slate-100">
          <LogoutButton />
        </div>
      </aside>
    </>
  )
}
