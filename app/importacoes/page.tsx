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
    const interval = setInterval(fetchImports, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONCLUIDO': return <CheckCircle2 className="text-green-500" size={18} />;
      case 'ERRO': return <XCircle className="text-red-500" size={18} />;
      case 'PROCESSANDO': return <Clock className="text-blue-500 animate-pulse" size={18} />;
      default: return <AlertCircle className="text-amber-500" size={18} />;
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
                      <div className="flex items-center justify-center gap-2">
                        {getStatusIcon(imp.status)}
                        <span className="text-[10px] font-bold uppercase tracking-wide">
                          {imp.status.replace('_', ' ')}
                        </span>
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
