import { MapPin, Calendar, Tag } from 'lucide-react';
import type { Experience } from '@/types';
import { Card } from '@/components/ui/Card';
import { ResultBadge } from '@/components/ui/ResultBadge';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const date = new Date(experience.examDate).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card hover className="flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <ResultBadge result={experience.result} />
        <span className="inline-flex items-center gap-1 text-sm text-ink-500">
          <MapPin className="h-3.5 w-3.5" />
          {experience.city}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-ink-500">
          <Calendar className="h-3.5 w-3.5" />
          {date}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-ink-500">
          <Tag className="h-3.5 w-3.5" />
          Категория {experience.category}
        </span>
      </div>

      <p className="text-ink-800 leading-relaxed">{experience.experience}</p>

      {experience.comment && (
        <p className="border-l-2 border-teal-400 pl-3 text-sm italic text-ink-600">
          {experience.comment}
        </p>
      )}
    </Card>
  );
}
