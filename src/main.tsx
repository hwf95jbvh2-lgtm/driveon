import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ContentProvider } from '@/context/ContentContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <ContentProvider>
          <App />
        </ContentProvider>
      </SettingsProvider>
    </ThemeProvider>
  </StrictMode>
);
