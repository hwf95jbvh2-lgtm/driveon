import { useEffect, useState, useRef } from 'react';
import { Loader2, Upload, Trash2, Copy, FileImage } from 'lucide-react';
import { fetchMediaItems, insertMediaItem, deleteMediaItem, uploadMedia } from '@/lib/data';
import type { MediaItemRow } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/admin/Dialogs';
import { useToast } from '@/components/admin/Toast';

export function AdminMediaPage() {
  const { notify } = useToast();
  const [items, setItems] = useState<MediaItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchMediaItems();
      setItems(data);
    } catch {
      notify('Не удалось загрузить медиа', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadMedia(file);
        await insertMediaItem({
          name: file.name,
          url,
          file_type: file.type.startsWith('image') ? 'image' : 'file',
          file_size: file.size,
        });
      }
      notify('Загружено');
      await load();
    } catch {
      notify('Не удалось загрузить файл', 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMediaItem(deleteId);
      notify('Удалено');
      await load();
    } catch {
      notify('Не удалось удалить', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    notify('Ссылка скопирована');
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
        title="Медиа"
        description="Загружайте изображения и файлы для использования на страницах."
        action={
          <Button size="md" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Загрузить
          </Button>
        }
      />

      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {items.length === 0 ? (
        <div className="rounded-2xl bg-pearl-50 p-10 text-center text-ink-500 ring-1 ring-ink-200/60">
          Медиа-файлы пока не загружены.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl bg-pearl-50 p-3 ring-1 ring-ink-200/60"
            >
              {item.file_type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-32 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-32 items-center justify-center rounded-xl bg-pearl-100">
                  <FileImage className="h-8 w-8 text-ink-400" />
                </div>
              )}
              <span className="truncate text-sm font-medium text-ink-800">{item.name}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => copyUrl(item.url)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5"
                  title="Копировать ссылку"
                >
                  <Copy className="h-4 w-4" />
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

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить файл?"
        message="Удалить этот медиа-файл? Отменить действие будет невозможно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
