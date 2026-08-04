import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { fetchSettings, updateSettings } from '@/lib/data';
import type { SettingsInput } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput, TextArea } from '@/components/ui/FormField';
import { useToast } from '@/components/admin/Toast';

export function AdminSettingsPage() {
  const { notify } = useToast();
  const [form, setForm] = useState<SettingsInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await fetchSettings();
        if (s) {
          setForm({
            telegram_url: s.telegram_url,
            site_name: s.site_name,
            description: s.description,
            contact_email: s.contact_email,
          });
        }
      } catch {
        notify('Не удалось загрузить настройки', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      await updateSettings(form);
      notify('Сохранено');
    } catch {
      notify('Не удалось сохранить', 'error');
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof SettingsInput>(key: K, value: SettingsInput[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="rounded-2xl bg-pearl-50 p-10 text-center text-ink-500 ring-1 ring-ink-200/60">
        Не удалось загрузить настройки.
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Настройки"
        description="Общие настройки сайта DriveON."
      />

      <form
        onSubmit={handleSave}
        className="flex max-w-xl flex-col gap-5 rounded-2xl bg-pearl-50 p-6 ring-1 ring-ink-200/60"
      >
        <FormField
          label="Telegram URL"
          name="telegram_url"
          required
          hint="Используется во всех кнопках Telegram на сайте."
        >
          <TextInput
            name="telegram_url"
            type="url"
            required
            placeholder="https://t.me/drivesquad"
            value={form.telegram_url}
            onChange={(e) => set('telegram_url', e.target.value)}
          />
        </FormField>

        <FormField label="Название сайта" name="site_name" required>
          <TextInput
            name="site_name"
            required
            value={form.site_name}
            onChange={(e) => set('site_name', e.target.value)}
          />
        </FormField>

        <FormField label="Короткое описание" name="description" required>
          <TextArea
            name="description"
            required
            rows={3}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </FormField>

        <FormField label="Контактный email" name="contact_email" required>
          <TextInput
            name="contact_email"
            type="email"
            required
            value={form.contact_email}
            onChange={(e) => set('contact_email', e.target.value)}
          />
        </FormField>

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
    </div>
  );
}
