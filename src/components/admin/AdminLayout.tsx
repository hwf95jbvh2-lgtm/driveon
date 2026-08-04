import { type ReactNode, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarClock,
  MessageSquare,
  MapPin,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Palette,
  Type,
  LayoutPanelTop,
  Navigation,
  FilePlus,
  Image,
  ListChecks,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/exams', label: 'Экзамены', icon: CalendarDays },
  { to: '/admin/schedule', label: 'Графики экзаменов', icon: CalendarClock },
  { to: '/admin/experiences', label: 'Опыт сдающих', icon: MessageSquare },
  { to: '/admin/streets', label: 'Перечни улиц', icon: MapPin },
  { to: '/admin/useful', label: 'Полезное', icon: FileText },
  { to: '/admin/settings', label: 'Настройки', icon: Settings },
  { to: '/admin/appearance', label: 'Внешний вид', icon: Palette },
  { to: '/admin/content', label: 'Тексты сайта', icon: Type },
  { to: '/admin/sections', label: 'Блоки и секции', icon: LayoutPanelTop },
  { to: '/admin/navigation', label: 'Навигация', icon: Navigation },
  { to: '/admin/pages', label: 'Страницы', icon: FilePlus },
  { to: '/admin/media', label: 'Медиа', icon: Image },
  { to: '/admin/form-fields', label: 'Поля формы', icon: ListChecks },
];

export function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pearl-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: '/admin' }} />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-pearl-100">
      {/* Top bar (mobile) */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-200/60 bg-pearl-100/90 px-4 py-3 backdrop-blur md:hidden">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
            <span className="h-3.5 w-3.5 rounded-full border-2 border-pearl-100" />
          </span>
          <span className="font-display font-bold text-ink-900">DriveON Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-900 hover:bg-ink-900/5"
          aria-label="Меню"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            open ? 'block' : 'hidden'
          } fixed inset-0 z-30 md:relative md:block md:w-64 md:shrink-0`}
        >
          <div className="flex h-full flex-col gap-1 border-r border-ink-200/60 bg-pearl-50 p-4 md:h-screen md:sticky md:top-0">
            <div className="mb-4 hidden items-center gap-2 px-2 md:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
                <span className="h-4 w-4 rounded-full border-2 border-pearl-100" />
              </span>
              <span className="font-display font-bold text-ink-900">DriveON</span>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-500/15 text-orange-700'
                        : 'text-ink-700 hover:bg-ink-900/5'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-1 pt-4">
              <Link
                to="/"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-900/5"
              >
                <ExternalLink className="h-4 w-4" />
                Открыть сайт
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-500/10"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {open && (
          <div
            className="fixed inset-0 z-20 bg-ink-900/30 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-ink-600">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
