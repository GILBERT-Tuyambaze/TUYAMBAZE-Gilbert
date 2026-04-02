import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CyberModeContext } from '@/hooks/CyberModeContext';

const CYBER_MODE_STORAGE_KEY = 'gilbert-portfolio-cyber-mode';
const CURSOR_STORAGE_KEY = 'gilbert-portfolio-cursor-enabled';

export function CyberModeProvider({ children }: { children: React.ReactNode }) {
  const [isCyberMode, setIsCyberMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(CYBER_MODE_STORAGE_KEY) === 'true';
  });
  const [cursorEnabled, setCursorEnabled] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    const saved = window.localStorage.getItem(CURSOR_STORAGE_KEY);
    return saved === null ? true : saved === 'true';
  });

  const toggleCursorEnabled = useCallback(() => {
    setCursorEnabled((current) => !current);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('cyber-mode', isCyberMode);

    if (isCyberMode && !cursorEnabled) {
      setCursorEnabled(true);
    }
  }, [isCyberMode, cursorEnabled]);

  useEffect(() => {
    window.localStorage.setItem(CYBER_MODE_STORAGE_KEY, String(isCyberMode));
  }, [isCyberMode]);

  useEffect(() => {
    window.localStorage.setItem(CURSOR_STORAGE_KEY, String(cursorEnabled));
  }, [cursorEnabled]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
        event.preventDefault();
        setIsCyberMode((current) => !current);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleCyberMode = useCallback(() => {
    setIsCyberMode((current) => !current);
  }, []);

  const value = useMemo(
    () => ({ isCyberMode, toggleCyberMode, cursorEnabled, toggleCursorEnabled }),
    [isCyberMode, toggleCyberMode, cursorEnabled, toggleCursorEnabled]
  );

  return <CyberModeContext.Provider value={value}>{children}</CyberModeContext.Provider>;
}

