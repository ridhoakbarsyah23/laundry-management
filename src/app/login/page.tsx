import { AuthForm } from './AuthForm'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedSearchParams = await searchParams;
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

      <AuthForm error={resolvedSearchParams?.error} />
    </div>
  )
}
