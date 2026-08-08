```tsx
import { usePageSections } from '@/hooks/usePageSections';
import { Hero } from '@/components/sections/Hero';
import { ExamsSection } from '@/components/sections/ExamsSection';
import { WhereSection } from '@/components/sections/WhereSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { UsefulSection } from '@/components/sections/UsefulSection';
import { TelegramSection } from '@/components/sections/TelegramSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { DisclaimerSection } from '@/components/sections/DisclaimerSection';

const sectionMap: Record<string, React.ComponentType> = {
  hero: Hero,
  exams: ExamsSection,
  where: WhereSection,
  experience: ExperienceSection,
  useful: UsefulSection,
  telegram: TelegramSection,
  about: AboutSection,
  disclaimer: DisclaimerSection,
};

interface SectionLayout {
  width?: string;
  paddingTop?: number;
  paddingBottom?: number;
  marginTop?: number;
  marginBottom?: number;
  gap?: number;
  background?: string;
  borderRadius?: number;
  contentAlign?: 'left' | 'center' | 'right';
}

function getSectionLayout(contentJson: unknown): SectionLayout {
  if (!contentJson || typeof contentJson !== 'object') {
    return {};
  }

  const value = contentJson as Record<string, unknown>;
  const layout = value.layout;

  if (!layout || typeof layout !== 'object') {
    return {};
  }

  const data = layout as Record<string, unknown>;

  return {
    width: typeof data.width === 'string' ? data.width : undefined,
    paddingTop:
      typeof data.paddingTop === 'number' ? data.paddingTop : undefined,
    paddingBottom:
      typeof data.paddingBottom === 'number' ? data.paddingBottom : undefined,
    marginTop:
      typeof data.marginTop === 'number' ? data.marginTop : undefined,
    marginBottom:
      typeof data.marginBottom === 'number' ? data.marginBottom : undefined,
    gap: typeof data.gap === 'number' ? data.gap : undefined,
    background:
      typeof data.background === 'string' ? data.background : undefined,
    borderRadius:
      typeof data.borderRadius === 'number'
        ? data.borderRadius
        : undefined,
    contentAlign:
      data.contentAlign === 'center' ||
      data.contentAlign === 'right' ||
      data.contentAlign === 'left'
        ? data.contentAlign
        : undefined,
  };
}

function getSectionStyle(layout: SectionLayout): React.CSSProperties {
  const style: React.CSSProperties & Record<string, string | number> = {};

  if (layout.paddingTop !== undefined) {
    style.paddingTop = `${layout.paddingTop}px`;
  }

  if (layout.paddingBottom !== undefined) {
    style.paddingBottom = `${layout.paddingBottom}px`;
  }

  if (layout.marginTop !== undefined) {
    style.marginTop = `${layout.marginTop}px`;
  }

  if (layout.marginBottom !== undefined) {
    style.marginBottom = `${layout.marginBottom}px`;
  }

  if (layout.gap !== undefined) {
    style['--section-gap'] = `${layout.gap}px`;
  }

  if (layout.background) {
    style.background = layout.background;
  }

  if (layout.borderRadius !== undefined) {
    style.borderRadius = `${layout.borderRadius}px`;
  }

  if (layout.contentAlign) {
    style.textAlign = layout.contentAlign;
  }

  return style;
}

export function HomePage() {
  const { sections, loading } = usePageSections();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const visible = sections.filter((section) => section.visible);

  return (
    <main className="w-full">
      {visible.map((section) => {
        const Component = sectionMap[section.section_key];

        if (!Component) {
          return null;
        }

        const layout = getSectionLayout(section.content_json);
        const style = getSectionStyle(layout);

        return (
          <div
            key={section.id}
            data-section-key={section.section_key}
            className="relative w-full transition-all duration-200"
            style={style}
          >
            <Component />
          </div>
        );
      })}
    </main>
  );
}
```
