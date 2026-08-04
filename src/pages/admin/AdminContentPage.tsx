import { useEffect, useState } from 'react';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { fetchAllContent, updateContentBatch, deleteContentItem } from '@/lib/data';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput, TextArea } from '@/components/ui/FormField';
import { ConfirmDialog } from '@/components/admin/Dialogs';
import { useToast } from '@/components/admin/Toast';

interface ContentEntry {
  key: string;
  value: string;
  isNew?: boolean;
}

export function AdminContentPage() {
  const { notify } = useToast();
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllContent();
      setEntries(
        Object.entries(data)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([key, value]) => ({ key, value })),
      );
    } catch {
      notify('Не удалось загрузить контент', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const batch: Record<string, string> = {};
      entries.forEach((e) => {
        batch[e.key] = e.value;
      });
      await updateContentBatch(batch);
      notify('Сохранено');
    } catch {
      notify('Не удалось сохранить', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    if (!newKey.trim()) return;
    setEntries((prev) => [...prev, { key: newKey.trim(), value: newValue, isNew: true }]);
    setNewKey('');
    setNewValue('');
    setAdding(false);
  };

  const handleDelete = async () => {
    if (!deleteKey) return;
    try {
      await deleteContentItem(deleteKey);
      setEntries((prev) => prev.filter((e) => e.key !== deleteKey));
      notify('Удалено');
    } catch {
      notify('Не удалось удалить', 'error');
    } finally {
      setDeleteKey(null);
    }
  };

  const updateValue = (key: string, value: string) => {
    setEntries((prev) => prev.map((e) => (e.key === key ? { ...e, value } : e)));
  };

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
        title="Тексты сайта"
        description="Все заголовки, подзаголовки, тексты кнопок и описания. Изменения применяются сразу после сохранения."
        action={
          <Button size="md" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" />
            Добавить текст
          </Button>
        }
      />

      {adding && (
        <div className="mb-6 rounded-2xl bg-pearl-50 p-5 ring-1 ring-ink-200/60">
          <h3 className="mb-3 font-display font-semibold text-ink-900">Новый текстовый элемент</h3>
          <div className="flex flex-col gap-3">
            <FormField label="Ключ (например: hero.title)" name="newKey">
              <TextInput value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="hero.title" />
            </FormField>
            <FormField label="Значение" name="newValue">
              <TextArea value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Текст" />
            </FormField>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd}>Добавить</Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Отмена</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <div
            key={entry.key}
            className="flex flex-col gap-2 rounded-2xl bg-pearl-50 p-4 ring-1 ring-ink-200/60 sm:flex-row sm:items-start"
          >
            <div className="shrink-0 sm:w-64">
              <span className="font-mono text-xs text-ink-500">{entry.key}</span>
            </div>
            <div className="flex-1">
              <TextArea
                value={entry.value}
                onChange={(e) => updateValue(entry.key, e.target.value)}
                rows={2}
              />
            </div>
            <button
              type="button"
              onClick={() => setDeleteKey(entry.key)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-orange-600 hover:bg-orange-500/10"
              title="Удалить"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button size="md" onClick={handleSave} disabled={saving}>
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

      <ConfirmDialog
        open={!!deleteKey}
        title="Удалить текстовый элемент?"
        message="Удалить эту запись? Отменить действие будет невозможно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteKey(null)}
      />
    </div>
  );
}
