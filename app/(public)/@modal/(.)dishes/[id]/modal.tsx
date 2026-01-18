'use client'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (!open) router.back()
      }}
    >
      <DialogContent className='max-h-full overflow-auto'>
        <DialogTitle className='sr-only'>Modal</DialogTitle>

        <DialogDescription className='sr-only'>Modal content information</DialogDescription>

        {children}
      </DialogContent>
    </Dialog>
  )
}
