import { useEffect, useState } from 'react';
import { CalendarClock, FileText, ArrowUpRight } from 'lucide-react';
import { fetchScheduleLinks } from '@/lib/data';
import type { ExamScheduleLink } from '@/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ButtonLink } from '@/components/ui/Button';
import { useContentValue } from '@/context/ContentContext';

export function ExamsSection() {
  const [links, setLinks] = useState<ExamScheduleLink[]>([]);
  const [loading, setLoading] = useState(true);

  const label = useContentValue('exams.label', 'Экзамены');
  const title = useContentValue('exams.title', 'Экзамены в ГИБДД');
  const subtitle = useContentValue('exams.subtitle', 'Актуальная информация о предстоящих экзаменах.');
  const description = useContentValue('exams.description', 'Выберите месяц, чтобы открыть актуальный график проведения экзаменов.');
  const buttonAll = useContentValue('exams.button_all', 'Все экзамены');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchScheduleLinks(true);
        if (mounted) setLinks(data);
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="border-b border-ink-200/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            label={label}
            title={title}
            subtitle={subtitle}
          />
          <ButtonLink to="/exams" variant="outline" size="md" className="shrink-0">
            {buttonAll}
          </ButtonLink>
        </div>

        <p className="mt-6 text-ink-600">
          {description}
        </p>

        {loading ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="h-16 w-40 animate-pulse rounded-2xl bg-pearl-200/60" />
            ))}
          </div>
        ) : links.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-orange-500 px-6 py-4 text-pearl-100 shadow-sm transition-all hover:bg-orange-600 hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <CalendarClock className="h-5 w-5" />
                <span className="font-display text-lg font-semibold">{link.label}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-pearl-50 p-10 text-center ring-1 ring-ink-200/60">
            <FileText className="h-8 w-8 text-ink-400" />
            <p className="text-ink-600">Графики экзаменов пока не добавлены.</p>
          </div>
        )}
      </div>
    </section>
  );
}
