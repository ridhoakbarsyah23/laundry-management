'use client'

import { useState } from 'react'
import { createInventoryItem, logInventoryUsage, updateInventoryItem } from './actions'
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Loader2, Plus, Minus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

export function StockUpdateModal({ 
  item, 
  isOpen, 
  onClose 
}: { 
  item: any, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'in' | 'out'>('out')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!item) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Jumlah harus lebih dari 0')
      }
      
      await logInventoryUsage({
        inventory_id: item.id,
        type,
        amount: parseFloat(amount),
        notes: notes || (type === 'in' ? 'Stok masuk manual' : 'Pemakaian manual')
      })
      
      onClose()
      setAmount('')
      setNotes('')
      setType('out')
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
          <DialogTitle>Update Stok: {item.item_name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType('in')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                type === 'in' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                  : 'border-slate-200 hover:border-slate-300 text-slate-500'
              }`}
            >
              <ArrowUpCircle className={`w-8 h-8 mb-2 ${type === 'in' ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span className="font-semibold text-sm">Barang Masuk</span>
            </button>
            
            <button
              type="button"
              onClick={() => setType('out')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                type === 'out' 
                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                  : 'border-slate-200 hover:border-slate-300 text-slate-500'
              }`}
            >
              <ArrowDownCircle className={`w-8 h-8 mb-2 ${type === 'out' ? 'text-rose-500' : 'text-slate-400'}`} />
              <span className="font-semibold text-sm">Barang Keluar</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <Label>Jumlah ({item.unit})</Label>
            <Input 
              type="number" 
              step="0.1"
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder={`Misal: 5`}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Catatan (Opsional)</Label>
            <Input 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              placeholder={type === 'in' ? "Pembelian dari supplier..." : "Pemakaian hari ini..."}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" disabled={loading} className={type === 'in' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
