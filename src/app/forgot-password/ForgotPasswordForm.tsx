'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { forgotPassword } from './actions'

export function ForgotPasswordForm({ error, success }: { error?: string, success?: string }) {
  const [loading, setLoading] = useState(false)

  return (
    <form action={forgotPassword} className="space-y-5" onSubmit={() => setLoading(true)}>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-600 font-medium">Alamat Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="Misal: nama@email.com" 
          required 
          className="h-12 rounded-xl border-slate-200 focus-visible:ring-slate-300 text-slate-800 placeholder:text-slate-400"
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-rose-600 text-center bg-rose-50 p-3 rounded-lg">{error}</p>
      )}

      {success && (
        <p className="text-sm font-medium text-emerald-700 text-center bg-emerald-50 p-3 rounded-xl border border-emerald-100/50">
          {success}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all mt-4 text-base">
        {loading ? 'Mengirim Tautan...' : 'Kirim Tautan Reset'}
      </Button>
    </form>
  )
}
