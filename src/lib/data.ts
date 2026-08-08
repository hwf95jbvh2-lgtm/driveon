import { supabase } from '@/lib/supabase';
import type {
  Exam,
  ExamInput,
  ExamRow,
  Experience,
  ExperienceInput,
  ExperienceRow,
  StreetListRow,
  StreetListInput,
  CityStreetList,
  UsefulPageRow,
  UsefulPageInput,
  UsefulSection,
  SettingsRow,
  SettingsInput,
  NewExperience,
  ExamScheduleLink,
  ExamScheduleLinkRow,
  ExamScheduleLinkInput,
  ThemeRow,
  ThemeInput,
  ContentRow,
  PageSectionRow,
  NavItemRow,
  NavItemInput,
  CustomPageRow,
  CustomPageInput,
  MediaItemRow,
  FormFieldRow,
  FormFieldInput,
  SectionContentConfig,
  SectionLayout,
} from '@/types';

// ── Mappers ──────────────────────────────────────────────────

const mapExam = (r: ExamRow): Exam => ({
  id: r.id,
  date: r.date,
  city: r.city,
  examType: r.exam_type,
  officialUrl: r.official_url,
  status: r.status,
});

const mapExperience = (r: ExperienceRow): Experience => ({
  id: r.id,
  city: r.city,
  examDate: r.exam_date,
  category: r.category,
  result: r.result,
  experience: r.experience,
  comment: r.comment ?? undefined,
  createdAt: r.created_at,
});

const mapStreetList = (r: StreetListRow): CityStreetList => ({
  id: r.id,
  city: r.city,
  title: r.title,
  url: r.url,
});


// ── Exams ─────────────────────────────────────────────────────

export async function fetchExams(
  publishedOnly = false,
): Promise<Exam[]> {
  let query = supabase
    .from('exams')
    .select('*')
    .order('date', { ascending: true });

  if (publishedOnly) {
    query = query.neq('status', 'hidden');
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data as ExamRow[]).map(mapExam);
}

export async function fetchUpcomingExams(): Promise<Exam[]> {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('status', 'upcoming')
    .gte('date', today)
    .order('date', { ascending: true });

  if (error) throw error;

  return (data as ExamRow[]).map(mapExam);
}

export async function createExam(input: ExamInput): Promise<ExamRow> {
  const { data, error } = await supabase
    .from('exams')
    .insert(input)
    .select()
    .single();

  if (error) throw error;

  return data as ExamRow;
}

export async function updateExam(
  id: string,
  input: Partial<ExamInput>,
): Promise<void> {
  const { error } = await supabase
    .from('exams')
    .update(input)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteExam(id: string): Promise<void> {
  const { error } = await supabase
    .from('exams')
    .delete()
    .eq('id', id);

  if (error) throw error;
}


// ── Experiences ──────────────────────────────────────────────

export async function fetchPublishedExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('moderation_status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data as ExperienceRow[]).map(mapExperience);
}

export async function fetchAllExperiences(): Promise<ExperienceRow[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as ExperienceRow[];
}

export async function submitExperience(
  input: NewExperience,
): Promise<void> {
  const row = {
    city: input.city,
    exam_date: input.examDate,
    category: input.category,
    result: input.result,
    experience: input.experience,
    comment: input.comment ?? null,
    moderation_status: 'pending' as const,
  };

  const { error } = await supabase
    .from('experiences')
    .insert(row);

  if (error) throw error;
}

export async function updateExperience(
  id: string,
  input: Partial<ExperienceInput>,
): Promise<void> {
  const { error } = await supabase
    .from('experiences')
    .update(input)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteExperience(
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) throw error;
}


// ── Street lists ─────────────────────────────────────────────

export async function fetchStreetLists(
  publishedOnly = false,
): Promise<CityStreetList[]> {
  let query = supabase
    .from('street_lists')
    .select('*')
    .order('city', { ascending: true });

  if (publishedOnly) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data as StreetListRow[]).map(mapStreetList);
}

export async function fetchAllStreetLists(): Promise<StreetListRow[]> {
  const { data, error } = await supabase
    .from('street_lists')
    .select('*')
    .order('city', { ascending: true });

  if (error) throw error;

  return data as StreetListRow[];
}

