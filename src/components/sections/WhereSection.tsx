import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { fetchStreetLists } from '@/lib/data';
import type { CityStreetList } from '@/types';
import { CityLink } from '@/components/cards/CityLink';
import { Dots, ArcShape } from '@/components/decorations/Decorations';
import { useContentValue } from '@/context/ContentContext';

export function WhereSection() {
  const [lists, setLists] = useState<CityStreetList[]>([]);
  const [loading, setLoading] = useState(true);

  const label = useContentValue('where.label', 'Где проходит экзамен');
  const title = useContentValue('where.title', 'Где проходит экзамен?');
  const text1 = useContentValue('where.text_1', 'Фиксированные маршруты экзамена отменены. Теперь практический экзамен может проходить на любом участке улиц города, который соответствует требованиям для его проведения.');
  const text2 = useContentValue('where.text_2', 'Мы собрали перечни улиц, на которых может проводиться экзамен.');
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
