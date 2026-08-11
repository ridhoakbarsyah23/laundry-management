'use client'

import { useState } from 'react'
import { createExpense } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ExpenseForm() {
  const [loading, setLoading] = useState(false)

  async function action(formData: FormData) {
    setLoading(true)
    try {
      await createExpense(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={action} className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          placeholder="e.g. Listrik, Sabun, Gaji"
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (IDR)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="1"
          placeholder="e.g. 50000"
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          name="description"
          placeholder="Catatan tambahan..."
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Expense'}
      </Button>
    </form>
  )
}
