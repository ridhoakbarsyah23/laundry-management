import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { forgotPassword } from './actions'
import Link from 'next/link'
import { ArrowLeft, KeyRound } from 'lucide-react'

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string, success?: string }> }) {
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
        <CardContent className="p-8 pb-6 flex-1">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Lupa Password?</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Masukkan alamat email Anda yang terdaftar, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
            </p>
          </div>

          <form action={forgotPassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600 font-medium">Alamat Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="Masukkan alamat email Anda" 
                required 
                className="h-11 rounded-lg border-slate-200 focus-visible:ring-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {resolvedSearchParams?.error && (
              <p className="text-sm font-medium text-red-500 text-center">{resolvedSearchParams.error}</p>
            )}

            {resolvedSearchParams?.success && (
              <p className="text-sm font-medium text-emerald-600 text-center bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                {resolvedSearchParams.success}
              </p>
            )}

            <Button type="submit" className="w-full h-11 rounded-lg bg-[#1a1b23] hover:bg-[#2a2b36] text-white font-medium shadow-md shadow-slate-900/10 transition-all mt-2">
              Kirim Tautan Reset
            </Button>
          </form>
        </CardContent>

        <div className="bg-slate-50/80 p-4 border-t border-slate-100 flex items-center justify-center text-sm">
          <Link href="/login" className="flex items-center text-slate-500 hover:text-slate-900 font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Login
          </Link>
        </div>
      </Card>
    </div>
  )
}
