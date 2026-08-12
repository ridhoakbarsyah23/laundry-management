'use client'

import { useState } from 'react'
import { createInventoryItem, updateInventoryItem } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

export function InventoryForm({ 
  item, 
  isOpen, 
  onClose 
}: { 
  item?: any, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [name, setName] = useState(item?.item_name || '')
  const [unit, setUnit] = useState(item?.unit || 'Liter')
  const [minStock, setMinStock] = useState(item?.min_stock || '1')
  const [initialStock, setInitialStock] = useState('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!item

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isEdit) {
        await updateInventoryItem(item.id, {
          item_name: name,
          unit,
          min_stock: parseFloat(minStock),
        })
      } else {
        await createInventoryItem({
          item_name: name,
          unit,
          min_stock: parseFloat(minStock),
          stock: parseFloat(initialStock),
        })
      }
      onClose()
      if (!isEdit) {
        setName('')
        setUnit('Liter')
        setMinStock('1')
        setInitialStock('0')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Barang' : 'Tambah Barang Baru'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
          
          <div className="space-y-2">
            <Label>Nama Barang</Label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Misal: Deterjen Cair Rinso"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Satuan</Label>
              <Input 
                value={unit} 
                onChange={e => setUnit(e.target.value)} 
                placeholder="Liter, Kg, Pcs..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Batas Minimum Stok</Label>
              <Input 
                type="number"
                step="0.1"
                value={minStock} 
                onChange={e => setMinStock(e.target.value)} 
                required
              />
            </div>
          </div>

          {!isEdit && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <Label>Stok Awal</Label>
              <Input 
                type="number"
                step="0.1"
                value={initialStock} 
                onChange={e => setInitialStock(e.target.value)} 
                required
              />
              <p className="text-xs text-slate-500">Stok awal saat menambahkan barang ini.</p>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
