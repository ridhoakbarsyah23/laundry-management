import { getInventory } from './actions'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Package, PlusCircle, AlertTriangle, History } from 'lucide-react'
import { InventoryClient } from './InventoryClient'

export default async function InventoryPage() {
  const items = await getInventory()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">Inventaris</h1>
          </div>
          <p className="text-slate-500 mt-2 text-lg">Kelola stok barang dan bahan baku laundry Anda.</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Macam Barang</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{items.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-rose-200/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Stok Menipis</p>
            <p className="text-3xl font-bold text-rose-600 mt-1">
              {items.filter(i => parseFloat(i.stock) <= parseFloat(i.min_stock)).length}
            </p>
          </div>
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
        </div>
      </div>

      <InventoryClient items={items} />
    </div>
  )
}
