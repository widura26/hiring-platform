'use client'
import { createContext, useContext, useState } from "react"

const ModalContext = createContext<SidebarContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)

    const openModal = () => setOpen(true)
    const closeModal = () => setOpen(false)

    return (
        <ModalContext.Provider value={{ open, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) throw new Error("useSidebar must be used inside SidebarProvider")
  return context
}