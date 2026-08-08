import { useEffect, useState } from 'react';
import {
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  GripVertical,
  Save,
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

interface SectionLayout {
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
}

interface EditableSection extends PageSectionRow {
  layout: SectionLayout;
}

const defaultLayout: SectionLayout = {
  width: '100%',
  maxWidth: '1200px',
  minHeight: '',
  paddingTop: 64,
  paddingBottom: 64,
  marginTop: 0,
  marginBottom: 0,
  gap: 16,
  align: 'left',
  columns: 1,
};

function getLayout(section: PageSectionRow): SectionLayout {
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
      return {
        ...defaultLayout,
        ...(content.layout as SectionLayout),
      };
    }
  }

  return { ...defaultLayout };
}

function getContentWithLayout(
  section: EditableSection,
  layout: SectionLayout,
) {
  let content: Record<string, unknown> = {};

  if (
    section.content_json &&
    typeof section.content_json === 'object' &&
    !Array.isArray(section.content_json)
  ) {
    content = section.content_json as Record<string, unknown>;
  }

  return {
    ...content,
    layout,
  };
}

export function AdminSectionsPage() {
  const { notify } = useToast();

  const [sections, setSections] = useState<EditableSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);

    try {
      const data = await fetchPageSections();

      setSections(
        data.map((section) => ({
          ...section,
          layout: getLayout(section),
        })),
      );
    } catch {
      notify('Не удалось загрузить секции', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateLayout = (
    id: string,
    key: keyof SectionLayout,
    value: string | number,
  ) => {
    setSections((current) =>
      current.map((section) =>
        section.id === id
          ? {
              ...section,
              layout: {
                ...section.layout,
                [key]: value,
              },
            }
          : section,
      ),
    );
  };

  const saveLayout = async (section: EditableSection) => {
    setSaving(section.id);

    try {
      await updatePageSection(section.id, {
        content_json: getContentWithLayout(section, section.layout),
      });

      notify('Настройки блока сохранены');
    } catch {
      notify('Не удалось сохранить настройки', 'error');
    } finally {
      setSaving(null);
    }
  };

  const toggleVisible = async (section: EditableSection) => {
    try {
      await updatePageSection(section.id, {
        visible: !section.visible,
      });

      setSections((current) =>
        current.map((item) =>
          item.id === section.id
            ? {
                ...item,
                visible: !item.visible,
              }
            : item,
        ),
      );

      notify(section.visible ? 'Блок скрыт' : 'Блок показан');
    } catch {
      notify('Не удалось изменить видимость', 'error');
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    targetId: string,
  ) => {
    event.preventDefault();

    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const draggedIndex = sections.findIndex(
      (section) => section.id === draggedId,
    );

    const targetIndex = sections.findIndex(
      (section) => section.id === targetId,
    );

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      return;
    }

    const reordered = [...sections];
    const [dragged] = reordered.splice(draggedIndex, 1);

    reordered.splice(targetIndex, 0, dragged);

    setSections(reordered);
    setDraggedId(null);

    try {
      await Promise.all(
        reordered.map((section, index) =>
          updatePageSection(section.id, {
            sort_order: index + 1,
          }),
        ),
      );

      notify('Порядок блоков сохранён');
    } catch {
      notify('Не удалось сохранить порядок', 'error');
      await load();
    }
  };

  const duplicate = async (section: EditableSection) => {
    try {
      await createPageSection({
        section_key: `${section.section_key}-copy-${Date.now()}`,
        title: `${section.title} (копия)`,
        subtitle: section.subtitle,
        sort_order: section.sort_order + 1,
        visible: false,
        content_json: getContentWithLayout(section, section.layout),
      });

      notify('Блок дублирован');
      await load();
    } catch {
      notify('Не удалось дублировать блок', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deletePageSection(deleteId);

      notify('Блок удалён');
      setSelectedId(null);

      await load();
    } catch {
      notify('Не удалось удалить блок', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-ink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Конструктор страницы"
        description="Перетаскивайте блоки, меняйте размеры и отступы."
      />

      <div className="rounded-2xl bg-orange-50 px-5 py-4 ring-1 ring-orange-200">
        <p className="text-sm text-orange-900">
          <strong>Конструктор:</strong> перетащите блок в нужное место.
          Нажмите на блок, чтобы открыть настройки размеров и отступов.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => {
          const selected = selectedId === section.id;
          const dragging = draggedId === section.id;

          return (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(section.id)}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, section.id)}
              className={`overflow-hidden rounded-2xl bg-pearl-50 ring-1 transition ${
                selected
                  ? 'ring-2 ring-orange-500'
                  : 'ring-ink-200/70'
              } ${
                dragging
                  ? 'opacity-40'
                  : 'opacity-100'
              }`}
            >
              <div
                className="flex cursor-pointer items-center gap-3 px-4 py-4"
                onClick={() =>
                  setSelectedId(selected ? null : section.id)
                }
              >
                <div
                  className="flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-xl bg-ink-900/5 text-ink-500 active:cursor-grabbing"
                  title="Перетащить блок"
                >
                  <GripVertical className="h-5 w-5" />
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="text-sm font-medium text-ink-400">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-semibold text-ink-900">
                        {section.title}
                      </span>

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          section.visible
                            ? 'bg-teal-500/15 text-teal-800'
                            : 'bg-orange-500/10 text-orange-700'
                        }`}
                      >
                        {section.visible ? 'Видим' : 'Скрыт'}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="font-mono text-xs text-ink-400">
                        {section.section_key}
                      </span>

                      <span className="text-xs text-ink-400">
                        {section.layout.width || '100%'}
                      </span>

                      <span className="text-xs text-ink-400">
                        PT {section.layout.paddingTop}px
                      </span>

                      <span className="text-xs text-ink-400">
                        PB {section.layout.paddingBottom}px
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleVisible(section);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
                    title={section.visible ? 'Скрыть' : 'Показать'}
                  >
                    {section.visible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      duplicate(section);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
                    title="Дублировать"
                  >
                    <Copy className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDeleteId(section.id);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-orange-600 hover:bg-orange-500/10"
                    title="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {selected && (
                <div className="border-t border-ink-200/60 bg-pearl-100/50 px-5 py-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-ink-800">
                        Ширина блока
                      </span>

                      <select
                        value={section.layout.width || '100%'}
                        onChange={(event) =>
                          updateLayout(
                            section.id,
                            'width',
                            event.target.value,
                          )
                        }
                        className="h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-orange-500"
                      >
                        <option value="100%">100%</option>
                        <option value="90%">90%</option>
                        <option value="80%">80%</option>
                        <option value="75%">75%</option>
                        <option value="66.666%">66%</option>
                        <option value="50%">50%</option>
                      </select>
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-ink-800">
                        Максимальная ширина
                      </span>

                      <select
                        value={section.layout.maxWidth || '1200px'}
                        onChange={(event) =>
                          updateLayout(
                            section.id,
                            'maxWidth',
                            event.target.value,
                          )
                        }
                        className="h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-orange-500"
                      >
                        <option value="100%">Без ограничения</option>
                        <option value="1400px">1400 px</option>
                        <option value="1200px">1200 px</option>
                        <option value="1000px">1000 px</option>
                        <option value="900px">900 px</option>
                        <option value="800px">800 px</option>
                        <option value="700px">700 px</option>
                        <option value="600px">600 px</option>
                      </select>
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-ink-800">
                        Выравнивание
                      </span>

                      <select
                        value={section.layout.align || 'left'}
                        onChange={(event) =>
                          updateLayout(
                            section.id,
                            'align',
                            event.target.value as
                              | 'left'
                              | 'center'
                              | 'right',
                          )
                        }
                        className="h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-orange-500"
                      >
                        <option value="left">Слева</option>
                        <option value="center">По центру</option>
                        <option value="right">Справа</option>
                      </select>
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-ink-800">
                        Отступ сверху
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={section.layout.paddingTop ?? 64}
                        onChange={(event) =>
                          updateLayout(
                            section.id,
                            'paddingTop',
                            Number(event.target.value),
                          )
                        }
                        className="h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-orange-500"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-ink-800">
                        Отступ снизу
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={section.layout.paddingBottom ?? 64}
                        onChange={(event) =>
                          updateLayout(
                            section.id,
                            'paddingBottom',
                            Number(event.target.value),
                          )
                        }
                        className="h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-orange-500"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-ink-800">
                        Расстояние между элементами
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={section.layout.gap ?? 16}
                        onChange={(event) =>
                          updateLayout(
                            section.id,
                            'gap',
                            Number(event.target.value),
                          )
                        }
                        className="h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-orange-500"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-ink-800">
                        Внешний отступ сверху
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={section.layout.marginTop ?? 0}
                        onChange={(event) =>
                          updateLayout(
                            section.id,
                            'marginTop',
                            Number(event.target.value),
                          )
                        }
                        className="h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-orange-500"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-ink-800">
                        Внешний отступ снизу
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={section.layout.marginBottom ?? 0}
                        onChange={(event) =>
                          updateLayout(
                            section.id,
                            'marginBottom',
                            Number(event.target.value),
                          )
                        }
                        className="h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-orange-500"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-ink-800">
                        Минимальная высота
                      </span>

                      <select
                        value={section.layout.minHeight || ''}
                        onChange={(event) =>
                          updateLayout(
                            section.id,
                            'minHeight',
                            event.target.value,
                          )
                        }
                        className="h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-orange-500"
                      >
                        <option value="">Автоматически</option>
                        <option value="200px">200 px</option>
                        <option value="300px">300 px</option>
                        <option value="400px">400 px</option>
                        <option value="500px">500 px</option>
                        <option value="600px">600 px</option>
                        <option value="700px">700 px</option>
                      </select>
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-ink-800">
                        Колонки
                      </span>

                      <select
                        value={section.layout.columns || 1}
                        onChange={(event) =>
                          updateLayout(
                            section.id,
                            'columns',
                            Number(event.target.value),
                          )
                        }
                        className="h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-orange-500"
                      >
                        <option value="1">1 колонка</option>
                        <option value="2">2 колонки</option>
                        <option value="3">3 колонки</option>
                        <option value="4">4 колонки</option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => saveLayout(section)}
                      disabled={saving === section.id}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-ink-900 px-4 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-50"
                    >
                      {saving === section.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}

                      Сохранить настройки
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sections.length === 0 && (
        <div className="rounded-2xl bg-pearl-50 p-8 text-center ring-1 ring-ink-200/60">
          <p className="text-ink-500">
            Блоки страницы пока не добавлены.
          </p>
        </div>
      )}

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
