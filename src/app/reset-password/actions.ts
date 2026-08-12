'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function resetPassword(formData: FormData) {
  const password = formData.get('password') as string
  const cookieStore = await cookies()
  const bypassUid = cookieStore.get('reset_bypass_uid')?.value

  if (!bypassUid) {
    redirect('/reset-password?error=' + encodeURIComponent('Sesi Anda telah kedaluwarsa.'))
  }

  const adminAuth = createAdminClient().auth

  // Force update user password using Admin API
  const { error } = await adminAuth.admin.updateUserById(bypassUid, { password })

  if (error) {
    redirect('/reset-password?error=' + encodeURIComponent(error.message))
  }

  // Clear cookie
  cookieStore.delete('reset_bypass_uid')

  redirect('/login?success=' + encodeURIComponent('Password berhasil diubah! Silakan login.'))
}
