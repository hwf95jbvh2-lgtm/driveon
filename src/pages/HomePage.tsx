import { useState } from 'react';
import { Settings, Eye, EyeOff, GripVertical } from 'lucide-react';

import { usePageSections } from '@/hooks/usePageSections';

import { Hero } from '@/components/sections/Hero';
import { ExamsSection } from '@/components/sections/ExamsSection';
import { WhereSection } from '@/components/sections/WhereSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { UsefulSection } from '@/components/sections/UsefulSection';
import { TelegramSection } from '@/components/sections/TelegramSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { DisclaimerSection } from '@/components/sections/DisclaimerSection';

const sectionMap: Record<string, React.ComponentType> = {
  hero: Hero,
  exams: ExamsSection,
  where: WhereSection,
  experience: ExperienceSection,
  useful: UsefulSection,
  telegram: TelegramSection,
  about: AboutSection,
  disclaimer: DisclaimerSection,
};

const sectionNames: Record<string, string> = {
  hero: 'Главный экран',
  exams: 'Экзамены',
  where: 'Где проходит экзамен',
  experience: 'Опыт сдающих',
  useful: 'Полезная информация',
  telegram: 'Telegram',
  about: 'О сервисе',
  disclaimer: 'Дисклеймер',
};

export function HomePage() {
  const {
    sections,
    loading,
    saving,
    moveSectionTo,
    toggleSection,
  } = usePageSections();

  const [editMode, setEditMode] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const visibleSections = sections.filter((section) => section.visible);

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    sectionId: string,
  ) => {
    setDraggedId(sectionId);

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', sectionId);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    sectionId: string,
  ) => {
    event.preventDefault();

    if (!draggedId || draggedId === sectionId) {
      return;
    }

    setDragOverId(sectionId);
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    sectionId: string,
  ) => {
    event.preventDefault();

    const sourceId =
      event.dataTransfer.getData('text/plain') || draggedId;

    if (!sourceId || sourceId === sectionId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const targetIndex = visibleSections.findIndex(
      (section) => section.id === sectionId,
    );

    if (targetIndex === -1) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    await moveSectionTo(sourceId, targetIndex);

    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <>
      {/* Панель редактора */}
      <div
        className={`fixed right-5 top-5 z-[100] transition-all ${
          editMode ? 'w-[280px]' : 'w-auto'
        }`}
      >
        {!editMode ? (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-ink-800"
          >
            <Settings className="h-4 w-4" />
            Редактировать
          </button>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
            <div className="flex items-center justify-between border-b border-ink-200 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-ink-900">
                  Редактор сайта
                </div>

                <div className="text-xs text-ink-500">
                  Перетаскивайте блоки мышкой
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="rounded-lg px-2 py-1 text-xs font-medium text-ink-500 hover:bg-ink-900/5"
              >
                Готово
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-2">
              {sections.map((section) => {
                const isVisible = section.visible;

                return (
                  <div
                    key={section.id}
                    className="mb-1 flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-ink-900/5"
                  >
                    <GripVertical className="h-4 w-4 shrink-0 text-ink-300" />

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink-800">
                        {sectionNames[section.section_key] ||
                          section.title ||
                          section.section_key}
                      </div>

                      <div className="truncate text-[11px] text-ink-400">
                        {section.section_key}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => toggleSection(section.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-900/5"
                      title={isVisible ? 'Скрыть' : 'Показать'}
                    >
                      {isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {saving && (
              <div className="border-t border-ink-200 px-4 py-2 text-xs text-ink-500">
                Сохраняем изменения...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Сайт */}
      <div>
        {visibleSections.map((section) => {
          const Component = sectionMap[section.section_key];

          if (!Component) {
            return null;
          }

          const isDragging = draggedId === section.id;
          const isDragOver = dragOverId === section.id;

          return (
            <div
              key={section.id}
              draggable={editMode}
              onDragStart={(event) =>
                handleDragStart(event, section.id)
              }
              onDragOver={(event) =>
                handleDragOver(event, section.id)
              }
              onDrop={(event) =>
                handleDrop(event, section.id)
              }
              onDragEnd={handleDragEnd}
              className={`relative transition-all ${
                editMode
                  ? 'group cursor-move outline outline-1 outline-transparent hover:outline-2 hover:outline-orange-500'
                  : ''
              } ${
                isDragging ? 'opacity-40' : ''
              } ${
                isDragOver
                  ? 'border-t-4 border-orange-500'
                  : ''
              }`}
            >
              {editMode && (
                <div className="pointer-events-none absolute left-4 top-4 z-50 flex items-center gap-2 rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                  <GripVertical className="h-3.5 w-3.5" />

                  {sectionNames[section.section_key] ||
                    section.title ||
                    section.section_key}
                </div>
              )}

              {editMode && (
                <div className="absolute right-4 top-4 z-50 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink-700 shadow-lg ring-1 ring-black/10 hover:bg-ink-50"
                    title="Скрыть блок"
                  >
                    <EyeOff className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink-700 shadow-lg ring-1 ring-black/10 hover:bg-ink-50"
                    title="Настройки блока"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              )}

              <Component />
            </div>
          );
        })}
      </div>
    </>
  );
}
