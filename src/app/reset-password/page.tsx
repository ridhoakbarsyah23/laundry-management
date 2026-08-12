import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { resetPassword } from './actions'
import { Droplets, Lock } from 'lucide-react'

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedSearchParams = await searchParams

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Top Mobile Header */}
      <div className="lg:hidden flex items-center p-6 border-b border-slate-100 bg-white z-20">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-slate-800">LaundryHub</span>
      </div>

      {/* Left Branding Side */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight">LaundryHub</span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-16">
          <h1 className="text-5xl font-bold leading-tight mb-6">Selangkah Lagi<br/>Untuk Kembali<br/>Beraktivitas.</h1>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            Buat kata sandi baru yang kuat dan mudah diingat agar Anda bisa kembali mengelola operasional laundry.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 py-12 sm:p-12 relative">
        <div className="w-full max-w-[400px]">

          <div className="mb-8">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Buat Password Baru</h2>
            <p className="text-slate-500 mt-2">
              Silakan masukkan kata sandi baru untuk mengamankan akun Anda.
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
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {resolvedSearchParams?.error && (
              <p className="text-sm font-medium text-rose-600 text-center bg-rose-50 p-3 rounded-lg">{resolvedSearchParams.error}</p>
            )}

            <Button type="submit" className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all mt-4 text-base">
              Simpan Password Baru
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
