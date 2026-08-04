import { ArrowUpRight } from 'lucide-react';
import type { CityStreetList } from '@/types';

interface CityLinkProps {
  item: CityStreetList;
}

export function CityLink({ item }: CityLinkProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 rounded-2xl bg-pearl-100 px-5 py-4 text-ink-900 transition-all hover:bg-pearl-50 hover:shadow-card"
    >
      <span className="font-display font-semibold text-base sm:text-lg">
        {item.title}
      </span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500 text-pearl-50 transition-transform group-hover:rotate-45">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </a>
  );
}
