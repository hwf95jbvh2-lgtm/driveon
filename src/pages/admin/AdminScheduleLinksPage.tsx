import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, ExternalLink } from 'lucide-react';
import {
  fetchAllScheduleLinks,
  createScheduleLink,
  updateScheduleLink,
  deleteScheduleLink,
} from '@/lib/data';
import type { ExamScheduleLinkRow, ExamScheduleLinkInput } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput } from '@/components/ui/FormField';
import { ModalShell, ConfirmDialog } from '@/components/admin/Dialogs';
import { useToast } from '@/components/admin/Toast';

const emptyForm: ExamScheduleLinkInput = {
  label: '',
  url: '',
  published: true,
  sort_order: 0,
};

export function AdminScheduleLinksPage() {
  const { notify } = useToast();
  const [items, setItems] = useState<ExamScheduleLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExamScheduleLinkInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllScheduleLinks();
      setItems(data);
    } catch {
      notify('Не удалось загрузить графики', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm({ ...emptyForm, sort_order: items.length + 1 });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (item: ExamScheduleLinkRow) => {
    setForm({
      label: item.label,
      url: item.url,
      published: item.published,
      sort_order: item.sort_order,
    });
    setEditingId(item.id);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateScheduleLink(editingId, form);
        notify('Сохранено');
      } else {
        await createScheduleLink(form);
        notify('График добавлен');
      }
      setModalOpen(false);
      await load();
    } catch {
      notify('Не удалось сохранить', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item: ExamScheduleLinkRow) => {
    try {
      await updateScheduleLink(item.id, { published: !item.published });
      notify(item.published ? 'Скрыто' : 'Опубликовано');
      await load();
    } catch {
      notify('Не удалось изменить', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteScheduleLink(deleteId);
      notify('Удалено');
      await load();
    } catch {
      notify('Не удалось удалить', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const set = <K extends keyof ExamScheduleLinkInput>(
    key: K,
    value: ExamScheduleLinkInput[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <AdminPageHeader
        title="Графики экзаменов"
        description="Кнопки-месяцы со ссылками на PDF-графики экзаменов."
        action={
          <Button size="md" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Добавить месяц
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-pearl-50 p-10 text-center text-ink-500 ring-1 ring-ink-200/60">
          Графики пока не добавлены.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl bg-pearl-50 p-5 ring-1 ring-ink-200/60 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-ink-900">{item.label}</span>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.published
                        ? 'bg-teal-500/15 text-teal-800'
                        : 'bg-orange-500/10 text-orange-700'
                    }`}
                  >
                    {item.published ? 'Опубликовано' : 'Скрыто'}
                  </span>
                  <span className="text-xs text-ink-400">Порядок: {item.sort_order}</span>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                >
                  Открыть PDF
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleToggle(item)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
                  title={item.published ? 'Скрыть' : 'Показать'}
                >
                  {item.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
                  title="Изменить"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-600 hover:bg-orange-500/10"
                  title="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalShell
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Изменить месяц' : 'Добавить месяц'}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" size="md" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" form="schedule-form" size="md" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Сохранение…
                </>
              ) : (
                'Сохранить'
              )}
            </Button>
          </div>
        }
      >
        <form id="schedule-form" onSubmit={handleSave} className="flex flex-col gap-4" noValidate>
          <FormField label="Название месяца" name="label" required>
            <TextInput
              name="label"
              required
              placeholder="Июль"
              value={form.label}
              onChange={(e) => set('label', e.target.value)}
            />
          </FormField>
          <FormField label="Ссылка на PDF" name="url" required>
            <TextInput
              name="url"
              type="url"
              required
              placeholder="https://..."
              value={form.url}
              onChange={(e) => set('url', e.target.value)}
            />
          </FormField>
          <FormField label="Порядок сортировки" name="sort_order" hint="Меньше число — выше в списке">
            <TextInput
              name="sort_order"
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)}
            />
          </FormField>
          <label className="flex items-center gap-2.5 text-sm font-medium text-ink-800">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set('published', e.target.checked)}
              className="h-4 w-4 rounded border-ink-300 text-orange-500 focus:ring-orange-500"
            />
            Опубликовано
          </label>
        </form>
      </ModalShell>

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить график?"
        message="Удалить эту запись? Отменить действие будет невозможно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
