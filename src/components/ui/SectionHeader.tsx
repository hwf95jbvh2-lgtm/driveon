import type { ReactNode } from 'react';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
}

export function SectionHeader({
  label,
  title,
  subtitle,
  align = 'left',
  children,
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  return (
    <div
      className={`flex flex-col gap-3 ${
        isCenter ? 'items-center text-center' : 'items-start'
      }`}
    >
      {label && <span className="label">{label}</span>}
      <h2 className={`h2 ${isCenter ? 'max-w-3xl' : ''}`}>{title}</h2>
      {subtitle && (
        <p
          className={`body-text ${isCenter ? 'max-w-2xl' : 'max-w-xl'}`}
        >
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
