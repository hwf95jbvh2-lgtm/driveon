/*
# DriveON — Full CMS schema (theme, content, sections, nav, pages, media, form fields)

## Summary
Creates a universal content management layer so the admin can control virtually
every visible element of the site — text, links, colors, typography, border
radius, shadows, section order/visibility, navigation, custom pages, media
uploads, and form field configuration — without touching code.

## 1. New Tables
- `site_theme` — singleton row (id=1) with all visual style settings:
  colors (primary, secondary, accent, background, text, headings, button_primary,
  button_secondary, button_text, card, footer, link), typography (heading_font,
  body_font, heading_size, section_heading_size, body_size, font_weight,
  line_height, content_width, text_align), forms (button_radius, card_radius,
  input_radius, button_size, border_width, border_enabled, shadow_intensity,
  padding, gap).
- `site_content` — key/value store for all editable text strings on the site
  (hero title, subtitles, section headers, button labels, footer text,
  disclaimer text, etc.).
- `page_sections` — ordered, toggleable sections on the homepage. Each row has
  a section_key, title, subtitle, sort_order, visible, and optional content_json.
- `nav_items` — navigation links for header and footer, with label, url,
  open_in_new_tab, location (header/footer), sort_order, visible.
- `custom_pages` — admin-created pages with slug, title, seo_title, seo_description,
  status (draft/published), content (jsonb blocks), created_at, updated_at.
- `media_items` — uploaded images/files with name, url, type, size, created_at.
- `form_fields` — configurable fields for the experience submission form:
  field_key, label, field_type, required, sort_order, active, placeholder.

## 2. Security
- All tables have RLS enabled.
- Public read (anon, authenticated) on all tables except custom_pages (only
  published) and media_items (public read).
- Admin (authenticated) has full CRUD on all tables.

## 3. Seed Data
- site_theme: defaults matching current DriveON design (teal #6FAC9F, orange
  #BF4B00, pearl #F4E4C5, ink #1A1A17, etc.).
- site_content: all current text strings from the site.
- page_sections: 7 sections in current order (hero, exams, where, experience,
  useful, telegram, about, disclaimer).
- nav_items: header + footer links matching current navigation.
- form_fields: 6 fields matching current experience form.
*/

