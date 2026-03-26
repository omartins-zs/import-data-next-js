'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { format } from 'date-fns';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  AlertTriangle, 
  ListRestart, 
  ShieldAlert, 
  Database 
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function ImportacaoDetalhePage() {
  const { id } = useParams();
  const router = useRouter();
  const [importacao, setImportacao] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchImport = async () => {
    try {
      const res = await fetch(`/api/importacoes/${id}`);
      const data = await res.json();
      setImportacao(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImport();
    const interval = setInterval(fetchImport, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading && !importacao) return <DashboardShell title="Detalhes"><div className="flex h-32 items-center justify-center animate-pulse text-muted-foreground font-medium">Carregando detalhes...</div></DashboardShell>;
  if (!importacao) return <DashboardShell title="Detalhes"><div>Não encontrado. <button onClick={() => router.back()} className="text-primary hover:underline">Voltar</button></div></DashboardShell>;

  const progress = importacao.total_registros > 0 ? (importacao.processados / importacao.total_registros) * 100 : 0;

  return (
    <DashboardShell title={`Importação: ${importacao.nome_arquivo}`}>
      <button 
        onClick={() => router.push('/importacoes')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 group transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Voltar para o histórico
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl p-8 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{importacao.nome_arquivo}</h3>
                  <p className="text-sm text-muted-foreground">{format(new Date(importacao.criado_em), 'dd/MM/yyyy HH:mm')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  importacao.status === 'CONCLUIDO' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 
                  importacao.status === 'ERRO' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                }`}>
                  {importacao.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Progresso do Processamento</span>
                <span className="text-foreground">{Math.floor(progress)}%</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3.5 mb-2 overflow-hidden border border-border">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${importacao.status === 'ERRO' ? 'bg-red-500' : 'bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-border border-dashed">
                  <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Total</p>
                  <p className="text-xl font-bold">{importacao.total_registros}</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200/50 dark:border-green-800/50 border-dashed">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase mb-1">Processados</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-400">{importacao.processados}</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200/50 dark:border-red-800/50 border-dashed">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium uppercase mb-1">Erros</p>
                  <p className="text-xl font-bold text-red-700 dark:text-red-400">{importacao.erros}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-sm overflow-hidden transition-all duration-300">
            <div className="p-6 border-b bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2 text-foreground">
                <ShieldAlert size={20} className="text-red-500" />
                Divergências Encontradas ({importacao.erros_list.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase bg-zinc-100 dark:bg-zinc-800 transition-colors text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-bold">Linha</th>
                    <th className="px-6 py-4 font-bold">Campo</th>
                    <th className="px-6 py-4 font-bold">Inconsistência</th>
                    <th className="px-6 py-4 font-bold">Dados Originais</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {importacao.erros_list.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                        Nenhum erro registrado até o momento.
                      </td>
                    </tr>
                  ) : (
                    importacao.erros_list.map((err: any) => (
                      <tr key={err.id} className="hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                        <td className="px-6 py-4 font-bold text-red-600 dark:text-red-400">{err.linha}</td>
                        <td className="px-6 py-4 font-semibold text-foreground uppercase text-[10px]">{err.campo || 'Geral'}</td>
                        <td className="px-6 py-4 text-xs font-medium text-red-600 dark:text-red-400">{err.mensagem}</td>
                        <td className="px-6 py-4">
                          <pre className="text-[10px] p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden max-w-[200px] text-ellipsis border border-border transition-colors">
                            {JSON.stringify(err.dados)}
                          </pre>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl p-6 shadow-sm transition-all duration-300">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
              <Database size={16} />
              Logs do Barramento
            </h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-zinc-100 dark:before:bg-zinc-800 transition-colors">
              {importacao.logs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aguardando telemetria...</p>
              ) : (
                importacao.logs.map((log: any) => (
                  <div key={log.id} className="relative pl-10 group">
                    <div className={`absolute left-4 top-1 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 z-10 transition-all ${
                      log.nivel === 'ERROR' ? 'bg-red-500 scale-125' : 'bg-primary group-hover:bg-indigo-600 shadow-sm'
                    }`}></div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-mono">{format(new Date(log.criado_em), 'HH:mm:ss.SSS')}</p>
                      <p className={`text-sm font-medium ${log.nivel === 'ERROR' ? 'text-red-500' : 'text-foreground'}`}>{log.mensagem}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6 transition-all">
            <h4 className="font-bold flex items-center gap-2 mb-4 text-foreground">
              <ListRestart size={20} className="text-primary" />
              Recuperação de Falhas
            </h4>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Deseja tentar reprocessar os registros que falharam? O sistema tentará novamente baseando-se nos logs salvos.
            </p>
            <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
              Reprocessar Erros
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
