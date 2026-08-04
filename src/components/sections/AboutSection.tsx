import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Dots } from '@/components/decorations/Decorations';
import { useContentValue } from '@/context/ContentContext';

export function AboutSection() {
  const label = useContentValue('about.label', 'О проекте');
  const title = useContentValue('about.title', 'О DriveON');
  const text1 = useContentValue('about.text_1', 'DriveON — независимый сервис для тех, кто сдаёт экзамен в ГИБДД.');
  const text2 = useContentValue('about.text_2', 'Мы не обучаем вождению и не принимаем экзамены. Мы собираем актуальную информацию и опыт сдающих, чтобы подготовиться к экзамену было проще.');
  const linkLabel = useContentValue('about.link', 'Подробнее о проекте');

  return (
    <section className="border-b border-ink-200/60">
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Dots className="absolute right-6 top-10 hidden text-teal-500/30 sm:block" />
        <div className="relative max-w-2xl">
          <SectionHeader label={label} title={title} />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-700">
            <p>{text1}</p>
            <p>{text2}</p>
          </div>
          <Link
            to="/about"
            className="mt-6 inline-flex items-center gap-1.5 font-semibold text-orange-600 hover:text-orange-700"
          >
            {linkLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
