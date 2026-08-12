import { RegisterForm } from './RegisterForm'
import { Droplets } from 'lucide-react'

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedSearchParams = await searchParams;
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
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-gradient-to-br from-indigo-700 to-purple-900 text-white p-12 relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight">LaundryHub</span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-16">
          <h1 className="text-5xl font-bold leading-tight mb-6">Mulai Transformasi<br/>Bisnis Laundry<br/>Anda.</h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8">
            Daftar sekarang dan bergabunglah dengan ribuan pengusaha laundry yang telah sukses mengelola bisnis mereka dengan LaundryHub.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 py-12 sm:p-12 relative">
        <div className="w-full max-w-md">
          <RegisterForm error={resolvedSearchParams?.error} />
        </div>
      </div>
    </div>
  )
}
