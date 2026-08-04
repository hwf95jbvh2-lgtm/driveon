import { useEffect, useState } from 'react';
import { Loader2, Eye, EyeOff, Save } from 'lucide-react';
import { fetchAllUsefulPages, updateUsefulPage } from '@/lib/data';
import type { UsefulPageRow, UsefulPageInput } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput, TextArea } from '@/components/ui/FormField';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { useToast } from '@/components/admin/Toast';

export function AdminUsefulPage() {
  const { notify } = useToast();
  const [pages, setPages] = useState<UsefulPageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<UsefulPageInput | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsefulPages();
      setPages(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
        setForm({
          title: data[0].title,
          description: data[0].description,
          content: data[0].content,
          published: data[0].published,
        });
      }
    } catch {
      notify('Не удалось загрузить страницы', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selectPage = (page: UsefulPageRow) => {
    setSelectedId(page.id);
    setForm({
      title: page.title,
      description: page.description,
      content: page.content,
      published: page.published,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !form) return;
    setSaving(true);
    try {
      await updateUsefulPage(selectedId, form);
      notify('Сохранено');
      await load();
    } catch {
      notify('Не удалось сохранить', 'error');
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof UsefulPageInput>(key: K, value: UsefulPageInput[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  return (
    <div>
      <AdminPageHeader
        title="Полезное"
        description="Редактируйте заголовок, описание и содержание статей."
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Page list */}
          <div className="flex flex-col gap-1">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => selectPage(page)}
                className={`flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                  selectedId === page.id
                    ? 'bg-orange-500/15 text-orange-700'
                    : 'text-ink-700 hover:bg-ink-900/5'
                }`}
              >
                <span className="truncate">{page.title}</span>
                {page.published ? (
                  <Eye className="h-3.5 w-3.5 shrink-0 text-teal-600" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                )}
              </button>
            ))}
          </div>

          {/* Editor */}
          {form && (
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <FormField label="Заголовок" name="title" required>
                <TextInput
                  name="title"
                  required
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                />
              </FormField>

              <FormField label="Короткое описание" name="description" required>
                <TextArea
                  name="description"
                  required
                  rows={2}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                />
              </FormField>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-ink-800">Содержание</span>
                <ContentEditor
                  sections={form.content}
                  onChange={(content) => set('content', content)}
                />
              </div>

              <label className="flex items-center gap-2.5 text-sm font-medium text-ink-800">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => set('published', e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-orange-500 focus:ring-orange-500"
                />
                Опубликовано
              </label>

              <div className="flex justify-end">
                <Button type="submit" size="md" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Сохранение…
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Сохранить
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
