'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { formatCPF, formatPhone } from '@/lib/utils';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Trash2, 
  Edit 
} from 'lucide-react';

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPessoas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pessoas?search=${search}`);
      const result = await res.json();
      setPessoas(result.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPessoas();
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta pessoa?')) return;
    await fetch(`/api/pessoas/${id}`, { method: 'DELETE' });
    fetchPessoas();
  };

  return (
    <DashboardShell title="Gestão de Pessoas">
      <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, CPF ou email..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg focus:ring-2 focus:ring-primary transition-all sm:text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium text-sm">
            <UserPlus size={18} />
            Nova Pessoa
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-800 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Nome</th>
                <th className="px-6 py-4 font-semibold text-center">CPF</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Telefone</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Carregando registros...
                  </td>
                </tr>
              ) : pessoas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhuma pessoa encontrada.
                  </td>
                </tr>
              ) : (
                pessoas.map((pessoa) => (
                  <tr key={pessoa.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{pessoa.nome}</td>
                    <td className="px-6 py-4 text-center font-mono">{formatCPF(pessoa.cpf)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{pessoa.email || '-'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatPhone(pessoa.telefone)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        pessoa.status === 'ATIVO' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                      }`}>
                        {pessoa.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors text-muted-foreground hover:text-primary">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(pessoa.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
