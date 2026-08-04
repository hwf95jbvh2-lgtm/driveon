import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { fetchUsefulPage } from '@/lib/data';
import type { UsefulPageRow, UsefulSection } from '@/types';
import { usefulContent } from '@/data/usefulContent';
import { Card } from '@/components/ui/Card';
import { useSeo } from '@/hooks/useSeo';

export function UsefulArticlePage() {
  const { slug = '' } = useParams();
  const [page, setPage] = useState<UsefulPageRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchUsefulPage(slug);
        if (mounted) setPage(data);
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  // Prefer DB content; fall back to static content if not found or not published
  const fallback = usefulContent[slug];
  const title = page?.title ?? fallback?.title ?? '';
  const intro = page?.description ?? fallback?.intro ?? '';
  const sections: UsefulSection[] =
    page?.content && page.content.length > 0 ? page.content : fallback?.sections ?? [];
  const visible = page ? page.published : true;

  useSeo({
    title: title ? `${title} — DriveON` : 'Полезное — DriveON',
    description: intro,
  });

  if (!loading && !title) {
    return (
      <Layout>
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h1 className="h2">Статья не найдена</h1>
          <Link
            to="/useful"
            className="mt-6 inline-flex items-center gap-1.5 font-semibold text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4" />
            К полезным материалам
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="border-b border-ink-200/60">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            to="/useful"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Полезное
          </Link>

          {loading ? (
            <div className="mt-6 space-y-4">
              <div className="h-10 w-2/3 animate-pulse rounded bg-pearl-200/60" />
              <div className="h-5 w-full animate-pulse rounded bg-pearl-200/60" />
              <div className="h-5 w-4/5 animate-pulse rounded bg-pearl-200/60" />
            </div>
          ) : (
            <>
              <h1 className="mt-6 h1">{title}</h1>
              <p className="body-text mt-5">{intro}</p>

              {visible && (
                <div className="mt-10 flex flex-col gap-10">
                  {sections.map((section, i) => (
                    <section key={i} className="flex flex-col gap-5">
                      <h2 className="h3">{section.heading}</h2>

                      {section.cards && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {section.cards.map((card) => (
                            <Card key={card.title} className="p-5">
                              <h3 className="font-display font-semibold text-base text-ink-900">
                                {card.title}
                              </h3>
                              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                                {card.text}
                              </p>
                            </Card>
                          ))}
                        </div>
                      )}

                      {section.list && (
                        <ul className="flex flex-col gap-2.5">
                          {section.list.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 rounded-xl bg-pearl-50 px-4 py-3 text-ink-800 ring-1 ring-ink-200/60"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                              <span className="text-base leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ))}
                </div>
              )}

              {!visible && (
                <p className="mt-10 text-ink-500">
                  Эта страница скрыта и временно недоступна.
                </p>
              )}
            </>
          )}
        </div>
      </article>
    </Layout>
  );
}
