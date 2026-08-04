import type { Exam } from '@/types';

interface ExamStatusBadgeProps {
  status: Exam['status'];
  label: string;
}

export function ExamStatusBadge({ status, label }: ExamStatusBadgeProps) {
  const styles: Record<Exam['status'], string> = {
    upcoming: 'bg-teal-500/15 text-teal-800 ring-1 ring-teal-500/30',
    completed: 'bg-ink-900/8 text-ink-600 ring-1 ring-ink-900/15',
    hidden: 'bg-orange-500/10 text-orange-700 ring-1 ring-orange-500/25',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {label}
    </span>
  );
}
