"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

type ModalType = "confirmation" | "alert" | "info"

interface ModalOptions {
    title: string
    message: string
    type?: ModalType
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
}

interface GlobalModalContextType {
    openModal: (options: ModalOptions) => void
    closeModal: () => void
    isOpen: boolean
    modalData: ModalOptions | null
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined)

export const GlobalModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [modalData, setModalData] = useState<ModalOptions | null>(null)

    const openModal = (options: ModalOptions) => {
        setModalData(options)
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
        setModalData(null)
    }

    return (
        <GlobalModalContext.Provider value={{ openModal, closeModal, isOpen, modalData }}>
            {children}
            {/* We will place the Modal component here or in layout, but context is cleanest */}
        </GlobalModalContext.Provider>
    )
}

export const useGlobalModal = () => {
    const context = useContext(GlobalModalContext)
    if (!context) {
        throw new Error("useGlobalModal must be used within a GlobalModalProvider")
    }
    return context
}
