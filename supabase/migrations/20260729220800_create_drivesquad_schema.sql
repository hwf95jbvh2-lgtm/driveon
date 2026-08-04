/*
# DriveSquad — full content schema + admin auth

## Summary
Creates the complete data layer for the DriveSquad site so all content is managed
through the admin panel instead of being hardcoded. Also provisions a single
admin login (Supabase email/password auth) so the /admin area is protected.

## 1. New Tables
- `exams` — exam listings shown on the homepage and /exams.
  - id (uuid pk), date (date), city, exam_type, official_url, status (exam_status enum),
    created_at, updated_at.
- `experiences` — user-submitted exam stories, moderated before publishing.
  - id (uuid pk), city, exam_date (date), category, result (experience_result enum),
    experience (text), comment (text nullable), moderation_status (moderation_status enum),
    created_at, updated_at.
- `street_lists` — city street-list links shown in "Где проходит экзамен".
  - id (uuid pk), city, title, url, published (bool), created_at, updated_at.
- `useful_pages` — editable useful-article content.
  - id (uuid pk), slug (unique), title, description, content (jsonb), published (bool), updated_at.
- `settings` — singleton row with site-wide settings (telegram url, site name, etc.).
  - id (int pk, locked to 1), telegram_url, site_name, description, contact_email, updated_at.

## 2. Enums
- exam_status: 'upcoming' | 'completed' | 'hidden'
- experience_result: 'passed' | 'failed'
- moderation_status: 'pending' | 'published' | 'rejected'

## 3. Security (RLS)
- exams: anon/authenticated can SELECT published rows (status != 'hidden');
  authenticated admins can do everything.
- experiences: anon can INSERT (public form); authenticated admins can SELECT/UPDATE/DELETE;
  anon can SELECT only published rows (for /after-exam).
- street_lists: anon/authenticated SELECT published; authenticated full CRUD.
- useful_pages: anon/authenticated SELECT published; authenticated full CRUD.
- settings: anon/authenticated SELECT (public read); authenticated UPDATE.
Admins are identified by `auth.uid()` matching the configured admin email via a helper check
(simplified: any authenticated user can manage, since only the admin account is created).

## 4. Seed data
- exams: 6 demo exams.
- experiences: 6 demo stories (mix of pending/published).
- street_lists: 3 city links.
- useful_pages: 7 articles matching existing slugs.
- settings: one row with defaults.

## 5. Notes
- All tables use gen_random_uuid() for ids.
- updated_at auto-updates via trigger.
- The admin account is created through Supabase Auth (not in this migration) —
  the frontend login uses supabase.auth.signInWithPassword.
*/

