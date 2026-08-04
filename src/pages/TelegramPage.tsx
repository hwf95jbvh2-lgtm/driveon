import { Send } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { useContentValue } from '@/context/ContentContext';
import { ButtonAnchor } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Rings, Squiggle, Dots } from '@/components/decorations/Decorations';
import { useSeo } from '@/hooks/useSeo';

export function TelegramPage() {
  const { telegramUrl } = useSiteConfig();
  const title = useContentValue('telegram.title', 'Больше информации — в Telegram');
  const subtitle = useContentValue('telegram.subtitle', 'Новости, обсуждение экзаменов и опыт других сдающих.');
  const buttonLabel = useContentValue('telegram.button', 'Перейти в Telegram');
  useSeo({
    title: 'Telegram — DriveON',
    description: subtitle,
  });

  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <Rings className="absolute right-6 top-10 text-teal-500/30" />
          <Dots className="absolute left-6 bottom-10 hidden text-orange-500/30 sm:block" />
          <Squiggle className="absolute right-24 top-40 hidden text-teal-600/40 lg:block" />

          <div className="relative max-w-2xl">
            <span className="label mb-4 inline-block rounded-full bg-teal-500/15 px-3 py-1 text-teal-700">
              Telegram
            </span>
            <h1 className="h1">{title}</h1>
            <p className="body-text mt-6">
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
    </Layout>
  );
}
