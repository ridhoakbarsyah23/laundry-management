'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { updateExpense, deleteExpense } from './actions'

interface Expense {
  id: string
  category: string
  amount: number
  description: string | null
}

export function ExpenseActions({ expense }: { expense: Expense }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteExpense(expense.id)
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus pengeluaran.')
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await updateExpense(expense.id, formData)
      if (res.error) {
        setError(res.error)
        setIsUpdating(false)
      } else {
        setIsOpen(false)
      }
    } catch (err) {
      setError('Terjadi kesalahan tak terduga')
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger 
          render={
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" />
          }
        >
          <Pencil className="h-4 w-4" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Pengeluaran</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor={`category-${expense.id}`}>Kategori</Label>
              <Input id={`category-${expense.id}`} name="category" defaultValue={expense.category} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`amount-${expense.id}`}>Jumlah (Rp)</Label>
              <Input id={`amount-${expense.id}`} name="amount" type="number" defaultValue={expense.amount} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${expense.id}`}>Keterangan</Label>
              <Input id={`description-${expense.id}`} name="description" defaultValue={expense.description || ''} />
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger 
          render={
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" />
          }
        >
          <Trash2 className="h-4 w-4" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Pengeluaran?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengeluaran <strong>{expense.category}</strong> sebesar {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(expense.amount)}? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Batal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ya, Hapus'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
