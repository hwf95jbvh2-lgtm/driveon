import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, CheckCircle2, MapPin } from 'lucide-react';
import { fetchDashboardStats, type DashboardStats } from '@/lib/data';
import { AdminPageHeader } from '@/components/admin/AdminLayout';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchDashboardStats();
        if (mounted) setStats(data);
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

  const cards = [
    {
      label: 'Предстоящие экзамены',
      value: stats?.upcomingExams,
      icon: CalendarDays,
      to: '/admin/exams',
      accent: 'text-teal-700 bg-teal-500/15',
    },
    {
      label: 'Истории на проверке',
      value: stats?.pendingExperiences,
      icon: Clock,
      to: '/admin/experiences',
      accent: 'text-orange-600 bg-orange-500/15',
    },
    {
      label: 'Опубликованные истории',
      value: stats?.publishedExperiences,
      icon: CheckCircle2,
      to: '/admin/experiences',
      accent: 'text-teal-700 bg-teal-500/15',
    },
    {
      label: 'Перечни улиц',
      value: stats?.streetLists,
      icon: MapPin,
      to: '/admin/streets',
      accent: 'text-orange-600 bg-orange-500/15',
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Обзор текущего состояния сайта DriveON."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="flex flex-col gap-3 rounded-2xl bg-pearl-50 p-5 ring-1 ring-ink-200/60 transition-all hover:shadow-card hover:-translate-y-0.5"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.accent}`}>
              <card.icon className="h-5 w-5" />
            </span>
            <span className="text-3xl font-bold text-ink-900">
              {loading ? '—' : card.value}
            </span>
            <span className="text-sm text-ink-600">{card.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-teal-500/10 p-6">
        <h2 className="font-display text-lg font-semibold text-teal-800">
          Что можно сделать отсюда
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-teal-800/90">
          <li>— Добавить или изменить экзамен в разделе «Экзамены»</li>
          <li>— Проверить и опубликовать истории сдающих в «Опыт сдающих»</li>
          <li>— Обновить ссылки на перечни улиц в «Перечни улиц»</li>
          <li>— Редактировать полезные статьи в «Полезное»</li>
          <li>— Изменить Telegram-ссылку и другие настройки в «Настройки»</li>
        </ul>
      </div>
    </div>
  );
}
