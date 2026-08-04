import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput } from '@/components/ui/FormField';

export function AdminLoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch {
      setError('Неверный email или пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-pearl-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500">
            <Lock className="h-7 w-7 text-pearl-100" />
          </span>
          <h1 className="h2">Вход в админ-панель</h1>
          <p className="small-text">DriveON — управление содержимым сайта</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-3xl bg-pearl-50 p-6 shadow-card sm:p-8"
        >
          <FormField label="Email" name="email" required>
            <TextInput
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@drivesquad.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>

          <FormField label="Пароль" name="password" required>
            <TextInput
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-3 text-sm text-orange-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" size="lg" disabled={loading} className="mt-2">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Вход…
              </>
            ) : (
              'Войти'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center small-text">
          Доступ только для администраторов.
        </p>
      </div>
    </div>
  );
}
