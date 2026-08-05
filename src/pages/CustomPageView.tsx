import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Layout } from '@/components/layout/Layout';
import { fetchCustomPage } from '@/lib/data';
import type { CustomPageRow, UsefulSection } from '@/types';
import { Card } from '@/components/ui/Card';
import { useSeo } from '@/hooks/useSeo';

export function CustomPageView() {
  const { slug = '' } = useParams();

  const [page, setPage] = useState<CustomPageRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await fetchCustomPage(slug);

        if (mounted) {
          setPage(data);
        }
      } catch {
        // ignore
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  useSeo({
    title: page?.seo_title ?? page?.title ?? 'DriveON',
    description: page?.seo_description ?? '',
  });

  if (!loading && !page) {
    return (
      <Layout>
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h1 className="h1">Страница не найдена</h1>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-1.5 font-semibold text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4" />
            На главную
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
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>

          {loading && (
            <div className="mt-6 space-y-4">
              <div className="h-10 w-2/3 animate-pulse rounded bg-pearl-200/60" />
              <div className="h-5 w-full animate-pulse rounded bg-pearl-200/60" />
            </div>
          )}

          {!loading && page && (
            <>
              <h1 className="mt-6 h1">{page.title}</h1>

              <div className="mt-10 flex flex-col gap-10">
                {(page.content as UsefulSection[]).map((section, i) => (
                  <section key={i} className="flex flex-col gap-5">

                    <h2 className="h3">
                      {section.heading}
                    </h2>

                    {section.cards && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {section.cards.map((card) => (
                          <Card
                            key={card.title}
                            className="p-5"
                          >
                            <h3 className="font-display font-semibold text-base text-ink-900">
                              {card.title}
                            </h3>

                            <p
                              className="mt-2 text-sm leading-relaxed text-ink-600"
                              dangerouslySetInnerHTML={{
                                __html: card.text,
                              }}
                            />
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

                            <span className="text-base leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                  </section>
                ))}
              </div>
            </>
          )}

        </div>
      </article>
    </Layout>
  );
}
