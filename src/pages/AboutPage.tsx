import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Dots, ArcShape } from '@/components/decorations/Decorations';
import { useSeo } from '@/hooks/useSeo';
import { useContentValue } from '@/context/ContentContext';

export function AboutPage() {
  const title = useContentValue('about.title', 'О DriveON');
  const text1 = useContentValue('about.text_1', 'DriveON — независимый сервис для тех, кто сдаёт экзамен в ГИБДД.');
  const text2 = useContentValue('about.text_2', 'Мы не обучаем вождению и не принимаем экзамены. Мы собираем актуальную информацию и опыт сдающих, чтобы подготовиться к экзамену было проще.');
  useSeo({
    title: 'О DriveON — независимый сервис для сдающих экзамен',
    description: 'DriveON — независимый digital-сервис для тех, кто сдаёт экзамен в ГИБДД. Мы не обучаем вождению и не принимаем экзамены.',
  });

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-ink-200/60">
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Dots className="absolute right-6 top-10 hidden text-teal-500/30 sm:block" />
          <ArcShape className="absolute -left-8 bottom-6 hidden text-orange-500/20 lg:block" />

          <div className="relative max-w-2xl">
            <span className="label mb-4 inline-block rounded-full bg-teal-500/15 px-3 py-1 text-teal-700">
              О проекте
            </span>
            <h1 className="h1">{title}</h1>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-700">
              <p>{text1}</p>
              <p>{text2}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeader label="Что мы делаем" title="Чем DriveON помогает" />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: 'Экзамены', d: 'Собираем даты и информацию о предстоящих экзаменах.' },
              { t: 'Опыт сдающих', d: 'Показываем реальные истории тех, кто уже сдавал.' },
              { t: 'Полезные материалы', d: 'Готовим короткие гайды по подготовке к экзамену.' },
            ].map((item) => (
              <div key={item.t} className="rounded-2xl bg-pearl-50 p-6 ring-1 ring-ink-200/60">
                <h3 className="font-display font-semibold text-lg text-ink-900">{item.t}</h3>
                <p className="mt-2 text-sm text-ink-600 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-teal-500/10 p-6">
            <h3 className="font-display font-semibold text-lg text-teal-800">
              Чем DriveON не является
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-teal-800/90">
              <li>— Не автошкола и не сайт ГИБДД</li>
              <li>— Не государственный сервис</li>
              <li>— Не сервис записи или бронирования экзамена</li>
            </ul>
          </div>

          <Link
            to="/useful"
            className="mt-10 inline-flex items-center gap-1.5 font-semibold text-orange-600 hover:text-orange-700"
          >
            Перейти к полезным материалам
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
