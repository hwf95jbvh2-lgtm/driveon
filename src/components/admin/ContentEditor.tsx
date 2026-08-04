import { useRef } from 'react';
import { Bold, Heading, List, Link as LinkIcon, ListOrdered, Pilcrow } from 'lucide-react';
import type { UsefulSection } from '@/types';

interface ContentEditorProps {
  sections: UsefulSection[];
  onChange: (sections: UsefulSection[]) => void;
}

/**
 * A simple structured content editor. Each "section" has a heading and either
 * a set of cards (title + text) or a bullet list. This avoids a heavy WYSIWYG
 * dependency while still letting the admin add headings, lists, bold text and
 * links through a lightweight rich-text area for card/list items.
 */
export function ContentEditor({ sections, onChange }: ContentEditorProps) {
  const update = (index: number, patch: Partial<UsefulSection>) => {
    const next = sections.map((s, i) => (i === index ? { ...s, ...patch } : s));
    onChange(next);
  };

  const addSection = () => {
    onChange([...sections, { heading: '', list: [''] }]);
  };

  const removeSection = (index: number) => {
    onChange(sections.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section, sIndex) => (
        <div
          key={sIndex}
          className="rounded-2xl border border-ink-200/60 bg-pearl-100/50 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Раздел {sIndex + 1}
            </span>
            <button
              type="button"
              onClick={() => removeSection(sIndex)}
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              Удалить раздел
            </button>
          </div>

          <input
            type="text"
            value={section.heading}
            onChange={(e) => update(sIndex, { heading: e.target.value })}
            placeholder="Заголовок раздела"
            className="mb-4 w-full rounded-xl border border-ink-200 bg-pearl-50 px-4 py-2.5 font-display font-semibold text-ink-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          />

          {/* Type toggle */}
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() =>
                update(sIndex, {
                  cards: section.cards ?? [{ title: '', text: '' }],
                  list: undefined,
                })
              }
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                section.cards
                  ? 'bg-ink-900 text-pearl-100'
                  : 'bg-pearl-50 text-ink-600 ring-1 ring-ink-200'
              }`}
            >
              Карточки
            </button>
            <button
              type="button"
              onClick={() =>
                update(sIndex, {
                  list: section.list ?? [''],
                  cards: undefined,
                })
              }
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                section.list
                  ? 'bg-ink-900 text-pearl-100'
                  : 'bg-pearl-50 text-ink-600 ring-1 ring-ink-200'
              }`}
            >
              Список
            </button>
          </div>

          {/* Cards editor */}
          {section.cards && (() => {
            const cards = section.cards;
            return (
            <div className="flex flex-col gap-3">
              {cards.map((card, cIndex) => (
                <div
                  key={cIndex}
                  className="flex flex-col gap-2 rounded-xl bg-pearl-50 p-3 ring-1 ring-ink-200/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-ink-500">Карточка {cIndex + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        update(sIndex, {
                          cards: cards.filter((_, i) => i !== cIndex),
                        })
                      }
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      Удалить
                    </button>
                  </div>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const next = cards.map((c, i) =>
                        i === cIndex ? { ...c, title: e.target.value } : c,
                      );
                      update(sIndex, { cards: next });
                    }}
                    placeholder="Заголовок карточки"
                    className="w-full rounded-lg border border-ink-200 bg-pearl-100 px-3 py-2 text-sm font-semibold focus:border-orange-500 focus:outline-none"
                  />
                  <RichTextArea
                    value={card.text}
                    onChange={(text) => {
                      const next = cards.map((c, i) =>
                        i === cIndex ? { ...c, text } : c,
                      );
                      update(sIndex, { cards: next });
                    }}
                    placeholder="Текст карточки"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  update(sIndex, {
                    cards: [...cards, { title: '', text: '' }],
                  })
                }
                className="self-start rounded-lg px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-500/10"
              >
                + Добавить карточку
              </button>
            </div>
            );
          })()}

          {/* List editor */}
          {section.list && (() => {
            const list = section.list;
            return (
            <div className="flex flex-col gap-2">
              {list.map((item, lIndex) => (
                <div key={lIndex} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const next = list.map((l, i) =>
                        i === lIndex ? e.target.value : l,
                      );
                      update(sIndex, { list: next });
                    }}
                    placeholder={`Пункт ${lIndex + 1}`}
                    className="flex-1 rounded-lg border border-ink-200 bg-pearl-50 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      update(sIndex, {
                        list: list.filter((_, i) => i !== lIndex),
                      })
                    }
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    Удалить
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update(sIndex, { list: [...list, ''] })}
                className="self-start rounded-lg px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-500/10"
              >
                + Добавить пункт
              </button>
            </div>
            );
          })()}
        </div>
      ))}

      <button
        type="button"
        onClick={addSection}
        className="self-start rounded-xl border-2 border-dashed border-ink-300 px-4 py-2.5 text-sm font-medium text-ink-600 hover:border-orange-500 hover:text-orange-600"
      >
        + Добавить раздел
      </button>
    </div>
  );
}

/**
 * A lightweight rich-text editor using contentEditable. Supports bold, links,
 * and paragraphs. Outputs HTML which the article page renders safely.
 */
function RichTextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Set initial content only once
  if (ref.current && ref.current.innerHTML === '' && value) {
    ref.current.innerHTML = value;
  }

  const exec = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const handleInput = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const handleLink = () => {
    const url = window.prompt('Введите URL ссылки:');
    if (url) exec('createLink', url);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1 rounded-lg bg-pearl-100 p-1">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('bold')}
          className="flex h-7 w-7 items-center justify-center rounded text-ink-700 hover:bg-ink-900/10"
          title="Жирный"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('formatBlock', '<h3>')}
          className="flex h-7 w-7 items-center justify-center rounded text-ink-700 hover:bg-ink-900/10"
          title="Заголовок"
        >
          <Heading className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('insertUnorderedList')}
          className="flex h-7 w-7 items-center justify-center rounded text-ink-700 hover:bg-ink-900/10"
          title="Маркированный список"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('insertOrderedList')}
          className="flex h-7 w-7 items-center justify-center rounded text-ink-700 hover:bg-ink-900/10"
          title="Нумерованный список"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleLink}
          className="flex h-7 w-7 items-center justify-center rounded text-ink-700 hover:bg-ink-900/10"
          title="Ссылка"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('formatBlock', '<p>')}
          className="flex h-7 w-7 items-center justify-center rounded text-ink-700 hover:bg-ink-900/10"
          title="Абзац"
        >
          <Pilcrow className="h-3.5 w-3.5" />
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        className="min-h-[80px] rounded-lg border border-ink-200 bg-pearl-50 px-3 py-2 text-sm leading-relaxed text-ink-800 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-ink-400"
      />
    </div>
  );
}
