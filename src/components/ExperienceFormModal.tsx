import { useState } from 'react';
import { FormField } from '@/components/ui/FormField';

type ExperienceFormModalProps = {
  onSubmit: (data: {
    name: string;
    city: string;
    exam: string;
    date: string;
    comment: string;
  }) => void;
};

type FormState = {
  name: string;
  city: string;
  exam: string;
  date: string;
  comment: string;
};

export function ExperienceFormModal({
  onSubmit,
}: ExperienceFormModalProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    city: '',
    exam: '',
    date: '',
    comment: '',
  });

  const set = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <FormField label="Имя" name="name">
        <input
          name="name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
        />
      </FormField>

      <FormField label="Город" name="city">
        <input
          name="city"
          value={form.city}
          onChange={(e) => set('city', e.target.value)}
          className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
        />
      </FormField>

      <FormField label="Экзамен" name="exam">
        <input
          name="exam"
          value={form.exam}
          onChange={(e) => set('exam', e.target.value)}
          className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
        />
      </FormField>

      <FormField label="Дата экзамена" name="date">
        <input
          name="date"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
          className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
        />
      </FormField>

      <FormField
        label="Дополнительный комментарий"
        name="comment"
      >
        <textarea
          name="comment"
          value={form.comment ?? ''}
          onChange={(e) =>
            set('comment', e.target.value)
          }
          rows={5}
          className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
        />
      </FormField>

      <button
        type="submit"
        className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
      >
        Отправить
      </button>
    </form>
  );
}
