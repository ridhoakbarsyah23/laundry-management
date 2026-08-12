import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { resetPassword } from './actions'
import { Lock } from 'lucide-react'

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedSearchParams = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-[#f8f9fa] relative">
      {/* Subtle Grid Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      ></div>

      <Card className="w-full max-w-[420px] relative z-10 border border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white flex flex-col">
        <CardContent className="p-8 pb-8 flex-1">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Buat Password Baru</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Silakan masukkan kata sandi baru untuk akun Anda.
            </p>
          </div>

          <form action={resetPassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-600 font-medium">Password Baru</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Minimal 6 karakter" 
                required 
                minLength={6}
                className="h-11 rounded-lg border-slate-200 focus-visible:ring-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {resolvedSearchParams?.error && (
              <p className="text-sm font-medium text-red-500 text-center">{resolvedSearchParams.error}</p>
            )}

            <Button type="submit" className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md shadow-emerald-600/20 transition-all mt-2">
              Simpan Password Baru
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
