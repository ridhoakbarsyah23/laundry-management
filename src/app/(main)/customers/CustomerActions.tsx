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
import { updateCustomer, deleteCustomer } from './actions'

interface Customer {
  id: string
  name: string
  phone: string
  address: string | null
}

export function CustomerActions({ customer }: { customer: Customer }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCustomer(customer.id)
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus pelanggan.')
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await updateCustomer(customer.id, formData)
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
            <DialogTitle>Edit Pelanggan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${customer.id}`}>Nama Lengkap</Label>
              <Input id={`name-${customer.id}`} name="name" defaultValue={customer.name} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`phone-${customer.id}`}>Nomor HP</Label>
              <Input id={`phone-${customer.id}`} name="phone" defaultValue={customer.phone} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`address-${customer.id}`}>Alamat</Label>
              <Input id={`address-${customer.id}`} name="address" defaultValue={customer.address || ''} />
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
            <DialogTitle>Hapus Pelanggan?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pelanggan <strong>{customer.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
