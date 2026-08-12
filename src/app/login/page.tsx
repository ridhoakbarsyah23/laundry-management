import { AuthForm } from './AuthForm'
import { Droplets } from 'lucide-react'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string, success?: string }> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Top Mobile Header (Visible only on mobile/tablet) */}
      <div className="lg:hidden flex items-center p-6 border-b border-slate-100 bg-white z-20">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-slate-800">LaundryHub</span>
      </div>

      {/* Left Branding Side (Hidden on mobile, visible on desktop) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-12 relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight">LaundryHub</span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-16">
          <h1 className="text-5xl font-bold leading-tight mb-6">Manajemen Laundry<br/>Lebih Mudah &<br/>Terukur.</h1>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            Pantau pesanan, kelola pelanggan, dan analisa laporan keuangan dalam satu dashboard yang intuitif dan profesional.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-400 border-2 border-indigo-900 flex items-center justify-center text-sm font-bold">1k+</div>
              <div className="w-12 h-12 rounded-full bg-indigo-400 border-2 border-indigo-900 flex items-center justify-center text-sm font-bold">★</div>
            </div>
            <p className="text-sm text-blue-100 font-medium">Dipercaya oleh ribuan<br/>pengusaha laundry.</p>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 py-12 sm:p-12 relative">
        <div className="w-full max-w-md">
          <AuthForm error={resolvedSearchParams?.error} success={resolvedSearchParams?.success} />
        </div>
      </div>
    </div>
  )
}
