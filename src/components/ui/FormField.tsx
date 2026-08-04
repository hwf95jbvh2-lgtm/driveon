import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  hint?: string;
}

export function FormField({
  label,
  name,
  required,
  error,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-semibold text-ink-800">
        {label}
        {required && <span className="text-orange-500"> *</span>}
      </label>
      {children}
      {hint && !error && <span className="small-text">{hint}</span>}
      {error && (
        <span className="text-sm text-orange-600 font-medium">{error}</span>
      )}
    </div>
  );
}

const inputBase =
  'w-full rounded-xl border bg-pearl-50 px-4 py-3 text-ink-900 placeholder:text-ink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500';

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean },
) {
  const { invalid, className = '', ...rest } = props;
  return (
    <input
      id={rest.name}
      className={`${inputBase} ${
        invalid ? 'border-orange-500' : 'border-ink-200'
      } ${className}`}
      {...rest}
    />
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean },
) {
  const { invalid, className = '', ...rest } = props;
  return (
    <textarea
      id={rest.name}
      rows={4}
      className={`${inputBase} resize-y ${
        invalid ? 'border-orange-500' : 'border-ink-200'
      } ${className}`}
      {...rest}
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean },
) {
  const { invalid, className = '', children, ...rest } = props;
  return (
    <select
      id={rest.name}
      className={`${inputBase} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22><path d=%22M2 4l4 4 4-4%22 stroke=%22%231A1A17%22 fill=%22none%22 stroke-width=%221.5%22/></svg>')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10 ${
        invalid ? 'border-orange-500' : 'border-ink-200'
      } ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}
