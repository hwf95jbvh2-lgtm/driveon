import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
  hover?: boolean;
}

export function Card({
  children,
  className = '',
  as: Tag = 'div',
  hover = false,
}: CardProps) {
  return (
    <Tag
      className={`rounded-2xl bg-pearl-50 border border-ink-200/60 shadow-card ${
        hover ? 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
