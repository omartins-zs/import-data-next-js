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
  ShieldCheck,
  History as HistoryIcon,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

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

  const [latestImports, setLatestImports] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const refreshData = async () => {
      try {
        const [peopleRes, importsRes, healthRes] = await Promise.all([
          fetch('/api/pessoas'),
          fetch('/api/importacoes'),
          fetch('/api/health')
        ]);
        
        const people = await peopleRes.json();
        const imports = await importsRes.json();
        const healthData = await healthRes.json();

        setStats({
          totalPeople: Array.isArray(people.data) ? people.total : (people.total || 0),
          totalImports: Array.isArray(imports) ? imports.length : 0,
          processedRecords: Array.isArray(imports) ? imports.reduce((acc: number, curr: any) => acc + curr.processados, 0) : 0,
          errorCount: Array.isArray(imports) ? imports.reduce((acc: number, curr: any) => acc + curr.erros, 0) : 0
        });

        setLatestImports(Array.isArray(imports) ? imports.slice(0, 5) : []);
        setHealth(healthData);
      } catch (e) {
        console.error(e);
      }
    };

    refreshData();
    const interval = setInterval(refreshData, 3000); // Check every 3s
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCESSO': return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">SUCESSO</span>;
      case 'FALHA': return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">FALHA</span>;
      case 'ERRO': return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">ERRO</span>;
      case 'SUCESSO_PARCIAL': return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">PARCIAL</span>;
      case 'PROCESSANDO': return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 animate-pulse">PROCESSANDO</span>;
      default: return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/50">{status}</span>;
    }
  };

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
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-foreground">
              <ShieldCheck className="text-primary" size={20} />
              Status do Sistema
            </h3>
            <div className="space-y-4">
              {statusItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-border">
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
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
          <p className="text-[10px] text-muted-foreground mt-4 text-center italic">Monitoramento em tempo real (atualizado a cada 3s)</p>
        </div>

        {/* Últimas Atividades */}
        <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2 text-foreground">
              <HistoryIcon size={20} className="text-indigo-500" />
              Atividades Recentes
            </h3>
            <button 
              onClick={() => window.location.href = '/importacoes'}
              className="text-xs text-primary font-bold hover:underline"
            >
              Ver Tudo
            </button>
          </div>
          <div className="overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="pb-3 font-semibold">Arquivo</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {latestImports.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground italic">Nenhuma atividade recente.</td>
                  </tr>
                ) : (
                  latestImports.map((imp: any) => (
                    <tr key={imp.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group cursor-pointer" onClick={() => window.location.href = `/importacoes/${imp.id}`}>
                      <td className="py-3 flex items-center gap-2">
                        <FileText size={14} className="text-zinc-400" />
                        <span className="font-medium text-foreground truncate max-w-[150px]">{imp.nome_arquivo}</span>
                      </td>
                      <td className="py-3 text-center">
                        {getStatusBadge(imp.status)}
                      </td>
                      <td className="py-3 text-right text-muted-foreground text-xs">
                        {format(new Date(imp.criado_em), 'HH:mm')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-zinc-900 border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-foreground">
            <Zap className="text-amber-500" size={20} />
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => window.location.href = '/importacoes/novo'}
              className="group flex items-center gap-4 p-5 border border-border border-dashed rounded-xl hover:bg-primary/5 hover:border-primary transition-all duration-300"
            >
              <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-foreground">Nova Importação</h4>
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
                <h4 className="font-bold text-sm text-foreground">Gerenciar Usuários</h4>
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
                <h4 className="font-bold text-sm text-foreground">Configurações</h4>
                <p className="text-xs text-muted-foreground">Em breve.</p>
              </div>
            </button>
          </div>
      </div>
    </DashboardShell>
  );
}
