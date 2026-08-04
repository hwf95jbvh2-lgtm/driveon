import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { ContentRow } from '@/types';

interface ContentContextValue {
  content: Record<string, string>;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue>({
  content: {},
  loading: true,
  refresh: async () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data } = await supabase.from('site_content').select('*');
    if (data) {
      const map: Record<string, string> = {};
      (data as ContentRow[]).forEach((row) => {
        map[row.content_key] = row.content_value;
      });
      setContent(map);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.from('site_content').select('*');
        if (mounted && data) {
          const map: Record<string, string> = {};
          (data as ContentRow[]).forEach((row) => {
            map[row.content_key] = row.content_value;
          });
          setContent(map);
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}

/** Helper hook: get a single content value by key with a fallback */
export function useContentValue(key: string, fallback: string): string {
  const { content } = useContent();
  return content[key] ?? fallback;
}
