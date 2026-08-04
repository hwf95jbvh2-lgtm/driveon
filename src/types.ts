// ── Public-facing types (used by the public site) ────────────
export type ExamStatus = 'upcoming' | 'completed' | 'hidden';

export interface Exam {
  id: string;
  date: string; // ISO date
  city: string;
  examType: string;
  officialUrl: string;
  status: ExamStatus;
}

export type ExperienceResult = 'passed' | 'failed';
export type ModerationStatus = 'pending' | 'published' | 'rejected';

export interface Experience {
  id: string;
  city: string;
  examDate: string; // ISO date
  category: string;
  result: ExperienceResult;
  experience: string;
  comment?: string;
  createdAt: string; // ISO date
}

export interface CityStreetList {
  id: string;
  city: string;
  title: string;
  url: string;
}

export interface UsefulArticle {
  slug: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export type NewExperience = Omit<Experience, 'id' | 'createdAt'>;

export interface UsefulCardItem {
  title: string;
  text: string;
}

export interface UsefulSection {
  heading: string;
  cards?: UsefulCardItem[];
  list?: string[];
}

export interface UsefulArticleContent {
  title: string;
  intro: string;
  sections: UsefulSection[];
}

// ── Database row types (snake_case, matches schema) ──────────
export interface ExamRow {
  id: string;
  date: string;
  city: string;
  exam_type: string;
  official_url: string;
  status: ExamStatus;
  created_at: string;
  updated_at: string;
}

export interface ExperienceRow {
  id: string;
  city: string;
  exam_date: string;
  category: string;
  result: ExperienceResult;
  experience: string;
  comment: string | null;
  moderation_status: ModerationStatus;
  created_at: string;
  updated_at: string;
}

export interface StreetListRow {
  id: string;
  city: string;
  title: string;
  url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsefulPageRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: UsefulSection[];
  published: boolean;
  updated_at: string;
}

export interface SettingsRow {
  id: number;
  telegram_url: string;
  site_name: string;
  description: string;
  contact_email: string;
  updated_at: string;
}

// ── Admin form payloads ─────────────────────────────────────
export interface ExamInput {
  date: string;
  city: string;
  exam_type: string;
  official_url: string;
  status: ExamStatus;
}

export interface ExperienceInput {
  city: string;
  exam_date: string;
  category: string;
  result: ExperienceResult;
  experience: string;
  comment: string | null;
  moderation_status: ModerationStatus;
}

export interface StreetListInput {
  city: string;
  title: string;
  url: string;
  published: boolean;
}

export interface UsefulPageInput {
  title: string;
  description: string;
  content: UsefulSection[];
  published: boolean;
}

export interface SettingsInput {
  telegram_url: string;
  site_name: string;
  description: string;
  contact_email: string;
}

// ── Exam schedule links (month PDF buttons) ─────────────────
export interface ExamScheduleLinkRow {
  id: string;
  label: string;
  url: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ExamScheduleLink {
  id: string;
  label: string;
  url: string;
}

export interface ExamScheduleLinkInput {
  label: string;
  url: string;
  published: boolean;
  sort_order: number;
}

// ── CMS types ────────────────────────────────────────────────
export interface ThemeRow {
  id: number;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  heading_color: string;
  button_primary_color: string;
  button_secondary_color: string;
  button_text_color: string;
  card_color: string;
  footer_color: string;
  link_color: string;
  heading_font: string;
  body_font: string;
  heading_size: string;
  section_heading_size: string;
  body_size: string;
  font_weight: string;
  line_height: string;
  content_width: number;
  text_align: string;
  button_radius: number;
  card_radius: number;
  input_radius: number;
  button_size: string;
  border_width: number;
  border_enabled: boolean;
  shadow_intensity: string;
  padding: number;
  gap: number;
  updated_at: string;
}

export interface ThemeInput {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  heading_color: string;
  button_primary_color: string;
  button_secondary_color: string;
  button_text_color: string;
  card_color: string;
  footer_color: string;
  link_color: string;
  heading_font: string;
  body_font: string;
  heading_size: string;
  section_heading_size: string;
  body_size: string;
  font_weight: string;
  line_height: string;
  content_width: number;
  text_align: string;
  button_radius: number;
  card_radius: number;
  input_radius: number;
  button_size: string;
  border_width: number;
  border_enabled: boolean;
  shadow_intensity: string;
  padding: number;
  gap: number;
}

export interface ContentRow {
  id: string;
  content_key: string;
  content_value: string;
  updated_at: string;
}

export interface PageSectionRow {
  id: string;
  section_key: string;
  title: string;
  subtitle: string | null;
  sort_order: number;
  visible: boolean;
  content_json: unknown;
  updated_at: string;
}

export interface NavItemRow {
  id: string;
  label: string;
  url: string;
  open_in_new_tab: boolean;
  location: string;
  sort_order: number;
  visible: boolean;
  updated_at: string;
}

export interface NavItemInput {
  label: string;
  url: string;
  open_in_new_tab: boolean;
  location: string;
  sort_order: number;
  visible: boolean;
}

export interface CustomPageRow {
  id: string;
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
  content: UsefulSection[];
  created_at: string;
  updated_at: string;
}

export interface CustomPageInput {
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
  content: UsefulSection[];
}

export interface MediaItemRow {
  id: string;
  name: string;
  url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface FormFieldRow {
  id: string;
  field_key: string;
  label: string;
  field_type: string;
  required: boolean;
  sort_order: number;
  active: boolean;
  placeholder: string | null;
  updated_at: string;
}

export interface FormFieldInput {
  field_key: string;
  label: string;
  field_type: string;
  required: boolean;
  sort_order: number;
  active: boolean;
  placeholder: string | null;
}
