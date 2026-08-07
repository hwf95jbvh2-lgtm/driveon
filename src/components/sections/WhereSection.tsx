import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { fetchStreetLists } from '@/lib/data';
import type { CityStreetList } from '@/types';
import { CityLink } from '@/components/cards/CityLink';
import { Dots, ArcShape } from '@/components/decorations/Decorations';
import { useContentValue } from '@/context/ContentContext';

export function WhereSection() {
const [lists, setLists] = useState\<CityStreetList[]>([]);
const [loading, setLoading] = useState(true);

const label = useContentValue('where.label', 'Где проходит экзамен');
const title = useContentValue('where.title', 'Где проходит экзамен?');
const text1 = useContentValue('where.text\_1', 'Фиксированные маршруты экзамена отменены. Теперь практический экзамен может проходить на любом участке улиц города, который соответствует требованиям для его проведения.');
const text2 = useContentValue('where.text\_2', 'Мы собрали перечни улиц, на которых может проводиться экзамен.');
const warning = useContentValue('where.warning', 'Это не маршруты экзамена. Перечень улиц показывает возможные места проведения экзамена.');

useEffect(() => {
let mounted = true;
(async () => {
try {
const data = await fetchStreetLists(true);
if (mounted) setLists(data);
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

return (





```
    <div className="relative max-w-2xl">
      <span className="label mb-4 inline-block text-pearl-100/70">
        {label}
      </span>
      <h2 className="h2 text-pearl-50">{title}</h2>
      <p className="mt-5 text-lg leading-relaxed text-pearl-50/90">
        {text1}
      </p>
      <p className="mt-3 text-base leading-relaxed text-pearl-100/80">
        {text2}
      </p>
    </div>

    {loading ? (
      <div className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-pearl-100/30" />
        ))}
      </div>
    ) : lists.length > 0 ? (
      <div className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((item) => (
          <CityLink key={item.id} item={item} />
        ))}
      </div>
    ) : (
      <p className="relative mt-8 text-pearl-100/70">
        Перечни улиц пока не добавлены.
      </p>
    )}

    <div className="relative mt-6 flex items-start gap-3 rounded-2xl bg-orange-500/20 px-5 py-4 ring-1 ring-orange-200/30">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-pearl-50" />
      <p className="text-sm font-medium text-pearl-50">
        {warning}
      </p>
    </div>
  </div>
</section>
```

);
}
