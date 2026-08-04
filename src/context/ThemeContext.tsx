import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { ThemeRow } from '@/types';

interface ThemeContextValue {
  theme: ThemeRow | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: null,
  loading: true,
  refresh: async () => {},
});

// Color shade generation: lightens/darkens a hex color by a percentage
function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(255 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(255 * percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function applyTheme(t: ThemeRow) {
  const root = document.documentElement;

  // Semantic colors
  root.style.setProperty('--color-primary', t.primary_color);
  root.style.setProperty('--color-secondary', t.secondary_color);
  root.style.setProperty('--color-accent', t.accent_color);
  root.style.setProperty('--color-background', t.background_color);
  root.style.setProperty('--color-text', t.text_color);
  root.style.setProperty('--color-heading', t.heading_color);
  root.style.setProperty('--color-button-primary', t.button_primary_color);
  root.style.setProperty('--color-button-secondary', t.button_secondary_color);
  root.style.setProperty('--color-button-text', t.button_text_color);
  root.style.setProperty('--color-card', t.card_color);
  root.style.setProperty('--color-footer', t.footer_color);
  root.style.setProperty('--color-link', t.link_color);

  // Generate shade ramps from primary (teal) and secondary (orange)
  const teal = t.primary_color;
  const orange = t.secondary_color;
  root.style.setProperty('--color-teal-50', shade(teal, 0.55));
  root.style.setProperty('--color-teal-100', shade(teal, 0.40));
  root.style.setProperty('--color-teal-200', shade(teal, 0.25));
  root.style.setProperty('--color-teal-300', shade(teal, 0.15));
  root.style.setProperty('--color-teal-400', shade(teal, 0.07));
  root.style.setProperty('--color-teal-500', teal);
  root.style.setProperty('--color-teal-600', shade(teal, -0.07));
  root.style.setProperty('--color-teal-700', shade(teal, -0.15));
  root.style.setProperty('--color-teal-800', shade(teal, -0.25));

  root.style.setProperty('--color-orange-50', shade(orange, 0.55));
  root.style.setProperty('--color-orange-100', shade(orange, 0.40));
  root.style.setProperty('--color-orange-200', shade(orange, 0.25));
  root.style.setProperty('--color-orange-300', shade(orange, 0.15));
  root.style.setProperty('--color-orange-400', shade(orange, 0.07));
  root.style.setProperty('--color-orange-500', orange);
  root.style.setProperty('--color-orange-600', shade(orange, -0.07));
  root.style.setProperty('--color-orange-700', shade(orange, -0.15));
  root.style.setProperty('--color-orange-800', shade(orange, -0.25));

  // Typography
  root.style.setProperty('--font-heading', `'${t.heading_font}'`);
  root.style.setProperty('--font-body', `'${t.body_font}'`);
  root.style.setProperty('--theme-line-height', t.line_height);

  // Radius
  root.style.setProperty('--radius-button', `${t.button_radius / 16}rem`);
  root.style.setProperty('--radius-card', `${t.card_radius / 16}rem`);
  root.style.setProperty('--radius-card-lg', `${(t.card_radius + 8) / 16}rem`);
  root.style.setProperty('--radius-input', `${t.input_radius / 16}rem`);

  // Shadows
  const shadowMap: Record<string, string> = {
    none: 'none',
    light: '0 1px 2px rgba(0,0,0,0.03), 0 4px 12px -8px rgba(0,0,0,0.08)',
    medium: '0 1px 2px rgba(26,26,23,0.04), 0 8px 24px -12px rgba(26,26,23,0.12)',
    strong: '0 2px 4px rgba(26,26,23,0.06), 0 16px 40px -14px rgba(26,26,23,0.25)',
  };
  const shadowVal = shadowMap[t.shadow_intensity] ?? shadowMap.medium;
  root.style.setProperty('--shadow-card', shadowVal);
  root.style.setProperty('--shadow-card-hover', t.shadow_intensity === 'none' ? 'none' : shadowVal);
  root.style.setProperty('--shadow-none', 'none');

  // Content width
  root.style.setProperty('--content-width', `${t.content_width}px`);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeRow | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data } = await supabase
      .from('site_theme')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (data) setTheme(data as ThemeRow);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase
          .from('site_theme')
          .select('*')
          .eq('id', 1)
          .maybeSingle();
        if (mounted && data) setTheme(data as ThemeRow);
      } catch {
        // ignore — CSS defaults remain
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (theme) applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, loading, refresh }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
