import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { fetchExams, createExam, updateExam, deleteExam } from '@/lib/data';
import type { Exam, ExamInput, ExamStatus } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput, Select } from '@/components/ui/FormField';
import { ModalShell } from '@/components/admin/Dialogs';
import { ConfirmDialog } from '@/components/admin/Dialogs';
import { useToast } from '@/components/admin/Toast';

const statusLabels: Record<ExamStatus, string> = {
  upcoming: 'Предстоящий',
  completed: 'Завершён',
  hidden: 'Скрыт',
};

const statusStyles: Record<ExamStatus, string> = {
  upcoming: 'bg-teal-500/15 text-teal-800',
  completed: 'bg-ink-900/8 text-ink-600',
  hidden: 'bg-orange-500/10 text-orange-700',
};

const emptyForm: ExamInput = {
  date: '',
  city: '',
  exam_type: '',
  official_url: '',
  status: 'upcoming',
};

export function AdminExamsPage() {
  const { notify } = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExamInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchExams(false);
      setExams(data);
    } catch {
      notify('Не удалось загрузить экзамены', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (exam: Exam) => {
    setForm({
      date: exam.date,
      city: exam.city,
      exam_type: exam.examType,
      official_url: exam.officialUrl,
      status: exam.status,
    });
    setEditingId(exam.id);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateExam(editingId, form);
        notify('Сохранено');
      } else {
        await createExam(form);
        notify('Экзамен добавлен');
      }
      setModalOpen(false);
      await load();
    } catch {
      notify('Не удалось сохранить', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async (exam: Exam) => {
    const next: ExamStatus = exam.status === 'hidden' ? 'upcoming' : 'hidden';
    try {
      await updateExam(exam.id, { status: next });
      notify(next === 'hidden' ? 'Экзамен скрыт' : 'Экзамен опубликован');
      await load();
    } catch {
      notify('Не удалось изменить', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExam(deleteId);
      notify('Удалено');
      await load();
    } catch {
      notify('Не удалось удалить', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const set = <K extends keyof ExamInput>(key: K, value: ExamInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <AdminPageHeader
        title="Экзамены"
        description="Добавляйте, изменяйте и скрывайте экзамены."
        action={
          <Button size="md" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Добавить экзамен
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
        </div>
      ) : exams.length === 0 ? (
        <div className="rounded-2xl bg-pearl-50 p-10 text-center text-ink-500 ring-1 ring-ink-200/60">
          Экзамены пока не добавлены.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-ink-200/60 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                <th className="px-3 py-3">Дата</th>
                <th className="px-3 py-3">Город</th>
                <th className="px-3 py-3">Тип</th>
                <th className="px-3 py-3">Статус</th>
                <th className="px-3 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr
                  key={exam.id}
                  className="border-b border-ink-200/40 text-sm text-ink-800"
                >
                  <td className="px-3 py-3 whitespace-nowrap">
                    {new Date(exam.date).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-3 py-3 font-medium">{exam.city}</td>
                  <td className="px-3 py-3 text-ink-600">{exam.examType}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[exam.status]}`}
                    >
                      {statusLabels[exam.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(exam)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
                        title={exam.status === 'hidden' ? 'Показать' : 'Скрыть'}
                      >
                        {exam.status === 'hidden' ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(exam)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
                        title="Изменить"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(exam.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-600 hover:bg-orange-500/10"
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalShell
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Изменить экзамен' : 'Добавить экзамен'}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" size="md" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button
              type="submit"
              form="exam-form"
              size="md"
              disabled={saving}
            >
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
        <form id="exam-form" onSubmit={handleSave} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Дата" name="date" required>
              <TextInput
                name="date"
                type="date"
                required
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </FormField>
            <FormField label="Город" name="city" required>
              <TextInput
                name="city"
                required
                placeholder="Владивосток"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
              />
            </FormField>
            <FormField label="Тип экзамена" name="exam_type" required>
              <TextInput
                name="exam_type"
                required
                placeholder="Теория"
                value={form.exam_type}
                onChange={(e) => set('exam_type', e.target.value)}
              />
            </FormField>
            <FormField label="Статус" name="status" required>
              <Select
                name="status"
                value={form.status}
                onChange={(e) => set('status', e.target.value as ExamStatus)}
              >
                <option value="upcoming">Предстоящий</option>
                <option value="completed">Завершён</option>
                <option value="hidden">Скрыт</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Ссылка на официальный источник" name="official_url" required>
            <TextInput
              name="official_url"
              type="url"
              required
              placeholder="https://www.gibdd.ru"
              value={form.official_url}
              onChange={(e) => set('official_url', e.target.value)}
            />
          </FormField>
        </form>
      </ModalShell>

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить экзамен?"
        message="Удалить эту запись? Отменить действие будет невозможно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
