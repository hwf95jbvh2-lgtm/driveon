import { useContentValue } from '@/context/ContentContext';

export function DisclaimerSection() {
  const title = useContentValue('disclaimer.title', 'Дисклеймер');
  const text1 = useContentValue('disclaimer.text_1', 'Информация на данной странице носит исключительно ознакомительный характер и не является официальным разъяснением законодательства РФ, административным регламентом или юридической консультацией.');
  const text2 = useContentValue('disclaimer.text_2', 'Сведения получены из открытых источников и могут отличаться в зависимости от региона. Порядок сдачи экзаменов, перечень документов, сроки и штрафные баллы подлежат изменению.');
  const text3 = useContentValue('disclaimer.text_3', 'Материалы не являются публичной офертой и не заменяют официальную информацию на сайтах ГИБДД и Госуслуги.');
  const text4 = useContentValue('disclaimer.text_4', 'Рекомендуем уточнять актуальные данные в автошколе или в ГИБДД. Администрация не несёт ответственности за использование материалов сайта.');

  return (
    <section className="border-b border-ink-200/60 bg-pearl-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl bg-ink-900/5 p-6 ring-1 ring-ink-200/40">
          <h2 className="font-display text-lg font-semibold text-ink-700">{title}</h2>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-600">
            <p>{text1}</p>
            <p>{text2}</p>
            <p>{text3}</p>
            <p>{text4}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
