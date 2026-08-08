import { useCallback, useEffect, useState } from 'react';
import {
  fetchPageSections,
  updatePageSection,
} from '@/lib/data';
import type { PageSectionRow } from '@/types';

export function usePageSections() {
  const [sections, setSections] = useState<PageSectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchPageSections();
      setSections(data);
    } catch {
      // Не ломаем сайт, если база временно недоступна.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await fetchPageSections();

        if (mounted) {
          setSections(data);
        }
      } catch {
        // ignore
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

  /**
   * Изменение порядка секций.
   */
  const moveSection = useCallback(
    async (sectionId: string, direction: 'up' | 'down') => {
      const currentIndex = sections.findIndex(
        (section) => section.id === sectionId,
      );

      if (currentIndex === -1) return;

      const targetIndex =
        direction === 'up'
          ? currentIndex - 1
          : currentIndex + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= sections.length
      ) {
        return;
      }

      const current = sections[currentIndex];
      const target = sections[targetIndex];

      setSaving(true);

      try {
        await updatePageSection(current.id, {
          sort_order: target.sort_order,
        });

        await updatePageSection(target.id, {
          sort_order: current.sort_order,
        });

        const updated = [...sections];

        updated[currentIndex] = target;
        updated[targetIndex] = current;

        setSections(updated);
      } finally {
        setSaving(false);
      }
    },
    [sections],
  );

  /**
   * Перемещение секции в конкретную позицию.
   * Это понадобится для drag & drop.
   */
  const moveSectionTo = useCallback(
    async (sectionId: string, targetIndex: number) => {
      const currentIndex = sections.findIndex(
        (section) => section.id === sectionId,
      );

      if (currentIndex === -1) return;

      if (
        targetIndex < 0 ||
        targetIndex >= sections.length
      ) {
        return;
      }

      if (currentIndex === targetIndex) return;

      const reordered = [...sections];
      const [movedSection] = reordered.splice(currentIndex, 1);

      reordered.splice(targetIndex, 0, movedSection);

      setSaving(true);

      try {
        /*
         * Перезаписываем sort_order последовательными значениями.
         * Так drag & drop не будет зависеть от старых значений.
         */
        for (let index = 0; index < reordered.length; index += 1) {
          const section = reordered[index];

          await updatePageSection(section.id, {
            sort_order: index,
          });
        }

        setSections(reordered);
      } finally {
        setSaving(false);
      }
    },
    [sections],
  );

  /**
   * Изменение видимости секции.
   */
  const toggleSection = useCallback(
    async (sectionId: string) => {
      const section = sections.find(
        (item) => item.id === sectionId,
      );

      if (!section) return;

      setSaving(true);

      try {
        await updatePageSection(section.id, {
          visible: !section.visible,
        });

        setSections((current) =>
          current.map((item) =>
            item.id === sectionId
              ? {
                  ...item,
                  visible: !item.visible,
                }
              : item,
          ),
        );
      } finally {
        setSaving(false);
      }
    },
    [sections],
  );

  return {
    sections,
    loading,
    saving,
    reload: load,
    moveSection,
    moveSectionTo,
    toggleSection,
  };
}
