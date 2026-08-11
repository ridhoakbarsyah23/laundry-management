'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=' + error.message)
  }

  // Sync to public.users
  if (authData.user) {
    const { db } = await import('@/db')
    const { users } = await import('@/db/schema')
    const { eq } = await import('drizzle-orm')
    
    const existingUser = await db.select().from(users).where(eq(users.auth_id, authData.user.id))
    
    if (existingUser.length === 0) {
      await db.insert(users).values({
        auth_id: authData.user.id,
        name: authData.user.email?.split('@')[0] || 'Staff',
        email: authData.user.email || '',
        role: 'staff',
      })
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/login?error=' + error.message)
  }

  // Sync to public.users
  if (authData.user) {
    const { db } = await import('@/db')
    const { users } = await import('@/db/schema')
    const { eq } = await import('drizzle-orm')
    
    const existingUser = await db.select().from(users).where(eq(users.auth_id, authData.user.id))
    
    if (existingUser.length === 0) {
      await db.insert(users).values({
        auth_id: authData.user.id,
        name: authData.user.email?.split('@')[0] || 'Staff',
        email: authData.user.email || '',
        role: 'staff',
      })
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
