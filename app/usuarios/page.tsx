'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  Mail, 
  User as UserIcon,
  Plus,
  Save,
  X,
  Lock,
  Edit,
  UserCheck
} from 'lucide-react';
import { format } from 'date-fns';

const STATIC_ADMIN = {
  id: 'static-admin',
  nome: 'Usuário Master (Sistema)',
  email: 'admin@importdata.com',
  isStatic: true,
  criado_em: new Date().toISOString()
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [error, setError] = useState('');

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      // Combine with static admin
      setUsuarios([STATIC_ADMIN, ...list.filter(u => u.email !== STATIC_ADMIN.email)]);
    } catch (e) {
      console.error(e);
      setUsuarios([STATIC_ADMIN]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editando) {
        // Only include password if filled
        const payload: any = { nome: formData.nome, email: formData.email };
        if (formData.senha) payload.senha = formData.senha;

        const res = await fetch(`/api/usuarios/${editando.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      } else {
        const res = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      }
      
      setModalAberto(false);
      setEditando(null);
      setFormData({ nome: '', email: '', senha: '' });
      fetchUsuarios();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (user: any) => {
    if (user.isStatic) return;
    setEditando(user);
    setFormData({ nome: user.nome, email: user.email, senha: '' });
    setModalAberto(true);
  };

  const handleDelete = async (id: string, isStatic?: boolean) => {
    if (isStatic) return;
    if (!confirm('Deseja realmente excluir este usuário?')) return;
    try {
      await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      fetchUsuarios();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardShell title="Controle de Acessos (Usuários)">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
            <UserCheck size={24} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Gestão de Usuários</h2>
            <p className="text-xs text-muted-foreground">Crie e gerencie os usuários com acesso administrativo.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setEditando(null);
            setFormData({ nome: '', email: '', senha: '' });
            setModalAberto(true);
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={20} />
          Criar Novo Usuário
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-800 text-muted-foreground transition-colors border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Identificação</th>
                <th className="px-6 py-4 font-bold">E-mail</th>
                <th className="px-6 py-4 font-bold text-center">Tipo</th>
                <th className="px-6 py-4 font-bold">Criado em</th>
                <th className="px-6 py-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6 h-12 bg-zinc-50/50 dark:bg-zinc-800/20"></td>
                  </tr>
                ))
              ) : usuarios.map((user) => (
                <tr key={user.id} className={`transition-colors ${user.isStatic ? 'bg-indigo-50/20 dark:bg-indigo-900/5' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${user.isStatic ? 'bg-primary/10 text-primary' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                        <UserIcon size={18} />
                      </div>
                      <span className="font-bold text-foreground">{user.nome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.isStatic ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-zinc-100 dark:bg-zinc-800 text-muted-foreground'}`}>
                      {user.isStatic ? 'Sistema' : 'Membro'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs font-mono">
                    {format(new Date(user.criado_em), 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        disabled={user.isStatic}
                        onClick={() => handleEdit(user)}
                        className={`p-2 rounded-lg transition-colors ${user.isStatic ? 'opacity-20 cursor-not-allowed' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        disabled={user.isStatic}
                        onClick={() => handleDelete(user.id, user.isStatic)}
                        className={`p-2 rounded-lg transition-colors ${user.isStatic ? 'opacity-20 cursor-not-allowed' : 'text-muted-foreground hover:bg-red-50 hover:text-red-500'}`}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
              <h3 className="text-xl font-bold flex items-center gap-3 text-foreground">
                {editando ? <Edit size={24} className="text-primary" /> : <UserPlus size={24} className="text-primary" />}
                {editando ? 'Editar Usuário' : 'Criar Novo Usuário'}
              </h3>
              <button 
                onClick={() => setModalAberto(false)}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors text-muted-foreground"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Nome de Exibição</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    required
                    type="text"
                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border-border border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300"
                    placeholder="Ex: João da Silva"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">E-mail de Login</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    required
                    type="email"
                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border-border border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300"
                    placeholder="email@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">
                  {editando ? 'Senha (deixe vazio para não alterar)' : 'Senha Inicial'}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    required={!editando}
                    type="password"
                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border-border border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300"
                    placeholder={editando ? "••••••••" : "No mínimo 6 caracteres"}
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-3">
                  <ShieldCheck size={18} className="text-red-500" />
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 text-lg flex items-center justify-center gap-3"
                >
                  <Save size={22} />
                  {editando ? 'Atualizar Usuário' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
