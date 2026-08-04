import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-orange-500 text-pearl-100 hover:bg-orange-600 active:bg-orange-700 shadow-sm',
  secondary:
    'bg-teal-500 text-pearl-50 hover:bg-teal-600 active:bg-teal-700 shadow-sm',
  outline:
    'border-2 border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-pearl-100 active:bg-ink-800',
  ghost: 'text-ink-700 hover:bg-ink-900/5 active:bg-ink-900/10',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm sm:text-base',
  lg: 'px-7 py-3.5 text-base sm:text-lg',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

interface LinkButtonProps extends BaseProps {
  to: string;
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  to,
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}

interface AnchorButtonProps extends BaseProps {
  href: string;
}

export function ButtonAnchor({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  href,
}: AnchorButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
