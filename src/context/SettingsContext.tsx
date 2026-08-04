import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchSettings } from '@/lib/data';
import type { SettingsRow } from '@/types';

interface SettingsContextValue {
  settings: SettingsRow | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: null,
  loading: true,
  refresh: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsRow | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const s = await fetchSettings();
    setSettings(s);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await fetchSettings();
        if (mounted) setSettings(s);
      } catch {
        // fall back to defaults
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
