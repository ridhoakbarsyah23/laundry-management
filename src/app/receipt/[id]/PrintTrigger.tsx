'use client'

import { useEffect } from 'react'
import { Printer } from 'lucide-react'

export default function PrintTrigger() {
  useEffect(() => {
    // Automatically trigger print dialog when component mounts
    setTimeout(() => {
      window.print()
    }, 500)
  }, [])

  return (
    <button 
      onClick={() => window.print()}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl shadow-blue-600/30 transition-transform hover:scale-110 print:hidden flex items-center justify-center"
      title="Print Receipt"
    >
      <Printer className="w-6 h-6" />
    </button>
  )
}
