'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { 
  Users, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2,
  Upload,
  Globe,
  Database,
  Zap,
  Cpu,
  ShieldCheck
} from 'lucide-react';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalPeople: 0,
    totalImports: 0,
    processedRecords: 0,
    errorCount: 0
  });

  const [health, setHealth] = useState({
    api: 'ONLINE',
    database: 'LOADING',
    redis: 'LOADING',
    worker: 'LOADING'
  });

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch (e) {
      setHealth({ api: 'ERROR', database: 'ERROR', redis: 'ERROR', worker: 'ERROR' });
    }
  };

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        const [peopleRes, importsRes] = await Promise.all([
          fetch('/api/pessoas'),
          fetch('/api/importacoes')
        ]);
        const people = await peopleRes.json();
        const imports = await importsRes.json();

        setStats({
          totalPeople: Array.isArray(people.data) ? people.total : (people.total || 0),
          totalImports: Array.isArray(imports) ? imports.length : 0,
          processedRecords: Array.isArray(imports) ? imports.reduce((acc: number, curr: any) => acc + curr.processados, 0) : 0,
          errorCount: Array.isArray(imports) ? imports.reduce((acc: number, curr: any) => acc + curr.erros, 0) : 0
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: 'Total de Pessoas', value: stats.totalPeople, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
    { label: 'Importações Realizadas', value: stats.totalImports, icon: FileCheck, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' },
    { label: 'Registros Processados', value: stats.processedRecords, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
    { label: 'Erros Encontrados', value: stats.errorCount, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' }
  ];

  const statusItems = [
    { label: 'API', status: health.api, icon: Globe },
    { label: 'Banco de Dados', status: health.database, icon: Database },
    { label: 'Fila Redis', status: health.redis, icon: Zap },
    { label: 'Worker', status: health.worker, icon: Cpu }
  ];

  if (!mounted) {
    return (
      <DashboardShell title="Visão Geral">
        <div className="h-[400px] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Visão Geral">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-zinc-900 border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} p-2 rounded-lg`}>
                <card.icon className={card.color} size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">{card.label}</h3>
              <p className="text-3xl font-bold tracking-tight">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status do Sistema Side Card */}
        <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl p-6 h-full flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
              <ShieldCheck className="text-primary" size={20} />
              Status do Sistema
            </h3>
            <div className="space-y-4">
              {statusItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-border">
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-muted-foreground" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      item.status === 'ONLINE' ? 'bg-green-500 animate-pulse outline-green-500/20' : 
                      item.status === 'LOADING' ? 'bg-amber-500' : 'bg-red-500'
                    } outline outline-offset-2 outline-2`}></span>
                    <span className={`text-[10px] font-black uppercase ${
                      item.status === 'ONLINE' ? 'text-green-600' : 
                      item.status === 'LOADING' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {item.status === 'ONLINE' ? 'Online' : item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 text-center italic">Monitoramento em tempo real (atualizado a cada 10s)</p>
        </div>

        {/* Centro de Ações Rápidas */}
        <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Zap className="text-amber-500" size={20} />
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full content-start">
            <button 
              onClick={() => window.location.href = '/importacoes/novo'}
              className="group flex items-center gap-4 p-5 border border-border border-dashed rounded-xl hover:bg-primary/5 hover:border-primary transition-all duration-300"
            >
              <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm">Nova Importação</h4>
                <p className="text-xs text-muted-foreground">Envio de arquivos CSV/XLSX.</p>
              </div>
            </button>
            <button 
              onClick={() => window.location.href = '/usuarios'}
              className="group flex items-center gap-4 p-5 border border-border border-dashed rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300"
            >
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-xl group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm">Gerenciar Usuários</h4>
                <p className="text-xs text-muted-foreground">Adicionar ou remover acessos.</p>
              </div>
            </button>
            <button 
              className="group flex items-center gap-4 p-5 border border-border border-dashed rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300"
            >
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-xl group-hover:scale-110 transition-transform">
                <Cpu size={24} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm">Configurações</h4>
                <p className="text-xs text-muted-foreground">Em breve.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
