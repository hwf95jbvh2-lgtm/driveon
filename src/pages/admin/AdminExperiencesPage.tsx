import { useEffect, useState } from 'react';
import { Pencil, Trash2, Check, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { fetchAllExperiences, updateExperience, deleteExperience } from '@/lib/data';
import type { ExperienceRow, ExperienceInput, ModerationStatus } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput, TextArea, Select } from '@/components/ui/FormField';
import { ModalShell, ConfirmDialog } from '@/components/admin/Dialogs';
import { useToast } from '@/components/admin/Toast';

const statusLabels: Record<ModerationStatus, string> = {
  pending: 'На проверке',
  published: 'Опубликован',
  rejected: 'Отклонён',
};

const statusStyles: Record<ModerationStatus, string> = {
  pending: 'bg-orange-500/15 text-orange-700',
  published: 'bg-teal-500/15 text-teal-800',
  rejected: 'bg-ink-900/8 text-ink-600',
};

type Filter = 'all' | ModerationStatus;

export function AdminExperiencesPage() {
  const { notify } = useToast();
  const [items, setItems] = useState<ExperienceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [editing, setEditing] = useState<ExperienceRow | null>(null);
  const [form, setForm] = useState<ExperienceInput | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllExperiences();
      setItems(data);
    } catch {
      notify('Не удалось загрузить истории', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = filter === 'all' ? items : items.filter((i) => i.moderation_status === filter);

  const openEdit = (item: ExperienceRow) => {
    setEditing(item);
    setForm({
      city: item.city,
      exam_date: item.exam_date,
      category: item.category,
      result: item.result,
      experience: item.experience,
      comment: item.comment,
      moderation_status: item.moderation_status,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !form) return;
    setSaving(true);
    try {
      await updateExperience(editing.id, form);
      notify('Сохранено');
      setEditing(null);
      await load();
    } catch {
      notify('Не удалось сохранить', 'error');
    } finally {
      setSaving(false);
    }
  };

  const quickAction = async (item: ExperienceRow, status: ModerationStatus) => {
    try {
      await updateExperience(item.id, { moderation_status: status });
      notify(
        status === 'published'
          ? 'Опубликовано'
          : status === 'rejected'
            ? 'Отклонено'
            : 'Снято с проверки',
      );
      await load();
    } catch {
      notify('Не удалось изменить статус', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExperience(deleteId);
      notify('Удалено');
      await load();
    } catch {
      notify('Не удалось удалить', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const set = <K extends keyof ExperienceInput>(key: K, value: ExperienceInput[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  return (
    <div>
      <AdminPageHeader
        title="Опыт сдающих"
        description="Проверяйте, редактируйте и публикуйте истории."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(['all', 'pending', 'published', 'rejected'] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-ink-900 text-pearl-100'
                : 'bg-pearl-50 text-ink-700 ring-1 ring-ink-200 hover:bg-pearl-200'
            }`}
          >
            {f === 'all' ? 'Все' : statusLabels[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-pearl-50 p-10 text-center text-ink-500 ring-1 ring-ink-200/60">
          Истории не найдены.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-pearl-50 p-5 ring-1 ring-ink-200/60"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[item.moderation_status]}`}
                >
                  {statusLabels[item.moderation_status]}
                </span>
                <span className="text-sm font-medium text-ink-800">{item.city}</span>
                <span className="text-sm text-ink-500">
                  {new Date(item.exam_date).toLocaleDateString('ru-RU')}
                </span>
                <span className="text-sm text-ink-500">Категория {item.category}</span>
                <span
                  className={`text-sm font-medium ${item.result === 'passed' ? 'text-teal-700' : 'text-orange-600'}`}
                >
                  {item.result === 'passed' ? 'Сдал' : 'Не сдал'}
                </span>
                <span className="ml-auto text-xs text-ink-400">
                  {new Date(item.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-ink-700">{item.experience}</p>
              {item.comment && (
                <p className="mt-2 border-l-2 border-teal-400 pl-3 text-sm italic text-ink-600">
                  {item.comment}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {item.moderation_status !== 'published' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => quickAction(item, 'published')}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Опубликовать
                  </Button>
                )}
                {item.moderation_status === 'published' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => quickAction(item, 'pending')}
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    Снять с публикации
                  </Button>
                )}
                {item.moderation_status !== 'rejected' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => quickAction(item, 'rejected')}
                  >
                    <X className="h-3.5 w-3.5" />
                    Отклонить
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Редактировать
                </Button>
                <button
                  type="button"
                  onClick={() => setDeleteId(item.id)}
                  className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-orange-600 hover:bg-orange-500/10"
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
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Редактировать историю"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" size="md" onClick={() => setEditing(null)}>
              Отмена
            </Button>
            <Button type="submit" form="exp-form" size="md" disabled={saving}>
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
        {form && (
          <form id="exp-form" onSubmit={handleSave} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Город" name="city" required>
                <TextInput
                  name="city"
                  required
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                />
              </FormField>
              <FormField label="Дата экзамена" name="exam_date" required>
                <TextInput
                  name="exam_date"
                  type="date"
                  required
                  value={form.exam_date}
                  onChange={(e) => set('exam_date', e.target.value)}
                />
              </FormField>
              <FormField label="Категория" name="category" required>
                <TextInput
                  name="category"
                  required
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                />
              </FormField>
              <FormField label="Результат" name="result" required>
                <Select
                  name="result"
                  value={form.result}
                  onChange={(e) => set('result', e.target.value as 'passed' | 'failed')}
                >
                  <option value="passed">Сдал</option>
                  <option value="failed">Не сдал</option>
                </Select>
              </FormField>
            </div>
            <FormField label="Статус модерации" name="moderation_status" required>
              <Select
                name="moderation_status"
                value={form.moderation_status}
                onChange={(e) => set('moderation_status', e.target.value as ModerationStatus)}
              >
                <option value="pending">На проверке</option>
                <option value="published">Опубликован</option>
                <option value="rejected">Отклонён</option>
              </Select>
            </FormField>
            <FormField label="Описание" name="experience" required>
              <TextArea
                name="experience"
                required
                value={form.experience}
                onChange={(e) => set('experience', e.target.value)}
              />
            </FormField>
            <FormField label="Комментарий" name="comment">
              <TextArea
                name="comment"
                value={form.comment ?? ''}
                onChange={(e) => set('comment', e.target.value || null)}
              />
            </FormField>
          </form>
        )}
      </ModalShell>

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить историю?"
        message="Удалить эту запись? Отменить действие будет невозможно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
