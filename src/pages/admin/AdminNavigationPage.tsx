import { useEffect, useState } from 'react';
import { Loader2, Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { fetchNavItems, createNavItem, updateNavItem, deleteNavItem } from '@/lib/data';
import type { NavItemRow, NavItemInput } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput, Select } from '@/components/ui/FormField';
import { ModalShell, ConfirmDialog } from '@/components/admin/Dialogs';
import { useToast } from '@/components/admin/Toast';

const emptyForm: NavItemInput = {
  label: '',
  url: '',
  open_in_new_tab: false,
  location: 'header',
  sort_order: 0,
  visible: true,
};

export function AdminNavigationPage() {
  const { notify } = useToast();
  const [items, setItems] = useState<NavItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NavItemInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchNavItems();
      setItems(data);
    } catch {
      notify('Не удалось загрузить навигацию', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = (location: string) => {
    const sameLoc = items.filter((i) => i.location === location);
    setForm({ ...emptyForm, location, sort_order: sameLoc.length + 1 });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (item: NavItemRow) => {
    setForm({
      label: item.label,
      url: item.url,
      open_in_new_tab: item.open_in_new_tab,
      location: item.location,
      sort_order: item.sort_order,
      visible: item.visible,
    });
    setEditingId(item.id);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateNavItem(editingId, form);
        notify('Сохранено');
      } else {
        await createNavItem(form);
        notify('Добавлено');
      }
      setModalOpen(false);
      await load();
    } catch {
      notify('Не удалось сохранить', 'error');
    } finally {
      setSaving(false);
    }
  };

  const move = async (item: NavItemRow, direction: 'up' | 'down') => {
    const sameLoc = items.filter((i) => i.location === item.location).sort((a, b) => a.sort_order - b.sort_order);
    const index = sameLoc.findIndex((i) => i.id === item.id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sameLoc.length) return;
    const other = sameLoc[swapIndex];
    try {
      await updateNavItem(item.id, { sort_order: other.sort_order });
      await updateNavItem(other.id, { sort_order: item.sort_order });
      await load();
    } catch {
      notify('Не удалось переместить', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteNavItem(deleteId);
      notify('Удалено');
      await load();
    } catch {
      notify('Не удалось удалить', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const set = <K extends keyof NavItemInput>(key: K, value: NavItemInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const renderList = (location: string, title: string) => {
    const locItems = items.filter((i) => i.location === location).sort((a, b) => a.sort_order - b.sort_order);
    return (
      <div className="rounded-2xl bg-pearl-50 p-5 ring-1 ring-ink-200/60">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
          <Button size="sm" onClick={() => openCreate(location)}>
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {locItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-xl bg-pearl-100/50 p-3">
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => move(item, 'up')}
                  className="flex h-6 w-6 items-center justify-center rounded text-ink-600 hover:bg-ink-900/5"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(item, 'down')}
                  className="flex h-6 w-6 items-center justify-center rounded text-ink-600 hover:bg-ink-900/5"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1">
                <span className={`font-medium text-ink-900 ${item.visible ? '' : 'opacity-50 line-through'}`}>
                  {item.label}
                </span>
                <span className="ml-2 text-xs text-ink-500">{item.url}</span>
                {item.open_in_new_tab && (
                  <span className="ml-2 rounded bg-teal-500/15 px-1.5 py-0.5 text-xs text-teal-700">в новой вкладке</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => openEdit(item)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-600 hover:bg-orange-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
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
        title="Навигация"
        description="Ссылки в шапке и подвале сайта. Меняйте названия, URL, порядок и видимость."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {renderList('header', 'Шапка (Header)')}
        {renderList('footer', 'Подвал (Footer)')}
      </div>

      <ModalShell
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Изменить ссылку' : 'Добавить ссылку'}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" size="md" onClick={() => setModalOpen(false)}>Отмена</Button>
            <Button type="submit" form="nav-form" size="md" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Сохранить'}
            </Button>
          </div>
        }
      >
        <form id="nav-form" onSubmit={handleSave} className="flex flex-col gap-4" noValidate>
          <FormField label="Название" name="label" required>
            <TextInput name="label" required value={form.label} onChange={(e) => set('label', e.target.value)} />
          </FormField>
          <FormField label="URL" name="url" required>
            <TextInput name="url" required value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="/exams или https://..." />
          </FormField>
          <FormField label="Расположение" name="location" required>
            <Select value={form.location} onChange={(e) => set('location', e.target.value)}>
              <option value="header">Шапка (Header)</option>
              <option value="footer">Подвал (Footer)</option>
            </Select>
          </FormField>
          <label className="flex items-center gap-2.5 text-sm font-medium text-ink-800">
            <input type="checkbox" checked={form.open_in_new_tab} onChange={(e) => set('open_in_new_tab', e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-orange-500 focus:ring-orange-500" />
            Открывать в новой вкладке
          </label>
          <label className="flex items-center gap-2.5 text-sm font-medium text-ink-800">
            <input type="checkbox" checked={form.visible} onChange={(e) => set('visible', e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-orange-500 focus:ring-orange-500" />
            Видимый
          </label>
        </form>
      </ModalShell>

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить ссылку?"
        message="Удалить эту ссылку из навигации? Отменить действие будет невозможно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
