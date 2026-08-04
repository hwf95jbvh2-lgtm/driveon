import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { UsefulArticle } from '@/types';
import { Card } from '@/components/ui/Card';

interface UsefulCardProps {
  article: UsefulArticle;
}

export function UsefulCard({ article }: UsefulCardProps) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[article.icon] ?? Icons.FileText;

  return (
    <Link to={`/useful/${article.slug}`} className="group block h-full">
      <Card hover className="flex h-full flex-col gap-3 p-5 sm:p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 text-teal-700 transition-colors group-hover:bg-orange-500/15 group-hover:text-orange-600">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display font-semibold text-lg text-ink-900">
          {article.title}
        </h3>
        <p className="text-sm text-ink-600 leading-relaxed">{article.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 group-hover:text-orange-700">
          Читать
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Card>
    </Link>
  );
}
