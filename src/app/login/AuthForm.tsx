'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react'
import { login, signup } from './actions'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export function AuthForm({ error }: { error?: string }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const action = isLogin ? login : signup

  return (
    <Card className="w-full max-w-[420px] relative z-10 border border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white flex flex-col">
      <CardContent className="p-8 pb-6 flex-1">
        
        {/* Top Toggle */}
        <div className="mx-auto w-fit bg-slate-100/80 p-1 rounded-xl flex items-center mb-8 border border-slate-200/50 relative">
          <button 
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all z-10 ${isLogin ? 'text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
          <button 
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all z-10 ${!isLogin ? 'text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <UserPlus className="w-4 h-4" />
            Sign Up
          </button>
          {/* Active indicator */}
          <div 
            className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out z-0"
            style={{ 
              left: isLogin ? '4px' : 'calc(50% + 2px)', 
              width: 'calc(50% - 6px)' 
            }}
          />
        </div>

        <form action={action} className="space-y-5" onSubmit={() => setLoading(true)}>
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-600 font-medium">Email address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="Enter your email address" 
              required 
              className="h-11 rounded-lg border-slate-200 focus-visible:ring-slate-300 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-600 font-medium">Password</Label>
              {isLogin && <Link href="/forgot-password" className="text-xs font-medium text-slate-900 hover:underline">Lupa password?</Link>}
            </div>
            <div className="relative group">
              <Input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="Enter your password"
                className="h-11 rounded-lg border-slate-200 focus-visible:ring-slate-300 text-slate-800 placeholder:text-slate-400 pr-10"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm font-medium text-red-500 text-center">{error}</p>
          )}

          {/* Action Button */}
          <Button type="submit" disabled={loading} className="w-full h-11 rounded-lg bg-[#1a1b23] hover:bg-[#2a2b36] text-white font-medium shadow-md shadow-slate-900/10 transition-all mt-2">
            {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Create Account')}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">or</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => handleSocialLogin('google')}
            className="w-full h-11 rounded-lg border-slate-200 text-slate-700 font-medium hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </div>
      </CardContent>

      {/* Footer */}
      <div className="bg-slate-50/80 p-4 border-t border-slate-100 flex items-center justify-center text-sm text-slate-500 font-medium">
        {isLogin ? (
          <>
            Don't have an account yet? <button type="button" onClick={() => setIsLogin(false)} className="text-slate-900 ml-1 underline underline-offset-2 font-semibold cursor-pointer hover:text-slate-700 transition-colors">Sign up</button>
          </>
        ) : (
          <>
            Already have an account? <button type="button" onClick={() => setIsLogin(true)} className="text-slate-900 ml-1 underline underline-offset-2 font-semibold cursor-pointer hover:text-slate-700 transition-colors">Log in</button>
          </>
        )}
      </div>
    </Card>
  )
}
