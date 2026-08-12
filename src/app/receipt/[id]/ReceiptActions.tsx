'use client'

import { useEffect } from 'react'
import { Printer, MessageCircle } from 'lucide-react'

interface ReceiptActionsProps {
  phone?: string
  customerName?: string
  orderNumber: string
  total: number
  discount?: number
}

export default function ReceiptActions({ phone, customerName, orderNumber, total, discount = 0 }: ReceiptActionsProps) {
  useEffect(() => {
    // Automatically trigger print dialog when component mounts
    setTimeout(() => {
      window.print()
    }, 500)
  }, [])

  const handleWhatsApp = () => {
    if (!phone) {
      alert('Nomor telepon pelanggan tidak tersedia untuk pesanan ini.')
      return
    }

    // Format phone number: replace leading 0 with 62
    let formattedPhone = phone.replace(/\D/g, '') // remove non-digits
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1)
    }

    const formatCurrency = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(total)

    const formattedDiscount = discount > 0 ? new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(discount) : ''

    const discountText = discount > 0 ? `\n*Diskon:* -${formattedDiscount}` : ''

    const message = `Halo ${customerName || 'Kak'},\n\nTerima kasih telah mempercayakan cucian Anda di *LaundryHub*! 💧\n\nBerikut adalah rincian pesanan Anda:\n*Nomor Order:* ${orderNumber}${discountText}\n*Total Tagihan:* ${formatCurrency}\n\nPesanan Anda sedang kami proses. Silakan simpan pesan ini sebagai bukti digital ya.\n\nTerima kasih! 🙏`
    
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 print:hidden">
      {phone && (
        <button 
          onClick={handleWhatsApp}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-xl shadow-emerald-500/30 transition-transform hover:scale-110 flex items-center justify-center group"
          title="Kirim ke WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      <button 
        onClick={() => window.print()}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl shadow-blue-600/30 transition-transform hover:scale-110 flex items-center justify-center group"
        title="Cetak Struk"
      >
        <Printer className="w-6 h-6" />
      </button>
    </div>
  )
}
