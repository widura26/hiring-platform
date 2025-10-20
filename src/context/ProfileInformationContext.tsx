'use client'
import { fetchProfileInformation } from "@/lib/data/profileInformation"
import { createContext, useContext, useState } from "react"

const ProfileInformationContext = createContext<ProfileInformationContextType | undefined>(undefined)

export function ProfileInformationProvider({ children }: { children: React.ReactNode }) {
    const [profileInformationDatas, setProfileInformation] = useState<Field[]>([])

    return (
        <ProfileInformationContext.Provider value={{ profileInformationDatas, setProfileInformation }}>
            {children}
        </ProfileInformationContext.Provider>
    )
}

export function useProfileInformation() {
  const context = useContext(ProfileInformationContext)
  if (!context) throw new Error("something wrong")
  return context
}