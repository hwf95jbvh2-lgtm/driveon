import { useEffect, useMemo, useState } from 'react';
import { Filter, PenLine, MessageSquareOff } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { fetchPublishedExperiences, submitExperience } from '@/lib/data';
import type { Experience, NewExperience } from '@/types';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { ExperienceFormModal } from '@/components/ExperienceFormModal';
import { useSeo } from '@/hooks/useSeo';

export function AfterExamPage() {
  useSeo({
    title: 'После экзамена — опыт сдающих — DriveON',
    description: 'Истории тех, кто уже сдавал экзамен в ГИБДД: город, категория, результат и опыт. Поделитесь своей историей.',
  });

  const [open, setOpen] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Все города');
  const [category, setCategory] = useState('Все категории');
  const [result, setResult] = useState('Все результаты');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchPublishedExperiences();
        if (mounted) setExperiences(data);
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

  const cities = useMemo(
    () => ['Все города', ...Array.from(new Set(experiences.map((e) => e.city)))],
    [experiences],
  );
  const categories = useMemo(
    () => ['Все категории', ...Array.from(new Set(experiences.map((e) => e.category)))],
    [experiences],
  );
  const results = ['Все результаты', 'Сдал', 'Не сдал'];

  const filtered = experiences.filter((e) => {
    const matchCity = city === 'Все города' || e.city === city;
    const matchCat = category === 'Все категории' || e.category === category;
    const matchRes =
      result === 'Все результаты' ||
      (result === 'Сдал' && e.result === 'passed') ||
      (result === 'Не сдал' && e.result === 'failed');
    return matchCity && matchCat && matchRes;
  });

  const handleSubmit = async (data: NewExperience) => {
    await submitExperience(data);
  };

  const filterGroup = (
    label: string,
    value: string,
    options: string[],
    onChange: (v: string) => void,
  ) => (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              value === opt
                ? 'bg-ink-900 text-pearl-100'
                : 'bg-pearl-50 text-ink-700 ring-1 ring-ink-200 hover:bg-pearl-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Layout>
      <section className="border-b border-ink-200/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              label="После экзамена"
              title="Как прошёл экзамен?"
              subtitle="Опыт тех, кто уже сдавал, помогает подготовиться следующим."
            />
            <Button variant="primary" size="md" className="shrink-0" onClick={() => setOpen(true)}>
              <PenLine className="h-4 w-4" />
              Рассказать о своём экзамене
            </Button>
          </div>

          {!loading && experiences.length > 0 && (
            <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-pearl-50 p-5 ring-1 ring-ink-200/60 sm:flex-row sm:items-start sm:gap-6">
              <span className="hidden items-center gap-1.5 pt-1 text-sm font-medium text-ink-600 sm:inline-flex">
                <Filter className="h-4 w-4" />
                Фильтры:
              </span>
              {filterGroup('Город', city, cities, setCity)}
              {filterGroup('Категория', category, categories, setCategory)}
              {filterGroup('Результат', result, results, setResult)}
            </div>
          )}

          {loading ? (
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-pearl-200/60" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-pearl-50 p-10 text-center ring-1 ring-ink-200/60">
              <MessageSquareOff className="h-8 w-8 text-ink-400" />
              <p className="text-ink-600">
                {experiences.length === 0
                  ? 'Опубликованные истории пока не добавлены.'
                  : 'Истории с такими фильтрами не найдены.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <ExperienceFormModal open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
    </Layout>
  );
}
