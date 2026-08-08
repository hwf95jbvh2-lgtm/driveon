```tsx
import { useEffect, useState } from 'react';
import {
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  GripVertical,
  ChevronDown,
  ChevronUp,
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
  width: string;
  paddingTop: number;
  paddingBottom: number;
  marginTop: number;
  marginBottom: number;
  gap: number;
  background: string;
  borderRadius: number;
  contentAlign: 'left' | 'center' | 'right';
}

const DEFAULT_LAYOUT: SectionLayout = {
  width: '100%',
  paddingTop: 0,
  paddingBottom: 0,
  marginTop: 0,
  marginBottom: 0,
  gap: 16,
  background: '',
  borderRadius: 0,
  contentAlign: 'left',
};

function getLayout(section: PageSectionRow): SectionLayout {
  if (!section.content_json || typeof section.content_json !== 'object') {
    return { ...DEFAULT_LAYOUT };
  }

  const content = section.content_json as Record<string, unknown>;

  if (!content.layout || typeof content.layout !== 'object') {
    return { ...DEFAULT_LAYOUT };
  }

  const layout = content.layout as Record<string, unknown>;

  return {
    width:
      typeof layout.width === 'string'
        ? layout.width
        : DEFAULT_LAYOUT.width,

    paddingTop:
      typeof layout.paddingTop === 'number'
        ? layout.paddingTop
        : DEFAULT_LAYOUT.paddingTop,

    paddingBottom:
      typeof layout.paddingBottom === 'number'
        ? layout.paddingBottom
        : DEFAULT_LAYOUT.paddingBottom,

    marginTop:
      typeof layout.marginTop === 'number'
        ? layout.marginTop
        : DEFAULT_LAYOUT.marginTop,

    marginBottom:
      typeof layout.marginBottom === 'number'
        ? layout.marginBottom
        : DEFAULT_LAYOUT.marginBottom,

    gap:
      typeof layout.gap === 'number'
        ? layout.gap
        : DEFAULT_LAYOUT.gap,

    background:
      typeof layout.background === 'string'
        ? layout.background
        : DEFAULT_LAYOUT.background,

    borderRadius:
      typeof layout.borderRadius === 'number'
        ? layout.borderRadius
        : DEFAULT_LAYOUT.borderRadius,

    contentAlign:
      layout.contentAlign === 'center' ||
      layout.contentAlign === 'right' ||
      layout.contentAlign === 'left'
        ? layout.contentAlign
        : DEFAULT_LAYOUT.contentAlign,
  };
}

function setLayout(
  section: PageSectionRow,
  layout: SectionLayout,
): unknown {
  const current =
    section.content_json &&
    typeof section.content_json === 'object'
      ? (section.content_json as Record<string, unknown>)
      : {};

  return {
    ...current,
    layout,
  };
}

export function AdminSectionsPage() {
  const { notify } = useToast();

  const [sections, setSections] = useState<PageSectionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [savingId, setSavingId] = useState<string | null>(null);

  const [draggedId, setDraggedId] = useState<string | null>(null);

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
    load();
  }, []);

  const toggleVisible = async (section: PageSectionRow) => {
    try {
      await updatePageSection(section.id, {
        visible: !section.visible,
      });

      setSections((current) =>
        current.map((item) =>
          item.id === section.id
            ? { ...item, visible: !item.visible }
            : item,
        ),
      );

      notify(section.visible ? 'Блок скрыт' : 'Блок показан');
    } catch {
      notify('Не удалось изменить видимость', 'error');
    }
  };

  const updateLayout = async (
    section: PageSectionRow,
    changes: Partial<SectionLayout>,
  ) => {
    const currentLayout = getLayout(section);

    const nextLayout: SectionLayout = {
      ...currentLayout,
      ...changes,
    };

    setSections((current) =>
      current.map((item) =>
        item.id === section.id
          ? {
              ...item,
              content_json: setLayout(item, nextLayout),
            }
          : item,
      ),
    );
  };

  const saveLayout = async (section: PageSectionRow) => {
    setSavingId(section.id);

    try {
      const layout = getLayout(section);

      await updatePageSection(section.id, {
        content_json: setLayout(section, layout),
      });

      notify('Настройки блока сохранены');
    } catch {
      notify('Не удалось сохранить настройки', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const moveSection = async (
    sectionId: string,
    targetIndex: number,
  ) => {
    const currentIndex = sections.findIndex(
      (item) => item.id === sectionId,
    );

    if (currentIndex === -1 || currentIndex === targetIndex) {
      return;
    }

    const reordered = [...sections];

    const [moved] = reordered.splice(currentIndex, 1);

    reordered.splice(targetIndex, 0, moved);

    const updated = reordered.map((section, index) => ({
      ...section,
      sort_order: index,
    }));

    setSections(updated);

    try {
      await Promise.all(
        updated.map((section) =>
          updatePageSection(section.id, {
            sort_order: section.sort_order,
          }),
        ),
      );

      notify('Порядок блоков сохранён');
    } catch {
      notify('Не удалось изменить порядок', 'error');
      await load();
    }
  };

  const duplicate = async (section: PageSectionRow) => {
    try {
      await createPageSection({
        section_key: `${section.section_key}-copy-${Date.now()}`,
        title: `${section.title} (копия)`,
        subtitle: section.subtitle,
        sort_order: section.sort_order + 1,
        visible: false,
        content_json: section.content_json,
      });

      notify('Блок скопирован');

      await load();
    } catch {
      notify('Не удалось скопировать блок', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deletePageSection(deleteId);

      notify('Блок удалён');

      setDeleteId(null);

      await load();
    } catch {
      notify('Не удалось удалить блок', 'error');
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    id: string,
  ) => {
    setDraggedId(id);

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    targetId: string,
  ) => {
    event.preventDefault();

    const sourceId =
      draggedId || event.dataTransfer.getData('text/plain');

    setDraggedId(null);

    if (!sourceId || sourceId === targetId) {
      return;
    }

    const sourceIndex = sections.findIndex(
      (section) => section.id === sourceId,
    );

    const targetIndex = sections.findIndex(
      (section) => section.id === targetId,
    );

    if (sourceIndex === -1 || targetIndex === -1) {
      return;
    }

    await moveSection(sourceId, targetIndex);
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title="Блоки сайта"
          description="Управление секциями главной страницы"
        />

        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-ink-500" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Блоки сайта"
        description="Перетаскивайте блоки, меняйте размеры, отступы и оформление."
      />

      <div className="mb-6 rounded-2xl bg-pearl-100 px-5 py-4 ring-1 ring-ink-200/60">
        <div className="flex items-start gap-3">
          <GripVertical className="mt-0.5 h-5 w-5 shrink-0 text-ink-500" />

          <div>
            <p className="font-semibold text-ink-900">
              Редактор блоков
            </p>

            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              Перетаскивайте блоки за значок слева. Нажмите
              «Настройки», чтобы изменить ширину, отступы,
              фон и другие параметры.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sections.map((section, index) => {
          const layout = getLayout(section);
          const expanded = expandedId === section.id;
          const saving = savingId === section.id;

          return (
            <div
              key={section.id}
              draggable
              onDragStart={(event) =>
                handleDragStart(event, section.id)
              }
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) =>
                handleDrop(event, section.id)
              }
              className={`overflow-hidden rounded-2xl ring-1 ring-ink-200/60 transition ${
                draggedId === section.id
                  ? 'opacity-50'
                  : ''
              } ${
                section.visible
                  ? 'bg-pearl-50'
                  : 'bg-pearl-100/50 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3 p-4">
                <div
                  className="flex h-10 w-8 cursor-grab items-center justify-center rounded-lg text-ink-400 hover:bg-ink-900/5 active:cursor-grabbing"
                  title="Перетащить блок"
                >
                  <GripVertical className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
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

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {section.subtitle && (
                      <span className="text-sm text-ink-500">
                        {section.subtitle}
                      </span>
                    )}

                    <span className="font-mono text-xs text-ink-400">
                      {section.section_key}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      toggleVisible(section)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
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
                      setExpandedId(
                        expanded
                          ? null
                          : section.id,
                      )
                    }
                    className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-ink-700 hover:bg-ink-900/5"
                  >
                    Настройки

                    {expanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      duplicate(section)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
                    title="Дублировать"
                  >
                    <Copy className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeleteId(section.id)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-orange-600 hover:bg-orange-500/10"
                    title="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {expanded && (
                <div className="border-t border-ink-200/60 bg-pearl-100/40 p-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink-800">
                        Ширина блока
                      </span>

                      <select
                        value={layout.width}
                        onChange={(event) =>
                          updateLayout(
                            section,
                            {
                              width:
                                event.target.value,
                            },
                          )
                        }
                        className="w-full rounded-xl border border-ink-200 bg-pearl-50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-500"
                      >
                        <option value="100%">
                          100%
                        </option>

                        <option value="90%">
                          90%
                        </option>

                        <option value="80%">
                          80%
                        </option>

                        <option value="75%">
                          75%
                        </option>

                        <option value="66.6667%">
                          66%
                        </option>

                        <option value="50%">
                          50%
                        </option>

                        <option value="1200px">
                          1200 px
                        </option>

                        <option value="1000px">
                          1000 px
                        </option>

                        <option value="900px">
                          900 px
                        </option>

                        <option value="800px">
                          800 px
                        </option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink-800">
                        Верхний отступ
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={layout.paddingTop}
                        onChange={(event) =>
                          updateLayout(
                            section,
                            {
                              paddingTop:
                                Number(
                                  event.target
                                    .value,
                                ),
                            },
                          )
                        }
                        className="w-full rounded-xl border border-ink-200 bg-pearl-50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-500"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink-800">
                        Нижний отступ
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={
                          layout.paddingBottom
                        }
                        onChange={(event) =>
                          updateLayout(
                            section,
                            {
                              paddingBottom:
                                Number(
                                  event.target
                                    .value,
                                ),
                            },
                          )
                        }
                        className="w-full rounded-xl border border-ink-200 bg-pearl-50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-500"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink-800">
                        Отступ сверху
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={layout.marginTop}
                        onChange={(event) =>
                          updateLayout(
                            section,
                            {
                              marginTop:
                                Number(
                                  event.target
                                    .value,
                                ),
                            },
                          )
                        }
                        className="w-full rounded-xl border border-ink-200 bg-pearl-50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-500"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink-800">
                        Отступ снизу
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={
                          layout.marginBottom
                        }
                        onChange={(event) =>
                          updateLayout(
                            section,
                            {
                              marginBottom:
                                Number(
                                  event.target
                                    .value,
                                ),
                            },
                          )
                        }
                        className="w-full rounded-xl border border-ink-200 bg-pearl-50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-500"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink-800">
                        Расстояние внутри
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={layout.gap}
                        onChange={(event) =>
                          updateLayout(
                            section,
                            {
                              gap: Number(
                                event.target.value,
                              ),
                            },
                          )
                        }
                        className="w-full rounded-xl border border-ink-200 bg-pearl-50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-500"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink-800">
                        Скругление
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          layout.borderRadius
                        }
                        onChange={(event) =>
                          updateLayout(
                            section,
                            {
                              borderRadius:
                                Number(
                                  event.target
                                    .value,
                                ),
                            },
                          )
                        }
                        className="w-full rounded-xl border border-ink-200 bg-pearl-50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-500"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink-800">
                        Выравнивание
                      </span>

                      <select
                        value={
                          layout.contentAlign
                        }
                        onChange={(event) =>
                          updateLayout(
                            section,
                            {
                              contentAlign:
                                event.target
                                  .value as SectionLayout['contentAlign'],
                            },
                          )
                        }
                        className="w-full rounded-xl border border-ink-200 bg-pearl-50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-500"
                      >
                        <option value="left">
                          Слева
                        </option>

                        <option value="center">
                          По центру
                        </option>

                        <option value="right">
                          Справа
                        </option>
                      </select>
                    </label>

                    <label className="block md:col-span-2 lg:col-span-1">
                      <span className="mb-2 block text-sm font-medium text-ink-800">
                        Фон
                      </span>

                      <input
                        type="text"
                        value={layout.background}
                        onChange={(event) =>
                          updateLayout(
                            section,
                            {
                              background:
                                event.target.value,
                            },
                          )
                        }
                        placeholder="Например #F5F1E8"
                        className="w-full rounded-xl border border-ink-200 bg-pearl-50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-500"
                      />
                    </label>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        saveLayout(section)
                      }
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-50"
                    >
                      {saving ? (
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
