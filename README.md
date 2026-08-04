# DriveON

График экзаменов ГИБДД Владивосток 2026. Независимый сервис для сдающих экзамен в ГИБДД.

## Технологии

- **Vite** 5.4 — сборщик
- **React** 18 + **TypeScript** 5.5 — фронтенд
- **Tailwind CSS** 3.4 — стилизация
- **Supabase** — база данных (PostgreSQL), аутентификация, хранилище медиа
- **react-router-dom** 6 — маршрутизация
- **lucide-react** — иконки

## Установка

```bash
npm install
```

## Запуск в режиме разработки

```bash
npm run dev
```

## Сборка

```bash
npm run build
```

## Переменные окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```bash
cp .env.example .env
```

| Переменная | Описание |
|---|---|
| `VITE_SUPABASE_URL` | URL проекта Supabase |
| `VITE_SUPABASE_ANON_KEY` | Анонимный ключ Supabase (защищён RLS-политиками) |

## Структура проекта

```
src/
├── pages/              # Публичные страницы
│   └── admin/         # Страницы админ-панели (14 разделов)
├── components/
│   ├── sections/       # Секции главной страницы
│   ├── cards/          # Карточки (экзамены, опыт, полезное)
│   ├── layout/         # Header, Footer, Layout
│   ├── ui/             # Переиспользуемые UI-компоненты
│   ├── admin/          # Компоненты админ-панели
│   └── decorations/    # Декоративные элементы
├── context/            # React-контексты (Auth, Theme, Content, Settings)
├── hooks/              # Кастомные хуки
├── lib/                # Клиент Supabase и слой данных
├── data/               # Fallback-данные (при недоступности БД)
└── types.ts            # TypeScript-типы

supabase/
└── migrations/         # SQL-миграции базы данных
```

## Админ-панель

Доступна по адресу `/admin`. Вход по email и паролю через Supabase Auth.

## Деплой

Проект можно развернуть на Vercel, Netlify или любом Node.js-хостинге.

### Vercel
1. Импортируйте репозиторий в Vercel
2. Добавьте переменные окружения (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
3. Команда сборки: `npm run build`
4. Каталог вывода: `dist`

### Netlify
1. Импортируйте репозиторий в Netlify
2. Добавьте переменные окружения
3. Команда сборки: `npm run build`
4. Каталог публикации: `dist`
