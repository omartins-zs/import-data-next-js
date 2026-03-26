'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { format } from 'date-fns';
import { 
  FileText, 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export default function ImportacoesPage() {
  const [importacoes, setImportacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImports = async () => {
    try {
      const res = await fetch('/api/importacoes');
      const data = await res.json();
      setImportacoes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImports();
    const interval = setInterval(fetchImports, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCESSO': 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">
          <CheckCircle2 size={12} /> SUCESSO
        </span>;
      case 'FALHA': 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
          <AlertCircle size={12} /> FALHA
        </span>;
      case 'ERRO': 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">
          <XCircle size={12} /> ERRO
        </span>;
      case 'SUCESSO_PARCIAL': 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
          <History size={12} /> SUCESSO PARCIAL
        </span>;
      case 'PROCESSANDO': 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 animate-pulse">
          <Clock size={12} className="animate-spin" /> PROCESSANDO
        </span>;
      default: 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/50">
          {status}
        </span>;
    }
  };

  return (
    <DashboardShell title="Histórico de Importações">
      <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-sm overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-800 text-muted-foreground transition-colors">
              <tr>
                <th className="px-6 py-4 font-semibold">Arquivo</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Progresso</th>
                <th className="px-6 py-4 font-semibold text-center">Erros</th>
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && importacoes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground animate-pulse">
                    Carregando histórico...
                  </td>
                </tr>
              ) : importacoes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhuma importação realizada.
                  </td>
                </tr>
              ) : (
                importacoes.map((imp) => (
                  <tr key={imp.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
                        <FileText size={18} />
                      </div>
                      <span className="font-medium text-foreground">{imp.nome_arquivo}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        {getStatusBadge(imp.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-full max-w-[100px] bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 mx-auto">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${imp.total_registros > 0 ? (imp.processados / imp.total_registros) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        {imp.processados} / {imp.total_registros}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-mono font-bold ${imp.erros > 0 ? 'text-red-500' : 'text-zinc-400'}`}>
                        {imp.erros}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(imp.criado_em), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded transition-colors"
                        onClick={() => window.location.href = `/importacoes/${imp.id}`}
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
