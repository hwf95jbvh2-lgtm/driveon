import { Calendar, MapPin, FileText, ArrowUpRight } from 'lucide-react';
import type { Exam } from '@/types';
import { Card } from '@/components/ui/Card';
import { ExamStatusBadge } from './ExamStatusBadge';

interface ExamCardProps {
  exam: Exam;
}

const statusLabel: Record<Exam['status'], string> = {
  upcoming: 'Предстоит',
  completed: 'Прошёл',
  hidden: 'Скрыт',
};

export function ExamCard({ exam }: ExamCardProps) {
  const date = new Date(exam.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card hover className="flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-ink-500">
          <Calendar className="h-4 w-4 shrink-0" />
          <time dateTime={exam.date} className="text-sm font-medium">
            {date}
          </time>
        </div>
        <ExamStatusBadge status={exam.status} label={statusLabel[exam.status]} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-teal-600" />
          <span className="font-display font-semibold text-lg text-ink-900">
            {exam.city}
          </span>
        </div>
        <span className="text-sm text-ink-600">{exam.examType}</span>
      </div>

      <a
        href={exam.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
      >
        <FileText className="h-4 w-4" />
        Подробнее
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </Card>
  );
}
