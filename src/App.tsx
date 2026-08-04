import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/admin/Toast';
import { HomePage } from '@/pages/HomePage';
import { ExamsPage } from '@/pages/ExamsPage';
import { AfterExamPage } from '@/pages/AfterExamPage';
import { UsefulPage } from '@/pages/UsefulPage';
import { UsefulArticlePage } from '@/pages/UsefulArticlePage';
import { AboutPage } from '@/pages/AboutPage';
import { TelegramPage } from '@/pages/TelegramPage';
import { Layout } from '@/components/layout/Layout';
import { ButtonLink } from '@/components/ui/Button';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminExamsPage } from '@/pages/admin/AdminExamsPage';
import { AdminExperiencesPage } from '@/pages/admin/AdminExperiencesPage';
import { AdminStreetsPage } from '@/pages/admin/AdminStreetsPage';
import { AdminUsefulPage } from '@/pages/admin/AdminUsefulPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminScheduleLinksPage } from '@/pages/admin/AdminScheduleLinksPage';
import { AdminAppearancePage } from '@/pages/admin/AdminAppearancePage';
import { AdminContentPage } from '@/pages/admin/AdminContentPage';
import { AdminSectionsPage } from '@/pages/admin/AdminSectionsPage';
import { AdminNavigationPage } from '@/pages/admin/AdminNavigationPage';
import { AdminPagesPage } from '@/pages/admin/AdminPagesPage';
import { AdminMediaPage } from '@/pages/admin/AdminMediaPage';
import { AdminFormFieldsPage } from '@/pages/admin/AdminFormFieldsPage';
import { CustomPageView } from '@/pages/CustomPageView';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function NotFoundPage() {
  return (
    <Layout>
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="label mb-4">404</span>
        <h1 className="h1">Страница не найдена</h1>
        <p className="body-text mt-5">
          Возможно, страница была перемещена или вы перешли по неверной ссылке.
        </p>
        <ButtonLink to="/" size="md" className="mt-8">
          На главную
        </ButtonLink>
      </section>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <Routes>
            {/* Public site */}
            <Route path="/" element={<HomePage />} />
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/after-exam" element={<AfterExamPage />} />
            <Route path="/useful" element={<UsefulPage />} />
            <Route path="/useful/:slug" element={<UsefulArticlePage />} />
            <Route path="/page/:slug" element={<CustomPageView />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/telegram" element={<TelegramPage />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="exams" element={<AdminExamsPage />} />
              <Route path="schedule" element={<AdminScheduleLinksPage />} />
              <Route path="experiences" element={<AdminExperiencesPage />} />
              <Route path="streets" element={<AdminStreetsPage />} />
              <Route path="useful" element={<AdminUsefulPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="appearance" element={<AdminAppearancePage />} />
              <Route path="content" element={<AdminContentPage />} />
              <Route path="sections" element={<AdminSectionsPage />} />
              <Route path="navigation" element={<AdminNavigationPage />} />
              <Route path="pages" element={<AdminPagesPage />} />
              <Route path="media" element={<AdminMediaPage />} />
              <Route path="form-fields" element={<AdminFormFieldsPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