-- ═══════════════════════════════════════════════════════════
-- site_theme (singleton)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS site_theme (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  -- Colors
  primary_color text NOT NULL DEFAULT '#6FAC9F',
  secondary_color text NOT NULL DEFAULT '#BF4B00',
  accent_color text NOT NULL DEFAULT '#F4E4C5',
  background_color text NOT NULL DEFAULT '#F4E4C5',
  text_color text NOT NULL DEFAULT '#1A1A17',
  heading_color text NOT NULL DEFAULT '#1A1A17',
  button_primary_color text NOT NULL DEFAULT '#BF4B00',
  button_secondary_color text NOT NULL DEFAULT '#6FAC9F',
  button_text_color text NOT NULL DEFAULT '#FBF6E9',
  card_color text NOT NULL DEFAULT '#FBF6E9',
  footer_color text NOT NULL DEFAULT '#1A1A17',
  link_color text NOT NULL DEFAULT '#BF4B00',
  -- Typography
  heading_font text NOT NULL DEFAULT 'Unbounded',
  body_font text NOT NULL DEFAULT 'Inter',
  heading_size text NOT NULL DEFAULT '3xl',
  section_heading_size text NOT NULL DEFAULT '2xl',
  body_size text NOT NULL DEFAULT 'base',
  font_weight text NOT NULL DEFAULT '400',
  line_height text NOT NULL DEFAULT '1.5',
  content_width int NOT NULL DEFAULT 1152,
  text_align text NOT NULL DEFAULT 'left',
  -- Forms & shapes
  button_radius int NOT NULL DEFAULT 12,
  card_radius int NOT NULL DEFAULT 20,
  input_radius int NOT NULL DEFAULT 12,
  button_size text NOT NULL DEFAULT 'md',
  border_width int NOT NULL DEFAULT 1,
  border_enabled boolean NOT NULL DEFAULT true,
  shadow_intensity text NOT NULL DEFAULT 'medium',
  padding int NOT NULL DEFAULT 24,
  gap int NOT NULL DEFAULT 16,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_theme ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_theme" ON site_theme;
CREATE POLICY "public_select_theme" ON site_theme FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_theme" ON site_theme;
CREATE POLICY "admin_update_theme" ON site_theme FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS site_theme_updated_at ON site_theme;
CREATE TRIGGER site_theme_updated_at BEFORE UPDATE ON site_theme
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO site_theme (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- site_content (key/value text store)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text UNIQUE NOT NULL,
  content_value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_content" ON site_content;
CREATE POLICY "public_select_content" ON site_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_content" ON site_content;
CREATE POLICY "admin_insert_content" ON site_content FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_content" ON site_content;
CREATE POLICY "admin_update_content" ON site_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_content" ON site_content;
CREATE POLICY "admin_delete_content" ON site_content FOR DELETE
  TO authenticated USING (true);

DROP TRIGGER IF EXISTS site_content_updated_at ON site_content;
CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Seed content
INSERT INTO site_content (content_key, content_value) VALUES
  ('hero.badge', 'Независимый digital-сервис'),
  ('hero.title', 'Всё, что нужно знать перед экзаменом в ГИБДД'),
  ('hero.subtitle', 'Даты экзаменов, информация от сдающих и полезные материалы в одном месте.'),
  ('hero.button_primary', 'Экзамены'),
  ('hero.button_secondary', 'Telegram'),
  ('exams.label', 'Экзамены'),
  ('exams.title', 'Экзамены в ГИБДД'),
  ('exams.subtitle', 'Актуальная информация о предстоящих экзаменах.'),
  ('exams.description', 'Выберите месяц, чтобы открыть актуальный график проведения экзаменов.'),
  ('exams.button_all', 'Все экзамены'),
  ('where.label', 'Где проходит экзамен'),
  ('where.title', 'Где проходит экзамен?'),
  ('where.text_1', 'Фиксированные маршруты экзамена отменены. Теперь практический экзамен может проходить на любом участке улиц города, который соответствует требованиям для его проведения.'),
  ('where.text_2', 'Мы собрали перечни улиц, на которых может проводиться экзамен.'),
  ('where.warning', 'Это не маршруты экзамена. Перечень улиц показывает возможные места проведения экзамена.'),
  ('experience.label', 'После экзамена'),
  ('experience.title', 'Как прошёл экзамен?'),
  ('experience.subtitle', 'Опыт тех, кто уже сдавал, помогает подготовиться следующим.'),
  ('experience.button', 'Рассказать о своём экзамене'),
  ('useful.label', 'Полезное'),
  ('useful.title', 'Полезное перед экзаменом'),
  ('useful.subtitle', 'Короткие материалы, которые помогут подготовиться.'),
  ('telegram.label', 'Telegram'),
  ('telegram.title', 'Больше информации — в Telegram'),
  ('telegram.subtitle', 'Новости, обсуждение экзаменов и опыт других сдающих.'),
  ('telegram.button', 'Перейти в Telegram'),
  ('about.label', 'О проекте'),
  ('about.title', 'О DriveON'),
  ('about.text_1', 'DriveON — независимый сервис для тех, кто сдаёт экзамен в ГИБДД.'),
  ('about.text_2', 'Мы не обучаем вождению и не принимаем экзамены. Мы собираем актуальную информацию и опыт сдающих, чтобы подготовиться к экзамену было проще.'),
  ('about.link', 'Подробнее о проекте'),
  ('disclaimer.title', 'Дисклеймер'),
  ('disclaimer.text_1', 'Информация на данной странице носит исключительно ознакомительный характер и не является официальным разъяснением законодательства РФ, административным регламентом или юридической консультацией.'),
  ('disclaimer.text_2', 'Сведения получены из открытых источников и могут отличаться в зависимости от региона. Порядок сдачи экзаменов, перечень документов, сроки и штрафные баллы подлежат изменению.'),
  ('disclaimer.text_3', 'Материалы не являются публичной офертой и не заменяют официальную информацию на сайтах ГИБДД и Госуслуги.'),
  ('disclaimer.text_4', 'Рекомендуем уточнять актуальные данные в автошколе или в ГИБДД. Администрация не несёт ответственности за использование материалов сайта.'),
  ('footer.about', 'DriveON — информация для тех, кто сдаёт экзамен.'),
  ('footer.copyright', 'Независимый сервис. Не связан с ГИБДД и автошколами.'),
  ('footer.about_link', 'О DriveON'),
  ('experience_form.success_message', 'Спасибо! Рассказ отправлен на проверку.'),
  ('experience_form.button', 'Отправить рассказ')
ON CONFLICT (content_key) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- page_sections (homepage section ordering)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  content_json jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_sections" ON page_sections;
CREATE POLICY "public_select_sections" ON page_sections FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_sections" ON page_sections;
CREATE POLICY "admin_insert_sections" ON page_sections FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_sections" ON page_sections;
CREATE POLICY "admin_update_sections" ON page_sections FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_sections" ON page_sections;
CREATE POLICY "admin_delete_sections" ON page_sections FOR DELETE
  TO authenticated USING (true);

DROP TRIGGER IF EXISTS page_sections_updated_at ON page_sections;
CREATE TRIGGER page_sections_updated_at BEFORE UPDATE ON page_sections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO page_sections (section_key, title, subtitle, sort_order, visible) VALUES
  ('hero', 'Первый экран', 'Главный заголовок и кнопки', 1, true),
  ('exams', 'Экзамены', 'Графики экзаменов по месяцам', 2, true),
  ('where', 'Где проходит экзамен', 'Перечни улиц по городам', 3, true),
  ('experience', 'Опыт сдающих', 'Истории тех, кто уже сдавал', 4, true),
  ('useful', 'Полезное', 'Полезные материалы', 5, true),
  ('telegram', 'Telegram', 'Telegram-канал', 6, true),
  ('about', 'О проекте', 'Информация о проекте', 7, true),
  ('disclaimer', 'Дисклеймер', 'Правовой дисклеймер', 8, true)
ON CONFLICT (section_key) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- nav_items (header + footer navigation)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  open_in_new_tab boolean NOT NULL DEFAULT false,
  location text NOT NULL DEFAULT 'header',
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_nav" ON nav_items;
CREATE POLICY "public_select_nav" ON nav_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_nav" ON nav_items;
CREATE POLICY "admin_insert_nav" ON nav_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_nav" ON nav_items;
CREATE POLICY "admin_update_nav" ON nav_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_nav" ON nav_items;
CREATE POLICY "admin_delete_nav" ON nav_items FOR DELETE
  TO authenticated USING (true);

DROP TRIGGER IF EXISTS nav_items_updated_at ON nav_items;
CREATE TRIGGER nav_items_updated_at BEFORE UPDATE ON nav_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO nav_items (label, url, open_in_new_tab, location, sort_order, visible) VALUES
  ('Экзамены', '/exams', false, 'header', 1, true),
  ('После экзамена', '/after-exam', false, 'header', 2, true),
  ('Полезное', '/useful', false, 'header', 3, true),
  ('Telegram', '/telegram', false, 'header', 4, true),
  ('О проекте', '/about', false, 'header', 5, true),
  ('Экзамены', '/exams', false, 'footer', 1, true),
  ('После экзамена', '/after-exam', false, 'footer', 2, true),
  ('Полезное', '/useful', false, 'footer', 3, true),
  ('Как выбрать автошколу', '/useful/how-to-choose-school', false, 'footer', 4, true),
  ('Как выбрать инструктора', '/useful/how-to-choose-instructor', false, 'footer', 5, true),
  ('Telegram', '/telegram', false, 'footer', 6, true),
  ('О проекте', '/about', false, 'footer', 7, true)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- custom_pages (admin-created pages)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS custom_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  seo_title text,
  seo_description text,
  status text NOT NULL DEFAULT 'draft',
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_pages" ON custom_pages;
CREATE POLICY "public_select_pages" ON custom_pages FOR SELECT
  TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "admin_select_pages" ON custom_pages;
CREATE POLICY "admin_select_pages" ON custom_pages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_pages" ON custom_pages;
CREATE POLICY "admin_insert_pages" ON custom_pages FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_pages" ON custom_pages;
CREATE POLICY "admin_update_pages" ON custom_pages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_pages" ON custom_pages;
CREATE POLICY "admin_delete_pages" ON custom_pages FOR DELETE
  TO authenticated USING (true);

DROP TRIGGER IF EXISTS custom_pages_updated_at ON custom_pages;
CREATE TRIGGER custom_pages_updated_at BEFORE UPDATE ON custom_pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ═══════════════════════════════════════════════════════════
-- media_items (uploaded files)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  file_type text NOT NULL DEFAULT 'image',
  file_size bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_media" ON media_items;
CREATE POLICY "public_select_media" ON media_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_media" ON media_items;
CREATE POLICY "admin_insert_media" ON media_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_media" ON media_items;
CREATE POLICY "admin_delete_media" ON media_items FOR DELETE
  TO authenticated USING (true);

-- ═══════════════════════════════════════════════════════════
-- form_fields (experience form configuration)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS form_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_key text UNIQUE NOT NULL,
  label text NOT NULL,
  field_type text NOT NULL DEFAULT 'text',
  required boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  placeholder text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_form_fields" ON form_fields;
CREATE POLICY "public_select_form_fields" ON form_fields FOR SELECT
  TO anon, authenticated USING (active = true);

DROP POLICY IF EXISTS "admin_select_form_fields" ON form_fields;
CREATE POLICY "admin_select_form_fields" ON form_fields FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_form_fields" ON form_fields;
CREATE POLICY "admin_insert_form_fields" ON form_fields FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_form_fields" ON form_fields;
CREATE POLICY "admin_update_form_fields" ON form_fields FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_form_fields" ON form_fields;
CREATE POLICY "admin_delete_form_fields" ON form_fields FOR DELETE
  TO authenticated USING (true);

DROP TRIGGER IF EXISTS form_fields_updated_at ON form_fields;
CREATE TRIGGER form_fields_updated_at BEFORE UPDATE ON form_fields
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO form_fields (field_key, label, field_type, required, sort_order, active, placeholder) VALUES
  ('city', 'Город', 'text', true, 1, true, 'Владивосток'),
  ('examDate', 'Дата экзамена', 'date', true, 2, true, ''),
  ('category', 'Категория', 'text', true, 3, true, 'B'),
  ('result', 'Результат', 'select', true, 4, true, ''),
  ('experience', 'Что происходило на экзамене', 'textarea', true, 5, true, 'Опишите ваш опыт'),
  ('comment', 'Дополнительный комментарий', 'textarea', false, 6, true, 'Дополнительный комментарий')
ON CONFLICT (field_key) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- Storage bucket for media uploads
-- ═══════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_media_bucket" ON storage.objects;
CREATE POLICY "public_read_media_bucket" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "admin_upload_media_bucket" ON storage.objects;
CREATE POLICY "admin_upload_media_bucket" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "admin_delete_media_bucket" ON storage.objects;
CREATE POLICY "admin_delete_media_bucket" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media');
