import type { ExperienceResult } from '@/types';

interface ResultBadgeProps {
  result: ExperienceResult;
}

export function ResultBadge({ result }: ResultBadgeProps) {
  const passed = result === 'passed';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        passed
          ? 'bg-teal-500/15 text-teal-800 ring-1 ring-teal-500/30'
          : 'bg-orange-500/15 text-orange-700 ring-1 ring-orange-500/30'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          passed ? 'bg-teal-600' : 'bg-orange-500'
        }`}
      />
      {passed ? 'Сдал' : 'Не сдал'}
    </span>
  );
}
