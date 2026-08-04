import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { useContentValue } from '@/context/ContentContext';
import { fetchNavItems } from '@/lib/data';
import type { NavItemRow } from '@/types';

export function Footer() {
  const { telegramUrl } = useSiteConfig();
  const [footerLinks, setFooterLinks] = useState<NavItemRow[]>([]);

  const aboutText = useContentValue('footer.about', 'DriveON — информация для тех, кто сдаёт экзамен.');
  const copyrightText = useContentValue('footer.copyright', 'Независимый сервис. Не связан с ГИБДД и автошколами.');
  const telegramLabel = useContentValue('footer.telegram_button', 'Telegram');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchNavItems('footer');
        if (mounted) setFooterLinks(data.filter((n) => n.visible));
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer className="border-t border-ink-200/60 bg-pearl-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
                <span className="h-4 w-4 rounded-full border-2 border-pearl-100" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-ink-900">
                Drive<span className="text-orange-500">ON</span>
              </span>
            </Link>
            <p className="max-w-xs small-text">{aboutText}</p>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
            {footerLinks.map((link) =>
              link.url.startsWith('/') ? (
                <Link
                  key={link.id}
                  to={link.url}
                  className="text-sm text-ink-600 hover:text-ink-900 transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.open_in_new_tab ? '_blank' : undefined}
                  rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
                  className="text-sm text-ink-600 hover:text-ink-900 transition-colors"
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-pearl-100 transition-colors hover:bg-orange-600"
          >
            <Send className="h-4 w-4" />
            {telegramLabel}
          </a>
        </div>

        <div className="mt-10 border-t border-ink-200/60 pt-6">
          <p className="small-text">
            © {new Date().getFullYear()} DriveON. {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
