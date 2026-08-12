'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { PlusCircle, Edit, ArrowRightLeft, AlertTriangle, Trash2 } from 'lucide-react'
import { InventoryForm } from './InventoryForm'
import { StockUpdateModal } from './StockUpdateModal'
import { deleteInventoryItem } from './actions'

export function InventoryClient({ items }: { items: any[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedItem(null)
    setIsFormOpen(true)
  }

  const handleUpdateStock = (item: any) => {
    setSelectedItem(item)
    setIsStockModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus barang ini beserta riwayatnya?')) return
    setIsDeleting(id)
    try {
      await deleteInventoryItem(id)
    } catch (error) {
      alert('Gagal menghapus barang.')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Daftar Barang</h2>
        <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          <span className="font-semibold">Tambah Barang</span>
        </Button>
      </div>

      <div className="border border-slate-200/60 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-500/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-slate-700 h-14 pl-6">Nama Barang</TableHead>
              <TableHead className="font-semibold text-slate-700">Stok Saat Ini</TableHead>
              <TableHead className="font-semibold text-slate-700">Batas Minimum</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => {
              const stock = parseFloat(item.stock)
              const minStock = parseFloat(item.min_stock)
              const isLow = stock <= minStock

              return (
                <TableRow 
                  key={item.id} 
                  className={`hover:bg-slate-50/50 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards ${isLow ? 'bg-rose-50/30' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TableCell className="font-semibold text-slate-800 pl-6 py-4">
                    {item.item_name}
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-bold text-lg">{stock}</span> <span className="text-slate-500 text-sm">{item.unit}</span>
                  </TableCell>
                  <TableCell className="text-slate-500 py-4">
                    {minStock} {item.unit}
                  </TableCell>
                  <TableCell className="py-4">
                    {isLow ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Stok Menipis
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Aman
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStock(item)}
                        className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                      >
                        <ArrowRightLeft className="w-4 h-4 mr-1.5 text-blue-500" />
                        Catat
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(item)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Edit Barang"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Hapus Barang"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-slate-500">
                  Belum ada barang di inventaris.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <InventoryForm 
        item={selectedItem} 
        isOpen={isFormOpen && !isStockModalOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
      
      <StockUpdateModal 
        item={selectedItem} 
        isOpen={isStockModalOpen} 
        onClose={() => setIsStockModalOpen(false)} 
      />
    </>
  )
}
