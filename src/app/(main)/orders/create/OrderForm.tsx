'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, User, Briefcase, Weight, StickyNote, CreditCard, UserPlus, Users } from 'lucide-react'
import { createOrder, updateOrder } from '../actions'

type Customer = { id: string; name: string }
type Service = { id: string; name: string; price: number; unit: string }

export function OrderForm({
  customers,
  services,
  initialData,
}: {
  customers: Customer[]
  services: Service[]
  initialData?: {
    id: string
    customer_id: string
    service_id: string
    quantity: number
    payment_method: string | null
    notes: string | null
    discount?: number
  }
}) {
  const [selectedService, setSelectedService] = useState<Service | null>(
    initialData ? services.find(s => s.id === initialData.service_id) || null : null
  )
  const [quantity, setQuantity] = useState(initialData ? initialData.quantity : 1)
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const [customerId, setCustomerId] = useState(initialData ? initialData.customer_id : '')
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState(initialData?.payment_method || '')
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [discount, setDiscount] = useState(initialData?.discount || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = selectedService ? selectedService.price * quantity : 0
  const total = Math.max(0, subtotal - discount)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedService) return
    if (!isNewCustomer && !customerId) return
    if (isNewCustomer && (!newCustomerName || !newCustomerPhone)) return
    
    setIsSubmitting(true)
    try {
      const payload = {
        customer_id: isNewCustomer ? undefined : customerId,
        new_customer_name: isNewCustomer ? newCustomerName : undefined,
        new_customer_phone: isNewCustomer ? newCustomerPhone : undefined,
        service_id: selectedService.id,
        quantity,
        notes,
        payment_method: paymentMethod || undefined,
        discount,
      }
      
      if (initialData) {
        await updateOrder(initialData.id, payload)
      } else {
        await createOrder(payload)
      }
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-3xl border border-slate-200/60 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-500/5 overflow-hidden">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <Label className="text-slate-700 font-semibold flex items-center gap-2 text-base"><User className="w-4 h-4 text-blue-500" /> Data Pelanggan</Label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIsNewCustomer(false)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${!isNewCustomer ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Lama</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewCustomer(true)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${isNewCustomer ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="flex items-center gap-1.5"><UserPlus className="w-4 h-4" /> Pelanggan Baru</span>
                </button>
              </div>
            </div>

            {!isNewCustomer ? (
              <Select value={customerId} onValueChange={(val: string | null) => setCustomerId(val ?? '')} required={!isNewCustomer}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-blue-500 text-base">
                  <SelectValue placeholder="Pilih pelanggan lama">
                    {customerId ? customers.find(c => c.id === customerId)?.name : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {`${c.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Nama Lengkap"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    required={isNewCustomer}
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Nomor HP (misal: 0812...)"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    required={isNewCustomer}
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-base"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold flex items-center gap-2 text-base"><Briefcase className="w-4 h-4 text-blue-500" /> Layanan Cucian</Label>
              <Select
                value={selectedService?.id || ''}
                onValueChange={(val) =>
                  setSelectedService(services.find((s) => s.id === val) || null)
                }
                required
              >
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-blue-500 text-base">
                  <SelectValue placeholder="Pilih layanan">
                    {selectedService ? `${selectedService.name} - Rp ${selectedService.price}/${selectedService.unit}` : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {`${s.name} - Rp ${s.price}/${s.unit}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold flex items-center gap-2 text-base"><Weight className="w-4 h-4 text-blue-500" /> Jumlah / Berat</Label>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold flex items-center gap-2 text-base"><StickyNote className="w-4 h-4 text-blue-500" /> Catatan (Opsional)</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Jangan dicampur luntur, setrika yang rapi"
                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-base"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold flex items-center gap-2 text-base">🏷️ Diskon (Rp)</Label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={discount === 0 ? '' : discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0"
                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-base"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-slate-700 font-semibold flex items-center gap-2 text-base"><CreditCard className="w-4 h-4 text-blue-500" /> Status Pembayaran</Label>
            <Select value={paymentMethod} onValueChange={(val: string | null) => setPaymentMethod(val ?? '')}>
              <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-blue-500 text-base">
                <SelectValue placeholder="Belum Lunas / Bayar Nanti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Tunai</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 w-full md:w-auto">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Estimasi Tagihan</p>
              {discount > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-slate-400 line-through">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(subtotal)}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Hemat {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(discount)}
                  </span>
                </div>
              )}
              <p className="text-3xl font-extrabold text-blue-700">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0
                }).format(total)}
              </p>
            </div>
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting || (!isNewCustomer && !customerId) || (isNewCustomer && (!newCustomerName || !newCustomerPhone)) || !selectedService}
              className="w-full md:w-auto h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/30 rounded-xl px-8 text-lg font-semibold transition-all hover:scale-[1.02]"
            >
              {isSubmitting ? 'Memproses...' : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {initialData ? 'Simpan Perubahan' : 'Konfirmasi Pesanan'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
