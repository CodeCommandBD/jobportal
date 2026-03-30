'use client'

import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext({
  isOpen: false,
  modalType: null,
  data: null,
  openModal: () => {},
  closeModal: () => {},
});

export const GlobalModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [data, setData] = useState(null);

  const openModal = (type, modalData = null) => {
    setModalType(type);
    setData(modalData);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
    setData(null);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        modalType,
        data,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useGlobalModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within a GlobalModalProvider');
  }
  return context;
};
