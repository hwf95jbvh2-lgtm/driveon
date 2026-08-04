import { useEffect, useState } from 'react';
import { Loader2, Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { fetchFormFields, createFormField, updateFormField, deleteFormField } from '@/lib/data';
import type { FormFieldRow, FormFieldInput } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput, Select } from '@/components/ui/FormField';
import { ModalShell, ConfirmDialog } from '@/components/admin/Dialogs';
import { useToast } from '@/components/admin/Toast';

const emptyForm: FormFieldInput = {
  field_key: '',
  label: '',
  field_type: 'text',
  required: true,
  sort_order: 0,
  active: true,
  placeholder: null,
};

export function AdminFormFieldsPage() {
  const { notify } = useToast();
  const [fields, setFields] = useState<FormFieldRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormFieldInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchFormFields();
      setFields(data);
    } catch {
      notify('Не удалось загрузить поля формы', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm({ ...emptyForm, sort_order: fields.length + 1 });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (field: FormFieldRow) => {
    setForm({
      field_key: field.field_key,
      label: field.label,
      field_type: field.field_type,
      required: field.required,
      sort_order: field.sort_order,
      active: field.active,
      placeholder: field.placeholder,
    });
    setEditingId(field.id);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateFormField(editingId, form);
        notify('Сохранено');
      } else {
        await createFormField(form);
        notify('Поле добавлено');
      }
      setModalOpen(false);
      await load();
    } catch {
      notify('Не удалось сохранить', 'error');
    } finally {
      setSaving(false);
    }
  };

  const move = async (index: number, direction: 'up' | 'down') => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= fields.length) return;
    const a = fields[index];
    const b = fields[swapIndex];
    try {
      await updateFormField(a.id, { sort_order: b.sort_order });
      await updateFormField(b.id, { sort_order: a.sort_order });
      await load();
    } catch {
      notify('Не удалось переместить', 'error');
    }
  };

  const toggleActive = async (field: FormFieldRow) => {
    try {
      await updateFormField(field.id, { active: !field.active });
      notify(field.active ? 'Скрыто' : 'Показано');
      await load();
    } catch {
      notify('Не удалось изменить', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteFormField(deleteId);
      notify('Удалено');
      await load();
    } catch {
      notify('Не удалось удалить', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const set = <K extends keyof FormFieldInput>(key: K, value: FormFieldInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Поля формы"
        description="Управление полями формы «Рассказать о своём экзамене»."
        action={
          <Button size="md" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Добавить поле
          </Button>
        }
      />

      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center gap-3 rounded-2xl bg-pearl-50 p-4 ring-1 ring-ink-200/60"
          >
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => move(index, 'up')}
                disabled={index === 0}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5 disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 'down')}
                disabled={index === fields.length - 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5 disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-medium text-ink-900 ${field.active ? '' : 'opacity-50 line-through'}`}>
                  {field.label}
                </span>
                {field.required && (
                  <span className="rounded bg-orange-500/10 px-1.5 py-0.5 text-xs text-orange-700">обязательное</span>
                )}
                <span className="rounded bg-teal-500/15 px-1.5 py-0.5 text-xs text-teal-700">{field.field_type}</span>
              </div>
              <span className="font-mono text-xs text-ink-400">{field.field_key}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => toggleActive(field)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
                title={field.active ? 'Скрыть' : 'Показать'}
              >
                {field.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => openEdit(field)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(field.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-600 hover:bg-orange-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ModalShell
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Изменить поле' : 'Добавить поле'}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" size="md" onClick={() => setModalOpen(false)}>Отмена</Button>
            <Button type="submit" form="field-form" size="md" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Сохранить'}
            </Button>
          </div>
        }
      >
        <form id="field-form" onSubmit={handleSave} className="flex flex-col gap-4" noValidate>
          <FormField label="Название поля" name="label" required>
            <TextInput name="label" required value={form.label} onChange={(e) => set('label', e.target.value)} />
          </FormField>
          <FormField label="Ключ (латиницей)" name="field_key" required hint="Например: city, examDate">
            <TextInput name="field_key" required value={form.field_key} onChange={(e) => set('field_key', e.target.value)} />
          </FormField>
          <FormField label="Тип поля" name="field_type" required>
            <Select value={form.field_type} onChange={(e) => set('field_type', e.target.value)}>
              <option value="text">Текст</option>
              <option value="date">Дата</option>
              <option value="textarea">Большой текст</option>
              <option value="select">Выпадающий список</option>
            </Select>
          </FormField>
          <FormField label="Placeholder" name="placeholder">
            <TextInput name="placeholder" value={form.placeholder ?? ''} onChange={(e) => set('placeholder', e.target.value || null)} />
          </FormField>
          <label className="flex items-center gap-2.5 text-sm font-medium text-ink-800">
            <input type="checkbox" checked={form.required} onChange={(e) => set('required', e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-orange-500 focus:ring-orange-500" />
            Обязательное
          </label>
          <label className="flex items-center gap-2.5 text-sm font-medium text-ink-800">
            <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-orange-500 focus:ring-orange-500" />
            Активное
          </label>
        </form>
      </ModalShell>

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить поле?"
        message="Удалить это поле формы? Отменить действие будет невозможно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
