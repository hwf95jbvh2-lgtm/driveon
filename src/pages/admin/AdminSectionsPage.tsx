```tsx
import { useEffect, useState } from 'react';
import {
  Loader2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
} from 'lucide-react';

import {
  fetchPageSections,
  updatePageSection,
  deletePageSection,
  createPageSection,
} from '@/lib/data';

import type { PageSectionRow } from '@/types';

import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { ConfirmDialog } from '@/components/admin/Dialogs';
import { useToast } from '@/components/admin/Toast';

export function AdminSectionsPage() {
  const { notify } = useToast();

  const [sections, setSections] = useState<PageSectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);

    try {
      const data = await fetchPageSections();
      setSections(data);
    } catch {
      notify('Не удалось загрузить секции', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const toggleVisible = async (section: PageSectionRow) => {
    try {
      await updatePageSection(section.id, {
        visible: !section.visible,
      });

      notify(section.visible ? 'Скрыто' : 'Показано');
      await load();
    } catch {
      notify('Не удалось изменить', 'error');
    }
  };

  const move = async (
    index: number,
    direction: 'up' | 'down',
  ) => {
    const swapIndex =
      direction === 'up' ? index - 1 : index + 1;

    if (
      swapIndex < 0 ||
      swapIndex >= sections.length
    ) {
      return;
    }

    const a = sections[index];
    const b = sections[swapIndex];

    try {
      await updatePageSection(a.id, {
        sort_order: b.sort_order,
      });

      await updatePageSection(b.id, {
        sort_order: a.sort_order,
      });

      await load();
    } catch {
      notify('Не удалось переместить', 'error');
    }
  };

  const duplicate = async (
    section: PageSectionRow,
  ) => {
    try {
      await createPageSection({
        section_key: `${section.section_key}-copy-${Date.now()}`,
        title: `${section.title} (копия)`,
        subtitle: section.subtitle,
        sort_order: section.sort_order + 1,
        visible: false,
        content_json: section.content_json,
      });

      notify('Секция дублирована');
      await load();
    } catch {
      notify('Не удалось дублировать', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }

    try {
      await deletePageSection(deleteId);

      notify('Удалено');
      await load();
    } catch {
      notify('Не удалось удалить', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Секции главной страницы"
        description="Управление блоками главной страницы"
      />

      <div className="flex flex-col gap-2">
        {sections.length === 0 ? (
          <div className="rounded-2xl bg-pearl-50 p-8 text-center text-sm text-ink-500 ring-1 ring-ink-200/60">
            Секции пока не добавлены.
          </div>
        ) : (
          sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex items-center gap-3 rounded-2xl p-4 ring-1 ring-ink-200/60 ${
                section.visible
                  ? 'bg-pearl-50'
                  : 'bg-pearl-100/50 opacity-60'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => move(index, 'up')}
                  disabled={index === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5 disabled:opacity-30"
                  title="Переместить вверх"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => move(index, 'down')}
                  disabled={
                    index === sections.length - 1
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5 disabled:opacity-30"
                  title="Переместить вниз"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display font-semibold text-ink-900">
                    {section.title}
                  </span>

                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      section.visible
                        ? 'bg-teal-500/15 text-teal-800'
                        : 'bg-orange-500/10 text-orange-700'
                    }`}
                  >
                    {section.visible
                      ? 'Видим'
                      : 'Скрыт'}
                  </span>
                </div>

                {section.subtitle && (
                  <div className="mt-1 text-sm text-ink-500">
                    {section.subtitle}
                  </div>
                )}

                <div className="mt-1 font-mono text-xs text-ink-400">
                  {section.section_key}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    toggleVisible(section)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
                  title={
                    section.visible
                      ? 'Скрыть'
                      : 'Показать'
                  }
                >
                  {section.visible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    duplicate(section)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
                  title="Дублировать"
                >
                  <Copy className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDeleteId(section.id)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-600 hover:bg-orange-500/10"
                  title="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить блок?"
        message="Удалить эту секцию? Отменить действие будет невозможно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
```
