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

export function HomePage() {
  const { sections, loading } = usePageSections();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const visible = sections.filter((s) => s.visible);

  return (
    <>
      {visible.map((section) => {
        const Component = sectionMap[section.section_key];
        if (!Component) return null;
        return <Component key={section.id} />;
      })}
    </>
  );
}
