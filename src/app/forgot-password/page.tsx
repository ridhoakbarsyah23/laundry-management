import { ForgotPasswordForm } from './ForgotPasswordForm'
import Link from 'next/link'
import { ArrowLeft, Droplets, KeyRound } from 'lucide-react'

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string, success?: string }> }) {
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
          <h1 className="text-5xl font-bold leading-tight mb-6">Tenang Saja,<br/>Kami Bantu<br/>Akses Anda.</h1>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            Keamanan data Anda adalah prioritas kami. Masukkan email Anda dan ikuti instruksi yang kami kirimkan.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 py-12 sm:p-12 relative">
        <div className="w-full max-w-[400px]">
          <Link href="/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Halaman Login
          </Link>

          <div className="mb-8">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center mb-6">
              <KeyRound className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Lupa Password?</h2>
            <p className="text-slate-500 mt-2">
              Masukkan alamat email Anda yang terdaftar, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
            </p>
          </div>

          <ForgotPasswordForm error={resolvedSearchParams?.error} success={resolvedSearchParams?.success} />
        </div>
      </div>
    </div>
  )
}