export async function createStreetList(
  input: StreetListInput,
): Promise<void> {
  const { error } = await supabase
    .from('street_lists')
    .insert(input);

  if (error) throw error;
}

export async function updateStreetList(
  id: string,
  input: Partial<StreetListInput>,
): Promise<void> {
  const { error } = await supabase
    .from('street_lists')
    .update(input)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteStreetList(
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from('street_lists')
    .delete()
    .eq('id', id);

  if (error) throw error;
}


// ── Useful pages ──────────────────────────────────────────────

export async function fetchUsefulPage(
  slug: string,
): Promise<UsefulPageRow | null> {
  const { data, error } = await supabase
    .from('useful_pages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;

  return data as UsefulPageRow | null;
}

export async function fetchAllUsefulPages(): Promise<UsefulPageRow[]> {
  const { data, error } = await supabase
    .from('useful_pages')
    .select('*')
    .order('title', { ascending: true });

  if (error) throw error;

  return data as UsefulPageRow[];
}

export async function updateUsefulPage(
  id: string,
  input: Partial<UsefulPageInput>,
): Promise<void> {
  const { error } = await supabase
    .from('useful_pages')
    .update(input)
    .eq('id', id);

  if (error) throw error;
}


// ── Settings ─────────────────────────────────────────────────

export async function fetchSettings(): Promise<SettingsRow | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) throw error;

  return data as SettingsRow | null;
}

export async function updateSettings(
  input: SettingsInput,
): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .update(input)
    .eq('id', 1);

  if (error) throw error;
}


// ── Dashboard stats ──────────────────────────────────────────

export interface DashboardStats {
  upcomingExams: number;
  pendingExperiences: number;
  publishedExperiences: number;
  streetLists: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const today = new Date().toISOString().slice(0, 10);

  const [
    upcoming,
    pending,
    published,
    streets,
  ] = await Promise.all([
    supabase
      .from('exams')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'upcoming')
      .gte('date', today),

    supabase
      .from('experiences')
      .select('id', { count: 'exact', head: true })
      .eq('moderation_status', 'pending'),

    supabase
      .from('experiences')
      .select('id', { count: 'exact', head: true })
      .eq('moderation_status', 'published'),

    supabase
      .from('street_lists')
      .select('id', { count: 'exact', head: true }),
  ]);

  return {
    upcomingExams: upcoming.count ?? 0,
    pendingExperiences: pending.count ?? 0,
    publishedExperiences: published.count ?? 0,
    streetLists: streets.count ?? 0,
  };
}


// ── Useful section type ──────────────────────────────────────

export type { UsefulSection };


// ── Exam schedule links ───────────────────────────────────────

const mapScheduleLink = (
  r: ExamScheduleLinkRow,
): ExamScheduleLink => ({
  id: r.id,
  label: r.label,
  url: r.url,
});

export async function fetchScheduleLinks(
  publishedOnly = false,
): Promise<ExamScheduleLink[]> {
  let query = supabase
    .from('exam_schedule_links')
    .select('*')
    .order('sort_order', { ascending: true });

  if (publishedOnly) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data as ExamScheduleLinkRow[]).map(mapScheduleLink);
}

export async function fetchAllScheduleLinks(): Promise<ExamScheduleLinkRow[]> {
  const { data, error } = await supabase
    .from('exam_schedule_links')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return data as ExamScheduleLinkRow[];
}

export async function createScheduleLink(
  input: ExamScheduleLinkInput,
): Promise<void> {
  const { error } = await supabase
    .from('exam_schedule_links')
    .insert(input);

  if (error) throw error;
}

export async function updateScheduleLink(
  id: string,
  input: Partial<ExamScheduleLinkInput>,
): Promise<void> {
  const { error } = await supabase
    .from('exam_schedule_links')
    .update(input)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteScheduleLink(
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from('exam_schedule_links')
    .delete()
    .eq('id', id);

  if (error) throw error;
}


// ── Theme ────────────────────────────────────────────────────

export async function fetchTheme(): Promise<ThemeRow | null> {
  const { data, error } = await supabase
    .from('site_theme')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) throw error;

  return data as ThemeRow | null;
}

