import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description?: string;
}

const defaultTitle = 'График экзаменов ГИБДД Владивосток 2026 | DriveON';

export function useSeo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setOg = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (description) {
      setMeta('description', description);
      setOg('og:description', description);
    }
    setOg('og:title', title);

    return () => {
      document.title = defaultTitle;
    };
  }, [title, description]);
}
