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
import { updateService, deleteService, toggleServiceStatus } from './actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Service {
  id: string
  name: string
  price: number
  unit: string
  status: boolean
}

export function ServiceActions({ service }: { service: Service }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteService(service.id)
      if (res.error) {
        alert(res.error)
      } else {
        setIsDeleteDialogOpen(false)
      }
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus layanan.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await updateService(service.id, formData)
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
            <DialogTitle>Edit Layanan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${service.id}`}>Nama Layanan</Label>
              <Input id={`name-${service.id}`} name="name" defaultValue={service.name} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`price-${service.id}`}>Harga (Rp)</Label>
              <Input id={`price-${service.id}`} name="price" type="number" defaultValue={service.price} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`unit-${service.id}`}>Satuan</Label>
              <Select name="unit" defaultValue={service.unit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Per Kg</SelectItem>
                  <SelectItem value="unit">Per Pcs/Unit</SelectItem>
                  <SelectItem value="meter">Per Meter</SelectItem>
                </SelectContent>
              </Select>
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
            <DialogTitle>Hapus Layanan?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus layanan <strong>{service.name}</strong>? Jika layanan ini sudah pernah dipesan, penghapusan akan gagal.
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