export async function updateTheme(
  input: ThemeInput,
): Promise<void> {
  const { error } = await supabase
    .from('site_theme')
    .update(input)
    .eq('id', 1);

  if (error) throw error;
}


// ── Content ──────────────────────────────────────────────────

export async function fetchAllContent(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('site_content')
    .select('*');

  if (error) throw error;

  const map: Record<string, string> = {};

  (data as ContentRow[]).forEach((row) => {
    map[row.content_key] = row.content_value;
  });

  return map;
}

export async function updateContentItem(
  key: string,
  value: string,
): Promise<void> {
  const { error } = await supabase
    .from('site_content')
    .upsert(
      {
        content_key: key,
        content_value: value,
      },
      {
        onConflict: 'content_key',
      },
    );

  if (error) throw error;
}

export async function updateContentBatch(
  items: Record<string, string>,
): Promise<void> {
  const rows = Object.entries(items).map(
    ([content_key, content_value]) => ({
      content_key,
      content_value,
    }),
  );

  const { error } = await supabase
    .from('site_content')
    .upsert(rows, {
      onConflict: 'content_key',
    });

  if (error) throw error;
}

export async function deleteContentItem(
  key: string,
): Promise<void> {
  const { error } = await supabase
    .from('site_content')
    .delete()
    .eq('content_key', key);

  if (error) throw error;
}


// ── Page sections ────────────────────────────────────────────

export async function fetchPageSections(): Promise<PageSectionRow[]> {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return data as PageSectionRow[];
}

export async function updatePageSection(
  id: string,
  input: Partial<PageSectionRow>,
): Promise<void> {
  const { error } = await supabase
    .from('page_sections')
    .update(input)
    .eq('id', id);

  if (error) throw error;
}

export async function createPageSection(
  input: Partial<PageSectionRow>,
): Promise<void> {
  const { error } = await supabase
    .from('page_sections')
    .insert(input);

  if (error) throw error;
}

export async function deletePageSection(
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from('page_sections')
    .delete()
    .eq('id', id);

  if (error) throw error;
}


// ── Visual editor: section layout ───────────────────────────

function getSectionConfig(
  section: PageSectionRow,
): SectionContentConfig {
  if (
    section.content_json &&
    typeof section.content_json === 'object' &&
    !Array.isArray(section.content_json)
  ) {
    return section.content_json as SectionContentConfig;
  }

  return {};
}

export function getSectionLayout(
  section: PageSectionRow,
): SectionLayout {
  const config = getSectionConfig(section);

  if (
    config.layout &&
    typeof config.layout === 'object'
  ) {
    return (
      config.layout.desktop ??
      {}
    );
  }

  return {};
}

export async function updatePageSectionLayout(
  id: string,
  layout: SectionLayout,
): Promise<void> {
  const { data, error: fetchError } = await supabase
    .from('page_sections')
    .select('content_json')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  let config: SectionContentConfig = {};

  if (
    data?.content_json &&
    typeof data.content_json === 'object' &&
    !Array.isArray(data.content_json)
  ) {
    config = data.content_json as SectionContentConfig;
  }

  const currentLayout =
    config.layout ?? {};

  const nextConfig: SectionContentConfig = {
    ...config,
    layout: {
      ...currentLayout,
      desktop: {
        ...(currentLayout.desktop ?? {}),
        ...layout,
      },
    },
  };

  const { error } = await supabase
    .from('page_sections')
    .update({
      content_json: nextConfig,
    })
    .eq('id', id);

  if (error) throw error;
}

export async function updatePageSectionMobileLayout(
  id: string,
  layout: SectionLayout,
): Promise<void> {
  const { data, error: fetchError } = await supabase
    .from('page_sections')
    .select('content_json')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  let config: SectionContentConfig = {};

  if (
    data?.content_json &&
    typeof data.content_json === 'object' &&
    !Array.isArray(data.content_json)
  ) {
    config = data.content_json as SectionContentConfig;
  }

  const currentLayout =
    config.layout ?? {};

  const nextConfig: SectionContentConfig = {
    ...config,
    layout: {
      ...currentLayout,
      mobile: {
        ...(currentLayout.mobile ?? {}),
        ...layout,
      },
    },
  };

  const { error } = await supabase
    .from('page_sections')
    .update({
      content_json: nextConfig,
    })
    .eq('id', id);
  
  if (error) throw error;
}

