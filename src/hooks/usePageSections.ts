import { useEffect, useState } from 'react';
import { fetchPageSections } from '@/lib/data';
import type { PageSectionRow } from '@/types';

export function usePageSections() {
  const [sections, setSections] = useState<PageSectionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchPageSections();
        if (mounted) setSections(data);
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

  return { sections, loading };
}
