'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Users, Headphones, Zap, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@importdata.com');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError('Erro ao realizar login. Tente novamente.');
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoSenha = 'Password@123') => {
    setError('');
    setLoadingDemo(demoEmail);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, senha: demoSenha }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoadingDemo(null);
        return;
      }

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError('Falha ao autenticar com perfil de demonstração.');
      setLoadingDemo(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-6 p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Zap className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Import Data</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sistema Inteligente de Importação e Gestão de Dados
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-3 text-gray-500 dark:text-gray-400 font-semibold">
              Ou Login Rápido (1 Clique)
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@importdata.com')}
            disabled={!!loadingDemo}
            className="w-full flex items-center justify-between p-3 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all text-left"
          >
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-red-600" />
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">Administrador Geral</div>
                <div className="text-[11px] text-gray-500">admin@importdata.com</div>
              </div>
            </div>
            {loadingDemo === 'admin@importdata.com' ? (
              <Loader2 className="h-4 w-4 animate-spin text-red-600" />
            ) : (
              <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded">
                Admin
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('gerente@importdata.com')}
            disabled={!!loadingDemo}
            className="w-full flex items-center justify-between p-3 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-xl transition-all text-left"
          >
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">Gerente de Operações</div>
                <div className="text-[11px] text-gray-500">gerente@importdata.com</div>
              </div>
            </div>
            {loadingDemo === 'gerente@importdata.com' ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            ) : (
              <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                Gerente
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('operador@importdata.com')}
            disabled={!!loadingDemo}
            className="w-full flex items-center justify-between p-3 border border-green-200 dark:border-green-900/50 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-xl transition-all text-left"
          >
            <div className="flex items-center space-x-3">
              <Headphones className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">Operador de Importação</div>
                <div className="text-[11px] text-gray-500">operador@importdata.com</div>
              </div>
            </div>
            {loadingDemo === 'operador@importdata.com' ? (
              <Loader2 className="h-4 w-4 animate-spin text-green-600" />
            ) : (
              <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-950 px-2 py-0.5 rounded">
                Operador
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
