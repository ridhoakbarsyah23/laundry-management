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
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createService } from './actions'

export function ServiceForm() {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    await createService(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        Tambah Layanan Baru
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Layanan</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Layanan</Label>
            <Input id="name" name="name" required placeholder="misal: Cuci Komplit" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Harga (Rp)</Label>
            <Input id="price" name="price" type="number" required placeholder="misal: 6000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Satuan</Label>
            <Select name="unit" defaultValue="kg">
              <SelectTrigger>
                <SelectValue placeholder="Pilih satuan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Per Kg</SelectItem>
                <SelectItem value="unit">Per Item / Unit</SelectItem>
                <SelectItem value="meter">Per Meter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Simpan Layanan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
