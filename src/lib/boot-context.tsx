'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface BootContextValue {
  ready: boolean;
  markReady: () => void;
}

const BootContext = createContext<BootContextValue | null>(null);

interface BootProviderProps {
  children: ReactNode;
}

export function BootProvider({ children }: BootProviderProps) {
  const [ready, setReady] = useState(false);

  const markReady = useCallback(() => {
    setReady((prev) => (prev ? prev : true));
  }, []);

  const value = useMemo<BootContextValue>(
    () => ({ ready, markReady }),
    [ready, markReady]
  );

  return <BootContext.Provider value={value}>{children}</BootContext.Provider>;
}

export function useBootReady(): boolean {
  const ctx = useContext(BootContext);
  return ctx?.ready ?? false;
}

export function useBootMarkReady(): () => void {
  const ctx = useContext(BootContext);
  return ctx?.markReady ?? (() => {});
}
