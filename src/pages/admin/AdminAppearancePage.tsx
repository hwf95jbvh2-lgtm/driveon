import { useEffect, useState } from 'react';
import { Loader2, Save, RotateCcw } from 'lucide-react';
import { fetchTheme, updateTheme } from '@/lib/data';
import type { ThemeRow, ThemeInput } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput, Select } from '@/components/ui/FormField';
import { useToast } from '@/components/admin/Toast';
import { useTheme } from '@/context/ThemeContext';

const FONT_OPTIONS = ['Unbounded', 'Inter', 'Arial', 'Georgia', 'Roboto', 'Montserrat', 'Playfair Display', 'Oswald', 'Lora', 'PT Sans'];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-ink-200"
      />
      <TextInput value={value} onChange={(e) => onChange(e.target.value)} className="flex-1" />
      <span className="w-24 shrink-0 text-sm text-ink-600">{label}</span>
    </div>
  );
}

export function AdminAppearancePage() {
  const { notify } = useToast();
  const { refresh } = useTheme();
  const [theme, setTheme] = useState<ThemeRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTheme();
        setTheme(data);
      } catch {
        notify('Не удалось загрузить настройки', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme) return;
    setSaving(true);
    const input: ThemeInput = {
      primary_color: theme.primary_color,
      secondary_color: theme.secondary_color,
      accent_color: theme.accent_color,
      background_color: theme.background_color,
      text_color: theme.text_color,
      heading_color: theme.heading_color,
      button_primary_color: theme.button_primary_color,
      button_secondary_color: theme.button_secondary_color,
      button_text_color: theme.button_text_color,
      card_color: theme.card_color,
      footer_color: theme.footer_color,
      link_color: theme.link_color,
      heading_font: theme.heading_font,
      body_font: theme.body_font,
      heading_size: theme.heading_size,
      section_heading_size: theme.section_heading_size,
      body_size: theme.body_size,
      font_weight: theme.font_weight,
      line_height: theme.line_height,
      content_width: theme.content_width,
      text_align: theme.text_align,
      button_radius: theme.button_radius,
      card_radius: theme.card_radius,
      input_radius: theme.input_radius,
      button_size: theme.button_size,
      border_width: theme.border_width,
      border_enabled: theme.border_enabled,
      shadow_intensity: theme.shadow_intensity,
      padding: theme.padding,
      gap: theme.gap,
    };
    try {
      await updateTheme(input);
      await refresh();
      notify('Сохранено');
    } catch {
      notify('Не удалось сохранить', 'error');
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof ThemeRow>(key: K, value: ThemeRow[K]) =>
    setTheme((t) => (t ? { ...t, [key]: value } : t));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
      </div>
    );
  }

  if (!theme) {
    return <div className="text-center text-ink-500">Не удалось загрузить настройки.</div>;
  }

  return (
    <div>
      <AdminPageHeader
        title="Внешний вид"
        description="Цвета, типографика, скругления и тени. Изменения применяются ко всему сайту."
      />

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        {/* Colors */}
        <section className="rounded-2xl bg-pearl-50 p-6 ring-1 ring-ink-200/60">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Цвета</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ColorField label="Основной" value={theme.primary_color} onChange={(v) => set('primary_color', v)} />
            <ColorField label="Вторичный" value={theme.secondary_color} onChange={(v) => set('secondary_color', v)} />
            <ColorField label="Акцент" value={theme.accent_color} onChange={(v) => set('accent_color', v)} />
            <ColorField label="Фон" value={theme.background_color} onChange={(v) => set('background_color', v)} />
            <ColorField label="Текст" value={theme.text_color} onChange={(v) => set('text_color', v)} />
            <ColorField label="Заголовки" value={theme.heading_color} onChange={(v) => set('heading_color', v)} />
            <ColorField label="Осн. кнопка" value={theme.button_primary_color} onChange={(v) => set('button_primary_color', v)} />
            <ColorField label="Втор. кнопка" value={theme.button_secondary_color} onChange={(v) => set('button_secondary_color', v)} />
            <ColorField label="Текст кнопки" value={theme.button_text_color} onChange={(v) => set('button_text_color', v)} />
            <ColorField label="Карточки" value={theme.card_color} onChange={(v) => set('card_color', v)} />
            <ColorField label="Footer" value={theme.footer_color} onChange={(v) => set('footer_color', v)} />
            <ColorField label="Ссылки" value={theme.link_color} onChange={(v) => set('link_color', v)} />
          </div>
        </section>

        {/* Typography */}
        <section className="rounded-2xl bg-pearl-50 p-6 ring-1 ring-ink-200/60">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Типографика</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Шрифт заголовков" name="heading_font">
              <Select value={theme.heading_font} onChange={(e) => set('heading_font', e.target.value)}>
                {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </Select>
            </FormField>
            <FormField label="Шрифт текста" name="body_font">
              <Select value={theme.body_font} onChange={(e) => set('body_font', e.target.value)}>
                {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </Select>
            </FormField>
            <FormField label="Размер гл. заголовка" name="heading_size">
              <Select value={theme.heading_size} onChange={(e) => set('heading_size', e.target.value)}>
                <option value="2xl">Маленький</option>
                <option value="3xl">Средний</option>
                <option value="4xl">Большой</option>
                <option value="5xl">Очень большой</option>
                <option value="6xl">Максимальный</option>
              </Select>
            </FormField>
            <FormField label="Размер заголовков секций" name="section_heading_size">
              <Select value={theme.section_heading_size} onChange={(e) => set('section_heading_size', e.target.value)}>
                <option value="xl">Маленький</option>
                <option value="2xl">Средний</option>
                <option value="3xl">Большой</option>
                <option value="4xl">Очень большой</option>
              </Select>
            </FormField>
            <FormField label="Размер текста" name="body_size">
              <Select value={theme.body_size} onChange={(e) => set('body_size', e.target.value)}>
                <option value="sm">Маленький</option>
                <option value="base">Средний</option>
                <option value="lg">Большой</option>
              </Select>
            </FormField>
            <FormField label="Толщина шрифта" name="font_weight">
              <Select value={theme.font_weight} onChange={(e) => set('font_weight', e.target.value)}>
                <option value="300">Тонкий (300)</option>
                <option value="400">Обычный (400)</option>
                <option value="500">Средний (500)</option>
                <option value="600">Полужирный (600)</option>
                <option value="700">Жирный (700)</option>
              </Select>
            </FormField>
            <FormField label="Межстрочный интервал" name="line_height">
              <Select value={theme.line_height} onChange={(e) => set('line_height', e.target.value)}>
                <option value="1.3">Компактный (1.3)</option>
                <option value="1.5">Обычный (1.5)</option>
                <option value="1.7">Просторный (1.7)</option>
                <option value="2.0">Очень просторный (2.0)</option>
              </Select>
            </FormField>
            <FormField label="Ширина контента (px)" name="content_width">
              <TextInput type="number" min={640} max={1920} value={theme.content_width} onChange={(e) => set('content_width', parseInt(e.target.value) || 1152)} />
            </FormField>
          </div>
        </section>

        {/* Forms & Shapes */}
        <section className="rounded-2xl bg-pearl-50 p-6 ring-1 ring-ink-200/60">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Формы и скругления</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Скругление кнопок (px)" name="button_radius">
              <TextInput type="number" min={0} max={40} value={theme.button_radius} onChange={(e) => set('button_radius', parseInt(e.target.value) || 0)} />
            </FormField>
            <FormField label="Скругление карточек (px)" name="card_radius">
              <TextInput type="number" min={0} max={40} value={theme.card_radius} onChange={(e) => set('card_radius', parseInt(e.target.value) || 0)} />
            </FormField>
            <FormField label="Скругление полей (px)" name="input_radius">
              <TextInput type="number" min={0} max={40} value={theme.input_radius} onChange={(e) => set('input_radius', parseInt(e.target.value) || 0)} />
            </FormField>
            <FormField label="Размер кнопок" name="button_size">
              <Select value={theme.button_size} onChange={(e) => set('button_size', e.target.value)}>
                <option value="sm">Маленький</option>
                <option value="md">Средний</option>
                <option value="lg">Большой</option>
              </Select>
            </FormField>
            <FormField label="Толщина границ (px)" name="border_width">
              <TextInput type="number" min={0} max={5} value={theme.border_width} onChange={(e) => set('border_width', parseInt(e.target.value) || 0)} />
            </FormField>
            <FormField label="Тени" name="shadow_intensity">
              <Select value={theme.shadow_intensity} onChange={(e) => set('shadow_intensity', e.target.value)}>
                <option value="none">Выключены</option>
                <option value="light">Слабые</option>
                <option value="medium">Средние</option>
                <option value="strong">Сильные</option>
              </Select>
            </FormField>
            <FormField label="Внутренние отступы (px)" name="padding">
              <TextInput type="number" min={0} max={64} value={theme.padding} onChange={(e) => set('padding', parseInt(e.target.value) || 0)} />
            </FormField>
            <FormField label="Расстояние между элементами (px)" name="gap">
              <TextInput type="number" min={0} max={64} value={theme.gap} onChange={(e) => set('gap', parseInt(e.target.value) || 0)} />
            </FormField>
            <label className="flex items-center gap-2.5 text-sm font-medium text-ink-800">
              <input
                type="checkbox"
                checked={theme.border_enabled}
                onChange={(e) => set('border_enabled', e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-orange-500 focus:ring-orange-500"
              />
              Показывать границы
            </label>
          </div>
        </section>

        <div className="flex justify-end gap-2">
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
