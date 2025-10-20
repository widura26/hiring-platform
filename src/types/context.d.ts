interface SidebarContextType {
    open: boolean
    openModal: () => void
    closeModal: () => void
}

interface BreadCrumbContextType {
    open: boolean
    openDetail: () => void
}

interface ProfileInformationContextType {
    profileInformationDatas: Field[],
    setProfileInformation: React.Dispatch<React.SetStateAction<Field[]>>;
}