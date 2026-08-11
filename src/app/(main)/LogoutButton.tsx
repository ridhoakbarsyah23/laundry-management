'use client'

import { useState } from 'react'
import { LogOut, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { logout } from '@/app/login/actions'

export function LogoutButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 bg-rose-50/50 hover:bg-rose-100/80 rounded-xl transition-all duration-200 shadow-sm border border-rose-100/50 group"
      >
        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Sign Out
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-[2rem] p-0 overflow-hidden gap-0">
        <div className="bg-gradient-to-b from-rose-50/80 to-transparent pt-10 pb-6 px-8 flex flex-col items-center text-center">
          <div className="p-4 rounded-full bg-white shadow-xl shadow-rose-200/50 text-rose-600 mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-rose-400/20 animate-ping"></div>
            <LogOut className="w-8 h-8 relative z-10" />
          </div>
          <DialogTitle className="text-2xl font-extrabold text-slate-800 mb-2">Ready to Leave?</DialogTitle>
          <DialogDescription className="text-base text-slate-500 leading-relaxed">
            You are about to sign out of your account. You will need to log in again to manage your laundry business.
          </DialogDescription>
        </div>
        
        <DialogFooter className="px-8 pb-8 flex flex-col sm:flex-col gap-3 sm:space-x-0 mt-2">
          <form action={logout} className="w-full">
            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-base font-semibold rounded-xl shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02]">
              Yes, Sign Out
            </Button>
          </form>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="w-full h-12 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-base font-medium transition-colors">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
