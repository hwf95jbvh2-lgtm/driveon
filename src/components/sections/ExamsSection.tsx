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
  const subtitle = useContentValue(
    'exams.subtitle',
    'Актуальная информация о предстоящих экзаменах.'
  );
  const description = useContentValue(
    'exams.description',
    'Выберите месяц, чтобы открыть актуальный график проведения экзаменов.'
  );
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
    <section className="py-10 sm:py-12">
      <div className="container mx-auto">
        <SectionHeader
          label={label}
          title={title}
          subtitle={subtitle}
        />

        <p className="mt-3 text-ink-600">
          {description}
        </p>

        <div className="mt-5">
          <ButtonLink to="/exams">
            {buttonAll}
          </ButtonLink>
        </div>

        {loading ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-14 w-36 animate-pulse rounded-2xl bg-pearl-200/60"
              />
            ))}
          </div>
        ) : links.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-orange-500 px-5 py-3 text-pearl-100 shadow-sm transition-all hover:bg-orange-600 hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <CalendarClock className="h-5 w-5" />
                <span className="font-display text-base font-semibold">
                  {link.label}
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl bg-pearl-50 p-6 text-center ring-1 ring-ink-200/60">
            <FileText className="h-8 w-8 text-ink-400" />
            <p className="text-ink-600">
              Графики экзаменов пока не добавлены.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
