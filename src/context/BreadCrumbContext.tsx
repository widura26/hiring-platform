"use client"
import { createContext, useContext, useState } from "react"

const BreadCrumbContext = createContext<BreadCrumbContextType | undefined>(undefined)

export function BreadCrumbProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const openDetail = () => setOpen(true)

    return (
        <BreadCrumbContext.Provider value={{ open, openDetail }}>
            {children}
        </BreadCrumbContext.Provider>
    )
}

export function useBreadCrumb() {
  const context = useContext(BreadCrumbContext)
  if (!context) throw new Error("Something wrong")
  return context
}