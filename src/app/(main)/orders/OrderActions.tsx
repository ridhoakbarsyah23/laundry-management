'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2, Pencil } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { deleteOrder } from './actions'

export function OrderActions({ orderId }: { orderId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteOrder(orderId)
      // On success, the row will be removed, no need to close manually if it unmounts,
      // but we can close it just in case.
      setIsOpen(false)
    } catch (err) {
      console.error(err)
      alert('Failed to delete order.')
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Link 
        href={`/orders/${orderId}/edit`}
        title="Edit Order"
        className="inline-flex items-center justify-center h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
      >
        <Pencil className="h-4 w-4" />
      </Link>

      <DialogTrigger 
        render={
          <Button 
            variant="ghost" 
            size="icon" 
            title="Delete Order"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg ml-1"
          />
        }
      >
        <Trash2 className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hapus Pesanan?</DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Menghapus pesanan ini juga akan menghapus seluruh data pembayaran dan item layanan di dalamnya.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Batal
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ya, Hapus'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
