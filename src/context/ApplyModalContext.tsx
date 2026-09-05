import React, { createContext, useContext, useState } from 'react';

interface ApplyModalContextType {
  isOpen: boolean;
  openApplyModal: () => void;
  closeApplyModal: () => void;
}

const ApplyModalContext = createContext<ApplyModalContextType | undefined>(undefined);

export function ApplyModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openApplyModal = () => setIsOpen(true);
  const closeApplyModal = () => setIsOpen(false);

  return (
    <ApplyModalContext.Provider value={{ isOpen, openApplyModal, closeApplyModal }}>
      {children}
    </ApplyModalContext.Provider>
  );
}

export function useApplyModal() {
  const context = useContext(ApplyModalContext);
  if (!context) {
    throw new Error('useApplyModal must be used within an ApplyModalProvider');
  }
  return context;
}