-- ── Enums ──────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE exam_status AS ENUM ('upcoming', 'completed', 'hidden');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE experience_result AS ENUM ('passed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE moderation_status AS ENUM ('pending', 'published', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── updated_at trigger helper ───────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── exams ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  city text NOT NULL,
  exam_type text NOT NULL,
  official_url text NOT NULL,
  status exam_status NOT NULL DEFAULT 'upcoming',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_exams" ON exams;
CREATE POLICY "public_select_exams" ON exams FOR SELECT
  TO anon, authenticated USING (status <> 'hidden');

DROP POLICY IF EXISTS "admin_insert_exams" ON exams;
CREATE POLICY "admin_insert_exams" ON exams FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_exams" ON exams;
CREATE POLICY "admin_update_exams" ON exams FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_exams" ON exams;
CREATE POLICY "admin_delete_exams" ON exams FOR DELETE
  TO authenticated USING (true);

DROP TRIGGER IF EXISTS exams_updated_at ON exams;
CREATE TRIGGER exams_updated_at BEFORE UPDATE ON exams
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── experiences ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  exam_date date NOT NULL,
  category text NOT NULL,
  result experience_result NOT NULL,
  experience text NOT NULL,
  comment text,
  moderation_status moderation_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- public can read only published stories
DROP POLICY IF EXISTS "public_select_experiences" ON experiences;
CREATE POLICY "public_select_experiences" ON experiences FOR SELECT
  TO anon, authenticated USING (moderation_status = 'published');

-- anyone can submit a story (public form) — always starts as pending
DROP POLICY IF EXISTS "public_insert_experiences" ON experiences;
CREATE POLICY "public_insert_experiences" ON experiences FOR INSERT
  TO anon, authenticated WITH CHECK (moderation_status = 'pending');

-- admins can read all, update, delete
DROP POLICY IF EXISTS "admin_select_experiences" ON experiences;
CREATE POLICY "admin_select_experiences" ON experiences FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_experiences" ON experiences;
CREATE POLICY "admin_update_experiences" ON experiences FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_experiences" ON experiences;
CREATE POLICY "admin_delete_experiences" ON experiences FOR DELETE
  TO authenticated USING (true);

DROP TRIGGER IF EXISTS experiences_updated_at ON experiences;
CREATE TRIGGER experiences_updated_at BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── street_lists ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS street_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE street_lists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_street_lists" ON street_lists;
CREATE POLICY "public_select_street_lists" ON street_lists FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_street_lists" ON street_lists;
CREATE POLICY "admin_insert_street_lists" ON street_lists FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_street_lists" ON street_lists;
CREATE POLICY "admin_update_street_lists" ON street_lists FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_street_lists" ON street_lists;
CREATE POLICY "admin_delete_street_lists" ON street_lists FOR DELETE
  TO authenticated USING (true);

DROP TRIGGER IF EXISTS street_lists_updated_at ON street_lists;
CREATE TRIGGER street_lists_updated_at BEFORE UPDATE ON street_lists
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── useful_pages ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS useful_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE useful_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_useful_pages" ON useful_pages;
CREATE POLICY "public_select_useful_pages" ON useful_pages FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_useful_pages" ON useful_pages;
CREATE POLICY "admin_insert_useful_pages" ON useful_pages FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_useful_pages" ON useful_pages;
CREATE POLICY "admin_update_useful_pages" ON useful_pages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_useful_pages" ON useful_pages;
CREATE POLICY "admin_delete_useful_pages" ON useful_pages FOR DELETE
  TO authenticated USING (true);

DROP TRIGGER IF EXISTS useful_pages_updated_at ON useful_pages;
CREATE TRIGGER useful_pages_updated_at BEFORE UPDATE ON useful_pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── settings (singleton) ────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  telegram_url text NOT NULL DEFAULT 'https://t.me/drivesquad',
  site_name text NOT NULL DEFAULT 'DriveSquad',
  description text NOT NULL DEFAULT 'Даты экзаменов, информация о местах проведения, опыт сдающих и полезные материалы для подготовки к экзамену в ГИБДД.',
  contact_email text NOT NULL DEFAULT 'hello@drivesquad.ru',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_settings" ON settings;
CREATE POLICY "public_select_settings" ON settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_settings" ON settings;
CREATE POLICY "admin_update_settings" ON settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS settings_updated_at ON settings;
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Seed: settings ──────────────────────────────────────
INSERT INTO settings (id, telegram_url, site_name, description, contact_email)
VALUES (1, 'https://t.me/drivesquad', 'DriveSquad',
  'Даты экзаменов, информация о местах проведения, опыт сдающих и полезные материалы для подготовки к экзамену в ГИБДД.',
  'hello@drivesquad.ru')
ON CONFLICT (id) DO NOTHING;

-- ── Seed: exams ─────────────────────────────────────────
INSERT INTO exams (date, city, exam_type, official_url, status) VALUES
  ('2026-08-12', 'Владивосток', 'Теория', 'https://www.gibdd.ru', 'upcoming'),
  ('2026-08-15', 'Артём', 'Практика (город)', 'https://www.gibdd.ru', 'upcoming'),
  ('2026-08-20', 'Владивосток', 'Практика (город)', 'https://www.gibdd.ru', 'upcoming'),
  ('2026-08-25', 'Уссурийск', 'Теория', 'https://www.gibdd.ru', 'upcoming'),
  ('2026-08-28', 'Находка', 'Практика (площадка)', 'https://www.gibdd.ru', 'upcoming'),
  ('2026-09-02', 'Владивосток', 'Теория', 'https://www.gibdd.ru', 'upcoming')
ON CONFLICT DO NOTHING;

-- ── Seed: experiences ───────────────────────────────────
INSERT INTO experiences (city, exam_date, category, result, experience, comment, moderation_status) VALUES
  ('Владивосток', '2026-07-18', 'B', 'passed',
   'Сдавал в районе Океанского проспекта. Инспектор был спокойный, маршрут оказался проще, чем ожидал.',
   'Главное — не торопиться на разворотах.', 'published'),
  ('Артём', '2026-07-15', 'B', 'failed',
   'Не сдал из-за непристёгнутого ремня на парковке. Остальное прошло нормально, но эта ошибка стоила экзамена.',
   'Проверяйте ремень даже на коротких манёврах.', 'published'),
  ('Владивосток', '2026-07-10', 'A', 'passed',
   'Экзамен на площадке. Все упражнения выполнил без ошибок. Упражнения были стандартные — «змейка» и «габаритный коридор».',
   NULL, 'published'),
  ('Уссурийск', '2026-07-05', 'B', 'failed',
   'Заглох на подъёме. Вторая попытка через неделю. Совет: отрабатывайте эстакаду до автоматизма.',
   NULL, 'published'),
  ('Находка', '2026-06-28', 'C', 'passed',
   'Сдавал на грузовой. Маршрут был по объездной дороге. Инспектор обращал внимание на перестроения и зеркала.',
   'Следите за зеркалами каждые 5–7 секунд.', 'published'),
  ('Владивосток', '2026-06-22', 'B', 'passed',
   'Сдал с третьей попытки. Каждый раз ошибки были мелкие, но критичные. В этот раз был максимально сосредоточен.',
   NULL, 'published')
ON CONFLICT DO NOTHING;

-- add one pending story for demo
INSERT INTO experiences (city, exam_date, category, result, experience, comment, moderation_status)
SELECT 'Владивосток', '2026-07-25', 'B', 'failed',
       'Не пропустил пешехода на нерегулируемом переходе. Инспектор сразу остановил экзамен.',
       'Будьте внимательны к пешеходам.', 'pending'
WHERE NOT EXISTS (
  SELECT 1 FROM experiences WHERE moderation_status = 'pending'
);

-- ── Seed: street_lists ──────────────────────────────────
INSERT INTO street_lists (city, title, url, published) VALUES
  ('Владивосток', 'Перечень улиц — Владивосток', 'https://www.gibdd.ru', true),
  ('Артём', 'Перечень улиц — Артём', 'https://www.gibdd.ru', true),
  ('Другие города', 'Перечень улиц — другие города', 'https://www.gibdd.ru', true)
ON CONFLICT DO NOTHING;

-- ── Seed: useful_pages ───────────────────────────────────
INSERT INTO useful_pages (slug, title, description, content, published) VALUES
  ('exam-process', 'Как проходит экзамен',
   'Этапы экзамена: теория, площадка и город.',
   '[{"heading":"Этапы экзамена","cards":[{"title":"Теория","text":"Компьютерное тестирование по билетам. 20 вопросов за 20 минут, допускается не более двух ошибок."},{"title":"Практика (площадка)","text":"Упражнения на закрытой площадке: эстакада, параллельная парковка, разворот, «змейка»."},{"title":"Практика (город)","text":"Езда по улицам города с инспектором. Оценивается соблюдение ПДД и уверенность управления."}]},{"heading":"Что оценивается в городе","list":["Пристёгнутый ремень безопасности","Использование указателей поворота","Зеркала и контроль обстановки","Соблюдение скоростного режима","Уверенные манёвры без рывков"]}]'::jsonb,
   true),
  ('what-to-bring', 'Что взять с собой',
   'Документы и вещи, без которых не допустят.',
   '[{"heading":"Документы","cards":[{"title":"Паспорт","text":"Оригинал паспорта гражданина РФ."},{"title":"Водительское удостоверение","text":"Если есть — действующее ВУ другой категории."},{"title":"Свидетельство об окончании автошколы","text":"Оригинал документа об обучении."},{"title":"Медицинская справка","text":"Действующая медсправка установленного образца."}]},{"heading":"Полезные вещи","list":["Удобная обувь без высоких каблуков","Очки или линзы, если они указаны в справке","Бутылка воды и лёгкий перекус","Заряженный телефон"]}]'::jsonb,
   true),
  ('before-exam', 'Что делать перед экзаменом',
   'Подготовка, отдых и настрой за день до сдачи.',
   '[{"heading":"За день до экзамена","cards":[{"title":"Отдых","text":"Ложитесь спать вовремя. Усталость ухудшает концентрацию."},{"title":"Документы","text":"Сложите все документы в одну папку с вечера."},{"title":"Маршрут","text":"Продумайте, как добраться до места экзамена с запасом по времени."}]},{"heading":"Утром в день экзамена","list":["Позавтракайте, но не плотно","Приедьте за 20–30 минут до начала","Проверьте телефон и зарядку","Сохраняйте спокойствие — нервозность передаётся в управление"]}]'::jsonb,
   true),
  ('common-mistakes', 'Частые ошибки',
   'За что чаще всего не сдают с первого раза.',
   '[{"heading":"Ошибки на площадке","cards":[{"title":"Заглох на эстакаде","text":"Частая ошибка — резкое сцепление. Отрабатывайте плавный старт."},{"title":"Сбитые конусы","text":"Неточный контроль габаритов при парковке и развороте."}]},{"heading":"Ошибки в городе","list":["Непристёгнутый ремень","Не включённый поворотник перед манёвром","Превышение скорости","Неуступил дорогу по знаку или разметке","Резкое торможение без необходимости"]}]'::jsonb,
   true),
  ('failed-exam', 'Что делать после несдачи',
   'Как не опустить руки и подготовиться заново.',
   '[{"heading":"Сразу после несдачи","cards":[{"title":"Сохраняйте спокойствие","text":"Эмоции пройдут. Ошибки можно исправить на следующей попытке."},{"title":"Разберите ошибки","text":"Поймите, за что именно сняли баллы, и отработайте этот элемент."}]},{"heading":"Подготовка к повторной сдаче","list":["Запишитесь на дополнительные занятия по слабым местам","Перечитайте ПДД по темам, где сомневаетесь","Смотрите опыт других сдающих на DriveSquad","Не торопитесь с датой — берите время на подготовку"]}]'::jsonb,
   true),
  ('medical', 'Медкомиссия',
   'Где проходить и какие документы нужны.',
   '[{"heading":"Где проходить","cards":[{"title":"Государственная поликлиника","text":"Обычно дешевле, но дольше по времени."},{"title":"Частный медцентр","text":"Быстрее и удобнее, но дороже. Проверяйте лицензию."}]},{"heading":"Что потребуется","list":["Паспорт","Фотография (иногда делают на месте)","Военный билет — для военнообязанных","Справка от нарколога и психиатра","Заключение офтальмолога, терапевта и невролога"]}]'::jsonb,
   true),
  ('faq', 'Частые вопросы',
   'Ответы на популярные вопросы сдающих.',
   '[{"heading":"Вопросы и ответы","cards":[{"title":"Сколько попыток сдачи разрешено?","text":"Количество попыток не ограничено, но между пересдачами соблюдаются установленные сроки."},{"title":"Можно ли сдавать на своей машине?","text":"Экзамен проходит на автомобиле автошколы или ГИБДД. Своя машина не допускается."},{"title":"Сколько длится теория?","text":"Теоретический экзамен — 20 минут на 20 вопросов."},{"title":"Что делать, если не согласен с решением инспектора?","text":"Можно подать апелляцию. Решение принимается комиссией после разбора ситуации."}]}]'::jsonb,
   true)
ON CONFLICT (slug) DO NOTHING;
