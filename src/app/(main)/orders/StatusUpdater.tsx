'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateLaundryStatus } from './actions'

const statuses = [
  'diterima',
  'dicuci',
  'dikeringkan',
  'disetrika',
  'siap diambil',
  'selesai',
]

export function StatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleStatusChange(value: string | null) {
    if (!value) return
    setStatus(value)
    setLoading(true)
    try {
      await updateLaundryStatus(orderId, value)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
      <SelectTrigger className="w-[140px] h-8 text-xs capitalize rounded-full bg-slate-50 border-slate-200 hover:bg-slate-100 transition-colors focus:ring-blue-500">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-slate-200 shadow-xl">
        {statuses.map((s) => (
          <SelectItem key={s} value={s} className="capitalize text-xs">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
