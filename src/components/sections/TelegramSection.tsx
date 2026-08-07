import { Send } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { useContentValue } from '@/context/ContentContext';
import { ButtonAnchor } from '@/components/ui/Button';
import { Rings, Squiggle } from '@/components/decorations/Decorations';

export function TelegramSection() {
  const { telegramUrl } = useSiteConfig();

  const label = useContentValue('telegram.label', 'Telegram');
  const title = useContentValue(
    'telegram.title',
    'Больше информации — в Telegram'
  );
  const subtitle = useContentValue(
    'telegram.subtitle',
    'Новости, обсуждение экзаменов и опыт других сдающих.'
  );
  const buttonLabel = useContentValue(
    'telegram.button',
    'Перейти в Telegram'
  );

  return (
    <section className="py-10 sm:py-12">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-3xl px-6 py-8 sm:px-10 sm:py-10">

          <div className="relative max-w-2xl">
            <span className="label mb-2 inline-block text-pearl-100/60">
              {label}
            </span>

            <h2 className="h2 text-pearl-50">
              {title}
            </h2>

            <p className="mt-3 text-base leading-relaxed text-pearl-100/80 sm:text-lg">
              {subtitle}
            </p>

            <div className="mt-5">
              <ButtonAnchor href={telegramUrl} size="lg">
                <Send className="h-5 w-5" />
                {buttonLabel}
              </ButtonAnchor>
            </div>
          </div>

          <Rings className="absolute -right-4 top-8 text-teal-500/30" />
          <Squiggle className="absolute -left-2 bottom-4 text-teal-600/40" />

        </div>
      </div>
    </section>
  );
}
