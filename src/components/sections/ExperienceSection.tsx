import { useEffect, useState } from 'react';
import { PenLine } from 'lucide-react';
import { fetchPublishedExperiences, submitExperience } from '@/lib/data';
import type { Experience, NewExperience } from '@/types';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { ExperienceFormModal } from '@/components/ExperienceFormModal';
import { useContentValue } from '@/context/ContentContext';

export function ExperienceSection() {
  const label = useContentValue('experience.label', 'После экзамена');
  const title = useContentValue('experience.title', 'Как прошёл экзамен?');
  const subtitle = useContentValue('experience.subtitle', 'Опыт тех, кто уже сдавал, помогает подготовиться следующим.');
  const buttonLabel = useContentValue('experience.button', 'Рассказать о своём экзамене');
  const [open, setOpen] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchPublishedExperiences();
      setExperiences(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (data: NewExperience) => {
    await submitExperience(data);
  };

  const featured = experiences.slice(0, 3);

  return (
    <section className="border-b border-ink-200/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            label={label}
            title={title}
            subtitle={subtitle}
          />
          <Button
            variant="primary"
            size="md"
            className="shrink-0"
            onClick={() => setOpen(true)}
          >
            <PenLine className="h-4 w-4" />
            {buttonLabel}
          </Button>
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-pearl-200/60" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-ink-500">
            Опубликованные истории пока не добавлены.
          </p>
        )}
      </div>

      <ExperienceFormModal open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
    </section>
  );
}
