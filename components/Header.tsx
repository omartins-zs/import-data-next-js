'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header({ title }: { title: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="h-16 border-b flex items-center justify-between px-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 transition-all duration-300">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-muted relative transition-colors">
          <Bell size={20} className="text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
        </button>
        
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-muted transition-all duration-200 hover:scale-105"
          >
            {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
          </button>
        )}
      </div>
    </header>
  );
}
