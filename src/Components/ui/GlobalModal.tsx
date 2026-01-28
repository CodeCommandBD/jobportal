"use client"

import React from 'react'
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { useGlobalModal } from '@/context/GlobalModalContext'
import { Button } from '@/Components/ui/button'

const GlobalModal = () => {
  const { isOpen, closeModal, modalData } = useGlobalModal()

  if (!isOpen || !modalData) return null

  const { title, message, type = 'confirmation', confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel } = modalData

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
    closeModal()
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    closeModal()
  }

  // Icon mapping based on type
  const renderIcon = () => {
      switch(type) {
          case 'alert':
              return <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
          case 'info':
              return <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10"><Info className="h-6 w-6 text-blue-600" /></div>
          case 'confirmation':
          default:
               return <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10"><Info className="h-6 w-6 text-purple-600" /></div>
      }
  }

  return (
    <div className="relative z-50 transform transition-all" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={handleCancel}></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100 dark:border-gray-700">
                    <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            {renderIcon()}
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">{title}</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-300 whitespace-pre-line">{message}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                        <Button 
                            onClick={handleConfirm}
                            className={`${type === 'alert' ? 'bg-red-600 hover:bg-red-500' : 'bg-purple-600 hover:bg-purple-500'} text-white w-full sm:w-auto`}
                        >
                            {confirmText}
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={handleCancel}
                            className="mt-3 sm:mt-0 w-full sm:w-auto"
                        >
                            {cancelText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GlobalModal
