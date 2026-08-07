import { Link } from 'react-router-dom';
import { Send, ArrowRight } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { useContentValue } from '@/context/ContentContext';
import { ButtonLink, ButtonAnchor } from '@/components/ui/Button';
import { Dots, Rings, Squiggle, ArcShape } from '@/components/decorations/Decorations';

export function Hero() {
  const { telegramUrl } = useSiteConfig();

  const badge = useContentValue(
    'hero.badge',
    'Независимый digital-сервис'
  );

  const title = useContentValue(
    'hero.title',
    'Всё, что нужно знать перед экзаменом в ГИБДД'
  );

  const subtitle = useContentValue(
    'hero.subtitle',
    'Даты экзаменов, информация от сдающих и полезные материалы в одном месте.'
  );

  const buttonPrimary = useContentValue(
    'hero.button_primary',
    'Экзамены'
  );

  const buttonSecondary = useContentValue(
    'hero.button_secondary',
    'Telegram'
  );

  return (
    <section className="relative overflow-hidden py-8 sm:py-12">
      <div className="container relative mx-auto flex min-h-[50vh] items-center">
        <div className="max-w-3xl">

          <div className="mb-2 inline-flex rounded-full px-4 py-1.5 text-sm">
            {badge}
          </div>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-base sm:text-lg">
            {subtitle}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/exams" size="lg">
              {buttonPrimary}
              <ArrowRight className="h-5 w-5" />
            </ButtonLink>

            <ButtonAnchor
              href={telegramUrl}
              variant="outline"
              size="lg"
            >
              <Send className="h-5 w-5" />
              {buttonSecondary}
            </ButtonAnchor>
          </div>

        </div>

        <Rings className="absolute -right-4 top-10 text-teal-500/30 sm:right-8 sm:top-16" />
        <Dots className="absolute right-24 top-44 hidden text-orange-500/40 sm:block" />
        <Squiggle className="absolute -left-2 bottom-8 hidden text-teal-600/40 sm:block" />
        <ArcShape className="absolute -right-10 bottom-0 hidden text-orange-500/30 lg:block" />

      </div>

      <div className="h-px w-full bg-ink-200/60" />

      <Link to="/about" className="sr-only">
        О DriveON
      </Link>
    </section>
  );
}
