'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Upload, 
  LayoutDashboard, 
  FileStack,
  ShieldCheck,
  Settings, 
  LogOut 
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Pessoas', href: '/pessoas', icon: Users },
  { label: 'Importações', href: '/importacoes', icon: FileStack },
  { label: 'Novo Upload', href: '/importacoes/novo', icon: Upload },
  { label: 'Usuários', href: '/usuarios', icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card h-screen flex flex-col fixed left-0 top-0 transition-all duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary tracking-tight">Import Data</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <button 
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all"
        >
          <LogOut size={20} />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
