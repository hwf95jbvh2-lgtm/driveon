import { useSettings } from '@/context/SettingsContext';
import { siteConfig } from '@/config';

/**
 * Returns the current live site settings, falling back to static defaults
 * while the database settings are loading.
 */
export function useSiteConfig() {
  const { settings } = useSettings();
  return {
    name: settings?.site_name ?? siteConfig.name,
    telegramUrl: settings?.telegram_url ?? siteConfig.telegramUrl,
    description: settings?.description ?? siteConfig.description,
    contactEmail: settings?.contact_email ?? siteConfig.contactEmail,
  };
}
