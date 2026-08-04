import { Send } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { useContentValue } from '@/context/ContentContext';
import { ButtonAnchor } from '@/components/ui/Button';
import { Rings, Squiggle } from '@/components/decorations/Decorations';

export function TelegramSection() {
  const { telegramUrl } = useSiteConfig();
  const label = useContentValue('telegram.label', 'Telegram');
  const title = useContentValue('telegram.title', 'Больше информации — в Telegram');
  const subtitle = useContentValue('telegram.subtitle', 'Новости, обсуждение экзаменов и опыт других сдающих.');
  const buttonLabel = useContentValue('telegram.button', 'Перейти в Telegram');

  return (
    <section className="bg-ink-900 text-pearl-50">
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Rings className="absolute right-6 top-8 text-orange-500/30" />
        <Squiggle className="absolute left-8 bottom-6 hidden text-teal-400/40 sm:block" />

        <div className="relative max-w-2xl">
          <span className="label mb-4 inline-block text-pearl-100/60">{label}</span>
          <h2 className="h2 text-pearl-50">{title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-pearl-100/80">
            {subtitle}
          </p>
          <div className="mt-8">
            <ButtonAnchor href={telegramUrl} size="lg">
              <Send className="h-5 w-5" />
              {buttonLabel}
            </ButtonAnchor>
          </div>
        </div>
      </div>
    </section>
  );
}
