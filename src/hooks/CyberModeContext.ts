import { createContext } from 'react';

type CyberModeContextValue = {
  isCyberMode: boolean;
  toggleCyberMode: () => void;
  cursorEnabled: boolean;
  toggleCursorEnabled: () => void;
};

export const CyberModeContext = createContext<CyberModeContextValue>({
  isCyberMode: false,
  toggleCyberMode: () => undefined,
  cursorEnabled: false,
  toggleCursorEnabled: () => undefined,
});
