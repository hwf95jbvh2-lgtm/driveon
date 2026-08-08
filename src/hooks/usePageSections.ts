import { useEffect, useState, useCallback } from 'react';
import { fetchPageSections } from '@/lib/data';
import type { PageSectionRow } from '@/types';

export interface PageSectionWithLayout extends PageSectionRow {
  layout?: {
    width?: string;
    maxWidth?: string;
    minHeight?: string;
    paddingTop?: number;
    paddingBottom?: number;
    marginTop?: number;
    marginBottom?: number;
    gap?: number;
    align?: 'left' | 'center' | 'right';
    columns?: number;
  };
}

export function usePageSections() {
  const [sections, setSections] = useState<PageSectionWithLayout[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSections = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchPageSections();

      const normalized = data.map((section) => {
        let layout: PageSectionWithLayout['layout'] = undefined;

        if (
          section.content_json &&
          typeof section.content_json === 'object' &&
          !Array.isArray(section.content_json)
        ) {
          const content = section.content_json as Record<string, unknown>;

          if (
            content.layout &&
            typeof content.layout === 'object' &&
            !Array.isArray(content.layout)
          ) {
            layout = content.layout as PageSectionWithLayout['layout'];
          }
        }

        return {
          ...section,
          layout,
        };
      });

      setSections(normalized);
    } catch {
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await fetchPageSections();

        if (!mounted) return;

        const normalized = data.map((section) => {
          let layout: PageSectionWithLayout['layout'] = undefined;

          if (
            section.content_json &&
            typeof section.content_json === 'object' &&
            !Array.isArray(section.content_json)
          ) {
            const content = section.content_json as Record<string, unknown>;

            if (
              content.layout &&
              typeof content.layout === 'object' &&
              !Array.isArray(content.layout)
            ) {
              layout = content.layout as PageSectionWithLayout['layout'];
            }
          }

          return {
            ...section,
            layout,
          };
        });

        setSections(normalized);
      } catch {
        if (mounted) {
          setSections([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    sections,
    loading,
    reload: loadSections,
  };
}
