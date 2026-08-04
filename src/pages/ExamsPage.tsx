import { useEffect, useState } from 'react';
import { CalendarClock, FileText, ArrowUpRight, Info } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { fetchScheduleLinks } from '@/lib/data';
import type { ExamScheduleLink } from '@/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSeo } from '@/hooks/useSeo';

export function ExamsPage() {
  useSeo({
    title: 'Экзамены в ГИБДД — DriveON',
    description: 'Актуальная информация о предстоящих экзаменах в ГИБДД: графики проведения экзаменов по месяцам.',
  });

  const [links, setLinks] = useState<ExamScheduleLink[]>([]);
  const [loading, setLoading] = useState(true);

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
    <Layout>
      <section className="border-b border-ink-200/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader
            label="Экзамены"
            title="Экзамены в ГИБДД"
            subtitle="Актуальная информация о предстоящих экзаменах."
          />

          <p className="mt-6 text-ink-600">
            Выберите месяц, чтобы открыть актуальный график проведения экзаменов.
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

          <p className="mt-8 flex items-center gap-2 rounded-xl bg-teal-500/10 px-4 py-3 text-sm text-teal-800">
            <Info className="h-4 w-4 shrink-0" />
            Данные предоставляются DriveON. Реальные даты уточняйте в официальных источниках.
          </p>
        </div>
      </section>
    </Layout>
  );
}
