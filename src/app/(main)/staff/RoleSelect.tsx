'use client'

import { useState } from 'react'
import { updateStaffRole } from './actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'

export function RoleSelect({ 
  userId, 
  currentRole, 
  isCurrentUser 
}: { 
  userId: string, 
  currentRole: 'owner' | 'staff',
  isCurrentUser: boolean
}) {
  const [isPending, startTransition] = useTransition()
  
  if (isCurrentUser) {
    return <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md inline-block">Owner (Anda)</div>
  }

  return (
    <div className="flex items-center gap-2">
      <Select 
        defaultValue={currentRole} 
        disabled={isPending}
        onValueChange={(val) => {
          if (!val) return
          startTransition(async () => {
            await updateStaffRole(userId, val as 'owner' | 'staff')
          })
        }}
      >
        <SelectTrigger className="w-[120px] h-8 text-xs font-semibold focus:ring-blue-500/30 border-slate-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="staff">Staf</SelectItem>
          <SelectItem value="owner">Owner</SelectItem>
        </SelectContent>
      </Select>
      {isPending && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
    </div>
  )
}