export async function updatePageSectionContent(
  id: string,
  content: Record<string, unknown>,
): Promise<void> {
  const { data, error: fetchError } = await supabase
    .from('page_sections')
    .select('content_json')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  let currentConfig: SectionContentConfig = {};

  if (
    data?.content_json &&
    typeof data.content_json === 'object' &&
    !Array.isArray(data.content_json)
  ) {
    currentConfig =
      data.content_json as SectionContentConfig;
  }

  const nextConfig: SectionContentConfig = {
    ...currentConfig,
    ...content,
  };

  const { error } = await supabase
    .from('page_sections')
    .update({
      content_json: nextConfig,
    })
    .eq('id', id);

  if (error) throw error;
}


// ── Navigation ──────────────────────────────────────────────

export async function fetchNavItems(
  location?: string,
): Promise<NavItemRow[]> {
  let query = supabase
    .from('nav_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (location) {
    query = query.eq('location', location);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data as NavItemRow[];
}

export async function createNavItem(
  input: NavItemInput,
): Promise<void> {
  const { error } = await supabase
    .from('nav_items')
    .insert(input);

  if (error) throw error;
}

export async function updateNavItem(
  id: string,
  input: Partial<NavItemInput>,
): Promise<void> {
  const { error } = await supabase
    .from('nav_items')
    .update(input)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteNavItem(
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from('nav_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}


// ── Custom pages ─────────────────────────────────────────────

export async function fetchCustomPage(
  slug: string,
): Promise<CustomPageRow | null> {
  const { data, error } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;

  return data as CustomPageRow | null;
}

export async function fetchAllCustomPages(): Promise<CustomPageRow[]> {
  const { data, error } = await supabase
    .from('custom_pages')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return data as CustomPageRow[];
}

export async function createCustomPage(
  input: CustomPageInput,
): Promise<void> {
  const { error } = await supabase
    .from('custom_pages')
    .insert(input);

  if (error) throw error;
}

export async function updateCustomPage(
  id: string,
  input: Partial<CustomPageInput>,
): Promise<void> {
  const { error } = await supabase
    .from('custom_pages')
    .update(input)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCustomPage(
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from('custom_pages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}


// ── Media ────────────────────────────────────────────────────

export async function fetchMediaItems(): Promise<MediaItemRow[]> {
  const { data, error } = await supabase
    .from('media_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as MediaItemRow[];
}

export async function insertMediaItem(
  item: Omit<MediaItemRow, 'id' | 'created_at'>,
): Promise<void> {
  const { error } = await supabase
    .from('media_items')
    .insert(item);

  if (error) throw error;
}

export async function deleteMediaItem(
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from('media_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function uploadMedia(
  file: File,
): Promise<string> {
  const fileName =
    `${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9.\-]/g,
      '_',
    )}`;

  const { data, error } = await supabase.storage
    .from('media')
    .upload(fileName, file, {
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } =
    supabase.storage
      .from('media')
      .getPublicUrl(data.path);

  return urlData.publicUrl;
}


// ── Form fields ──────────────────────────────────────────────

export async function fetchFormFields(
  activeOnly = false,
): Promise<FormFieldRow[]> {
  let query = supabase
    .from('form_fields')
    .select('*')
    .order('sort_order', { ascending: true });

  if (activeOnly) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data as FormFieldRow[];
}

export async function createFormField(
  input: FormFieldInput,
): Promise<void> {
  const { error } = await supabase
    .from('form_fields')
    .insert(input);

  if (error) throw error;
}

export async function updateFormField(
  id: string,
  input: Partial<FormFieldInput>,
): Promise<void> {
  const { error } = await supabase
    .from('form_fields')
    .update(input)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteFormField(
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from('form_fields')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
