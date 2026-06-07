import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

import { useLanguage } from './LanguageContext';
import type { Language } from '../data/translations';

interface ModalContextType {
  isDevisModalOpen: boolean;
  devisModalData: { proName?: string; proId?: number } | null;
  openDevisModal: (data?: { proName: string; proId?: number }) => void;
  closeDevisModal: () => void;
  
  isChatModalOpen: boolean;
  chatModalData: { proName?: string; proId?: number } | null;
  openChatModal: (data?: { proName: string; proId?: number }) => void;
  closeChatModal: () => void;
  
  language: Language;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isDevisModalOpen, setIsDevisModalOpen] = useState(false);
  const [devisModalData, setDevisModalData] = useState<{ proName?: string; proId?: number } | null>(null);
  
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatModalData, setChatModalData] = useState<{ proName?: string; proId?: number } | null>(null);
  
  const { language } = useLanguage();

  const openDevisModal = (data?: { proName: string; proId?: number }) => {
    setDevisModalData(data || null);
    setIsDevisModalOpen(true);
  };
  
  const closeDevisModal = () => {
    setIsDevisModalOpen(false);
    setDevisModalData(null);
  };

  const openChatModal = (data?: { proName: string; proId?: number }) => {
    setChatModalData(data || null);
    setIsChatModalOpen(true);
  };
  
  const closeChatModal = () => {
    setIsChatModalOpen(false);
    setChatModalData(null);
  };

  return (
    <ModalContext.Provider value={{ 
      isDevisModalOpen, devisModalData, openDevisModal, closeDevisModal, 
      isChatModalOpen, chatModalData, openChatModal, closeChatModal,
      language 
    }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
