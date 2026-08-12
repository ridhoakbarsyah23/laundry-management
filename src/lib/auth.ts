import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export async function requireUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  const [dbUser] = await db.select().from(users).where(eq(users.auth_id, user.id))
  
  if (!dbUser) {
    redirect('/login')
  }

  return { authUser: user, dbUser }
}

export async function requireOwner() {
  const { authUser, dbUser } = await requireUser()
  
  if (dbUser.role !== 'owner') {
    redirect('/orders')
  }
  
  return { authUser, dbUser }
}
