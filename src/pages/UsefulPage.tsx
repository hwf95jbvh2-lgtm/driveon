import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { fetchAllUsefulPages } from '@/lib/data';
import type { UsefulPageRow } from '@/types';
import { UsefulCard } from '@/components/cards/UsefulCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSeo } from '@/hooks/useSeo';
import { usefulArticles } from '@/data/mockData';

export function UsefulPage() {
  useSeo({
    title: 'Полезное перед экзаменом — DriveON',
    description: 'Короткие материалы для подготовки к экзамену в ГИБДД: как проходит экзамен, что взять с собой, частые ошибки и другое.',
  });

  const [pages, setPages] = useState<UsefulPageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchAllUsefulPages();
        if (mounted) setPages(data);
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const articles = pages
    .filter((p) => p.published)
    .map((p) => {
      const meta = usefulArticles.find((a) => a.slug === p.slug);
      return {
        slug: p.slug,
        title: p.title,
        description: p.description,
        icon: meta?.icon ?? 'FileText',
      };
    });

  return (
    <Layout>
      <section className="border-b border-ink-200/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader
            label="Полезное"
            title="Полезное перед экзаменом"
            subtitle="Короткие материалы, которые помогут подготовиться."
          />
          {loading ? (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl bg-pearl-200/60" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <UsefulCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
