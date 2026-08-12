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
import { createCustomer } from './actions'

export function CustomerForm() {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    await createCustomer(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        Tambah Pelanggan
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" required placeholder="misal: Budi" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor HP</Label>
            <Input id="phone" name="phone" required placeholder="misal: 08123456789" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Input id="address" name="address" placeholder="Opsional" />
          </div>
          <Button type="submit" className="w-full">
            Simpan Pelanggan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
