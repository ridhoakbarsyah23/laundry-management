import { PageTransition } from '@/components/PageTransition'
import { ReactNode } from 'react'

export default function MainTemplate({ children }: { children: ReactNode }) {
  return (
    <PageTransition className="w-full h-full">
      {children}
    </PageTransition>
  )
}
