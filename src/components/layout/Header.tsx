import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Send } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { useContentValue } from '@/context/ContentContext';
import { ButtonAnchor } from '@/components/ui/Button';
import { fetchNavItems } from '@/lib/data';
import type { NavItemRow } from '@/types';

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { telegramUrl } = useSiteConfig();
  const [navLinks, setNavLinks] = useState<NavItemRow[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchNavItems('header');
        if (mounted) setNavLinks(data.filter((n) => n.visible));
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const telegramButtonLabel = useContentValue('header.telegram_button', 'Открыть Telegram');

  const renderNavLink = (link: NavItemRow, className: string) => {
    if (link.url.startsWith('/')) {
      return (
        <NavLink
          key={link.id}
          to={link.url}
          className={({ isActive }) =>
            className.includes('rounded-full')
              ? `${className} ${isActive ? 'bg-ink-900/8 text-ink-900' : 'text-ink-600 hover:text-ink-900 hover:bg-ink-900/5'}`
              : `${className} ${isActive ? 'bg-ink-900/8 text-ink-900' : 'text-ink-700 hover:bg-ink-900/5'}`
          }
        >
          {link.label}
        </NavLink>
      );
    }
    return (
      <a
        key={link.id}
        href={link.url}
        target={link.open_in_new_tab ? '_blank' : undefined}
        rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {link.label}
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/60 bg-pearl-100/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="DriveON — на главную">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
            <span className="h-4 w-4 rounded-full border-2 border-pearl-100" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink-900">
            Drive<span className="text-orange-500">ON</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) =>
            renderNavLink(link, 'rounded-full px-4 py-2 text-sm font-medium transition-colors'),
          )}
        </nav>

        <div className="hidden md:block">
          <ButtonAnchor href={telegramUrl} size="sm">
            <Send className="h-4 w-4" />
            {telegramButtonLabel}
          </ButtonAnchor>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-900 hover:bg-ink-900/5 md:hidden"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-200/60 bg-pearl-100 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) =>
              renderNavLink(link, 'rounded-xl px-4 py-3 text-base font-medium transition-colors'),
            )}
            <ButtonAnchor href={telegramUrl} size="md" className="mt-2 w-full">
              <Send className="h-4 w-4" />
              {telegramButtonLabel}
            </ButtonAnchor>
          </nav>
        </div>
      )}
    </header>
  );
}
