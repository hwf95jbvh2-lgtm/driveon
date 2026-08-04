import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { NewExperience, ExperienceResult, FormFieldRow } from '@/types';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput, TextArea, Select } from '@/components/ui/FormField';
import { fetchFormFields } from '@/lib/data';
import { useContentValue } from '@/context/ContentContext';

interface ExperienceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewExperience) => Promise<void>;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const empty: NewExperience = {
  city: '',
  examDate: '',
  category: 'B',
  result: 'passed',
  experience: '',
  comment: '',
};

export function ExperienceFormModal({
  open,
  onClose,
  onSubmit,
}: ExperienceFormModalProps) {
  const [form, setForm] = useState<NewExperience>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [fields, setFields] = useState<FormFieldRow[]>([]);

  const successMessage = useContentValue('experience_form.success_message', 'Спасибо! Рассказ отправлен на проверку.');
  const buttonLabel = useContentValue('experience_form.button', 'Отправить рассказ');

  useEffect(() => {
    if (open) {
      fetchFormFields(true).then(setFields).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setForm(empty);
        setErrors({});
        setStatus('idle');
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    for (const field of fields) {
      if (field.required) {
        const val = (form as Record<string, unknown>)[field.field_key];
        if (!val || (typeof val === 'string' && !val.trim())) {
          e[field.field_key] = `Заполните поле «${field.label}»`;
        }
      }
    }
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStatus('submitting');
    try {
      await onSubmit(form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const set = <K extends keyof NewExperience>(key: K, value: NewExperience[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const renderField = (field: FormFieldRow) => {
    const fieldKey = field.field_key as keyof NewExperience;
    const error = errors[field.field_key];
    const value = form[fieldKey] ?? '';
    const placeholder = field.placeholder ?? '';

    const commonProps = {
      name: field.field_key,
      value: typeof value === 'string' ? value : String(value ?? ''),
      invalid: !!error,
      placeholder,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (field.field_key === 'result') {
          set('result', e.target.value as ExperienceResult);
        } else {
          set(fieldKey, e.target.value as NewExperience[typeof fieldKey]);
        }
      },
    };

    return (
      <FormField
        key={field.id}
        label={field.label}
        name={field.field_key}
        required={field.required}
        error={error}
      >
        {field.field_type === 'textarea' ? (
          <TextArea {...commonProps} />
        ) : field.field_type === 'select' ? (
          <Select {...commonProps}>
            {field.field_key === 'result' ? (
              <>
                <option value="passed">Сдал</option>
                <option value="failed">Не сдал</option>
              </>
            ) : (
              <>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="BE">BE</option>
              </>
            )}
          </Select>
        ) : (
          <TextInput {...commonProps} type={field.field_type === 'date' ? 'date' : 'text'} />
        )}
      </FormField>
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Рассказать о своём экзамене"
    >
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-pearl-50 shadow-2xl animate-scale-in sm:rounded-3xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-ink-200/60 bg-pearl-50/95 px-5 py-4 backdrop-blur sm:px-6">
          <h2 className="h3">Рассказать о своём экзамене</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-600 hover:bg-ink-900/5"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-teal-600" />
            <p className="font-display text-xl font-semibold text-ink-900">
              {successMessage}
            </p>
            <p className="small-text max-w-sm">
              После проверки он появится в списке историй сдающих.
            </p>
            <Button variant="secondary" size="md" onClick={onClose} className="mt-2">
              Закрыть
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5 sm:px-6" noValidate>
            {fields.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {fields.filter((f) => f.field_key !== 'experience' && f.field_key !== 'comment').map(renderField)}
                </div>
                {fields.filter((f) => f.field_key === 'experience' || f.field_key === 'comment').map(renderField)}
              </>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Город" name="city" required>
                  <TextInput name="city" value={form.city} placeholder="Владивосток" onChange={(e) => set('city', e.target.value)} />
                </FormField>
                <FormField label="Дата экзамена" name="examDate" required>
                  <TextInput name="examDate" type="date" value={form.examDate} onChange={(e) => set('examDate', e.target.value)} />
                </FormField>
                <FormField label="Категория" name="category" required>
                  <Select name="category" value={form.category} onChange={(e) => set('category', e.target.value)}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="BE">BE</option>
                  </Select>
                </FormField>
                <FormField label="Результат" name="result" required>
                  <Select name="result" value={form.result} onChange={(e) => set('result', e.target.value as ExperienceResult)}>
                    <option value="passed">Сдал</option>
                    <option value="failed">Не сдал</option>
                  </Select>
                </FormField>
                <FormField label="Что происходило на экзамене" name="experience" required>
                  <TextArea name="experience" value={form.experience} placeholder="Опишите свой опыт" onChange={(e) => set('experience', e.target.value)} />
                </FormField>
                <FormField label="Дополнительный комментарий" name="comment">
                  <TextArea name="comment" value={form.comment ?? ''" onChange={(e) => set('comment', e.target.value)} />
                </FormField>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-3 text-sm text-orange-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Не удалось отправить. Попробуйте ещё раз.
              </div>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" size="md" onClick={onClose}>
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Отправка…
                  </>
                ) : (
                  buttonLabel
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
