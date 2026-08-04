import { Link } from 'react-router-dom';
import { Send, ArrowRight } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { useContentValue } from '@/context/ContentContext';
import { ButtonLink, ButtonAnchor } from '@/components/ui/Button';
import { Dots, Rings, Squiggle, ArcShape } from '@/components/decorations/Decorations';

export function Hero() {
  const { telegramUrl } = useSiteConfig();
  const badge = useContentValue('hero.badge', 'Независимый digital-сервис');
  const title = useContentValue('hero.title', 'Всё, что нужно знать перед экзаменом в ГИБДД');
  const subtitle = useContentValue('hero.subtitle', 'Даты экзаменов, информация от сдающих и полезные материалы в одном месте.');
  const buttonPrimary = useContentValue('hero.button_primary', 'Экзамены');
  const buttonSecondary = useContentValue('hero.button_secondary', 'Telegram');

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:py-28">
        <div className="relative max-w-3xl">
          <span className="label mb-4 inline-block rounded-full bg-teal-500/15 px-3 py-1 text-teal-700">
            {badge}
          </span>
          <h1 className="h1">
            {title}
          </h1>
          <p className="body-text mt-6 max-w-xl">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/exams" size="lg">
              {buttonPrimary}
              <ArrowRight className="h-5 w-5" />
            </ButtonLink>
            <ButtonAnchor href={telegramUrl} variant="outline" size="lg">
              <Send className="h-5 w-5" />
              {buttonSecondary}
            </ButtonAnchor>
          </div>
        </div>

        {/* Decorative abstract elements */}
        <Rings className="absolute -right-4 top-10 text-teal-500/30 sm:right-8 sm:top-16" />
        <Dots className="absolute right-24 top-44 hidden text-orange-500/40 sm:block" />
        <Squiggle className="absolute -left-2 bottom-8 hidden text-teal-600/40 sm:block" />
        <ArcShape className="absolute -right-10 bottom-0 hidden text-orange-500/30 lg:block" />
      </div>

      {/* Bottom edge */}
      <div className="h-px w-full bg-ink-200/60" />
      <Link to="/about" className="sr-only">
        О DriveON
      </Link>
    </section>
  );
}
