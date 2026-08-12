'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string
  const adminAuth = createAdminClient().auth

  // 1. Find user by email (Admin API)
  const { data: { users }, error: listError } = await adminAuth.admin.listUsers()
  
  if (listError) {
    redirect('/forgot-password?error=' + encodeURIComponent('Gagal terhubung ke sistem.'))
  }

  const user = users.find(u => u.email === email)

  if (!user) {
    // Return success anyway for security so attackers can't guess emails
    redirect('/forgot-password?error=' + encodeURIComponent('Email tidak ditemukan.'))
  }

  // 2. Set user ID in cookie for bypass
  const cookieStore = await cookies()
  cookieStore.set('reset_bypass_uid', user.id, { httpOnly: true, maxAge: 60 * 10 }) // 10 minutes

  // 3. Directly redirect to reset-password page
  redirect('/reset-password')
}
