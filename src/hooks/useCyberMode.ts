import { useContext } from 'react';
import { CyberModeContext } from '@/hooks/CyberModeContext';

export const useCyberMode = () => {
  const context = useContext(CyberModeContext);
  if (!context) {
    throw new Error('useCyberMode must be used within CyberModeProvider');
  }
  return context;
};
