'use client';

import { useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  FileCheck, 
  AlertCircle, 
  X, 
  ChevronRight, 
  Table 
} from 'lucide-react';

export default function NovaImportacaoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');
    
    // Generate Preview
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setLoading(true);
      const res = await fetch('/api/importacoes/preview', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPreview(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pré-visualização');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await fetch('/api/importacoes', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      router.push('/importacoes');
    } catch (err: any) {
      setError(err.message || 'Erro ao iniciar importação');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    setError('');
  };

  return (
    <DashboardShell title="Nova Importação">
      <div className="max-w-4xl mx-auto space-y-6">
        {!file ? (
          <div className="relative group cursor-pointer h-72 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center bg-white dark:bg-zinc-900 shadow-sm hover:border-primary transition-all duration-300">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept=".csv,.xlsx"
              onChange={handleFileChange}
            />
            <div className="bg-primary/10 p-5 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
              <Upload className="text-primary" size={36} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Clique ou arraste o arquivo aqui</h3>
            <p className="text-sm text-muted-foreground mt-2">Suporta arquivos CSV e XLSX (Excel)</p>
            <p className="text-xs text-muted-foreground mt-4 font-mono bg-zinc-50 dark:bg-zinc-800 px-3 py-1 rounded">Limite de 10MB</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-lg overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-5">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                  <FileCheck size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{file.name}</h3>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button onClick={handleCancel} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-muted-foreground hover:text-red-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-4 text-sm font-medium text-foreground">
                <Table size={18} className="text-indigo-500" />
                Pré-visualização (Primeiras 10 linhas)
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full animate-pulse"></div>
                  ))}
                </div>
              ) : preview ? (
                <div className="overflow-x-auto border rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <table className="w-full text-[12px] text-left">
                    <thead className="bg-zinc-100 dark:bg-zinc-800 text-muted-foreground border-b border-border">
                      <tr>
                        {Object.keys(preview.rows[0] || {}).map((header) => (
                          <th key={header} className="px-4 py-3 font-semibold text-nowrap">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {preview.rows.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors">
                          {Object.values(row).map((val: any, j: number) => (
                            <td key={j} className="px-4 py-3 text-foreground whitespace-nowrap overflow-hidden max-w-[200px] text-ellipsis">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {error && (
                <div className="mt-4 flex items-center gap-2 text-sm text-red-500 font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}
            </div>

            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t flex justify-end gap-3">
              <button 
                onClick={handleCancel}
                className="px-6 py-2 border rounded-xl font-medium text-sm hover:bg-white dark:hover:bg-zinc-800 transition-colors text-muted-foreground"
              >
                Escolher outro
              </button>
              <button 
                onClick={handleConfirm}
                disabled={loading || !!error}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                Confirmar Importação
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
