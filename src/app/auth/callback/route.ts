import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Exchange code error:', error)
    }
    
    if (!error && authData.user) {
      try {
        // Sync to public.users
        const { db } = await import('@/db')
        const { users } = await import('@/db/schema')
        const { eq } = await import('drizzle-orm')
        
        const existingUser = await db.select().from(users).where(eq(users.auth_id, authData.user.id))
        
        if (existingUser.length === 0) {
          await db.insert(users).values({
            auth_id: authData.user.id,
            name: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Staff',
            email: authData.user.email || '',
            role: 'staff',
          })
        }
        const next = searchParams.get('next') || '/dashboard'
        return NextResponse.redirect(`${origin}${next}`)
      } catch (dbError) {
        console.error('Database sync error:', dbError)
      }
    }
  } else {
    console.error('No code in URL searchParams')
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate with provider`)
}
