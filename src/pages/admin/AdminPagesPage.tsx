import { useEffect, useState } from 'react';
import { Loader2, Plus, Pencil, Trash2, FileText, Globe, Eye, EyeOff } from 'lucide-react';
import { fetchAllCustomPages, createCustomPage, updateCustomPage, deleteCustomPage } from '@/lib/data';
import type { CustomPageRow, CustomPageInput } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput, TextArea, Select } from '@/components/ui/FormField';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ModalShell, ConfirmDialog } from '@/components/admin/Dialogs';
import { useToast } from '@/components/admin/Toast';

const emptyForm: CustomPageInput = {
  slug: '',
  title: '',
  seo_title: null,
  seo_description: null,
  status: 'draft',
  content: [],
};

export function AdminPagesPage() {
  const { notify } = useToast();
  const [pages, setPages] = useState<CustomPageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CustomPageInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCustomPages();
      setPages(data);
    } catch {
      notify('Не удалось загрузить страницы', 'error');
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

  const openEdit = (page: CustomPageRow) => {
    setForm({
      slug: page.slug,
      title: page.title,
      seo_title: page.seo_title,
      seo_description: page.seo_description,
      status: page.status,
      content: page.content,
    });
    setEditingId(page.id);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateCustomPage(editingId, form);
        notify('Сохранено');
      } else {
        await createCustomPage(form);
        notify('Страница создана');
      }
      setModalOpen(false);
      await load();
    } catch {
      notify('Не удалось сохранить', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCustomPage(deleteId);
      notify('Удалено');
      await load();
    } catch {
      notify('Не удалось удалить', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const set = <K extends keyof CustomPageInput>(key: K, value: CustomPageInput[K]) =>
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
        title="Страницы"
        description="Создавайте и редактируйте страницы сайта. Опубликуйте, когда готовы."
        action={
          <Button size="md" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Добавить страницу
          </Button>
        }
      />

      <div className="flex flex-col gap-3">
        {pages.length === 0 ? (
          <div className="rounded-2xl bg-pearl-50 p-10 text-center text-ink-500 ring-1 ring-ink-200/60">
            Страницы пока не созданы.
          </div>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center gap-3 rounded-2xl bg-pearl-50 p-4 ring-1 ring-ink-200/60"
            >
              <FileText className="h-5 w-5 shrink-0 text-ink-500" />
              <div className="flex-1">
                <span className="font-display font-semibold text-ink-900">{page.title}</span>
                <span className="ml-2 font-mono text-xs text-ink-400">/page/{page.slug}</span>
                <span
                  className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    page.status === 'published'
                      ? 'bg-teal-500/15 text-teal-800'
                      : 'bg-orange-500/10 text-orange-700'
                  }`}
                >
                  {page.status === 'published' ? 'Опубликована' : 'Черновик'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => openEdit(page)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(page.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-600 hover:bg-orange-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <ModalShell
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Редактировать страницу' : 'Новая страница'}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" size="md" onClick={() => setModalOpen(false)}>Отмена</Button>
            <Button type="submit" form="page-form" size="md" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Сохранить'}
            </Button>
          </div>
        }
      >
        <form id="page-form" onSubmit={handleSave} className="flex flex-col gap-4" noValidate>
          <FormField label="Название" name="title" required>
            <TextInput name="title" required value={form.title} onChange={(e) => set('title', e.target.value)} />
          </FormField>
          <FormField label="URL (slug)" name="slug" required hint="Например: novosti. Страница будет доступна по /page/novosti">
            <TextInput name="slug" required value={form.slug} onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))} />
          </FormField>
          <FormField label="SEO title" name="seo_title">
            <TextInput name="seo_title" value={form.seo_title ?? ''} onChange={(e) => set('seo_title', e.target.value || null)} />
          </FormField>
          <FormField label="SEO description" name="seo_description">
            <TextArea name="seo_description" value={form.seo_description ?? ''} onChange={(e) => set('seo_description', e.target.value || null)} />
          </FormField>
          <FormField label="Статус" name="status" required>
            <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="draft">Черновик</option>
              <option value="published">Опубликована</option>
            </Select>
          </FormField>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-ink-800">Содержание</span>
            <ContentEditor sections={form.content} onChange={(content) => set('content', content)} />
          </div>
        </form>
      </ModalShell>

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить страницу?"
        message="Удалить эту страницу? Отменить действие будет невозможно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
