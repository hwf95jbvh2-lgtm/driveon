import { useState } from 'react';
import { X } from 'lucide-react';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { FormField } from '@/components/ui/FormField';

type ExperienceFormModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormState = {
  name: string;
  city: string;
  exam: string;
  date: string;
  comment: string;
};

export function ExperienceFormModal({
  open,
  onClose,
}: ExperienceFormModalProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    city: '',
    exam: '',
    date: '',
    comment: '',
  });

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // отправка формы будет подключена отдельно
    console.log(form);

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-0 top-0 rounded-full p-2 text-ink-500 hover:bg-pearl-100"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="h2 pr-8">
          Поделиться опытом экзамена
        </h2>

        <form
          onSubmit={submit}
          className="mt-6 flex flex-col gap-5"
        >
          <FormField
            label="Имя"
            name="name"
          >
            <input
              name="name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="input"
            />
          </FormField>

          <FormField
            label="Город"
            name="city"
          >
            <input
              name="city"
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              className="input"
            />
          </FormField>

          <FormField
            label="Экзамен"
            name="exam"
          >
            <input
              name="exam"
              value={form.exam}
              onChange={(e) => set('exam', e.target.value)}
              className="input"
            />
          </FormField>

          <FormField
            label="Дата экзамена"
            name="date"
          >
            <input
              name="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className="input"
            />
          </FormField>

          <FormField
            label="Дополнительный комментарий"
            name="comment"
          >
            <TextArea
              name="comment"
              value={form.comment ?? ''}
              onChange={(e) => set('comment', e.target.value)}
            />
          </FormField>

          <Button type="submit">
            Отправить
          </Button>
        </form>
      </div>
    </Modal>
  );
}
