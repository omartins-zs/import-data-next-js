import { NextRequest, NextResponse } from 'next/server';
import { usuariosRepository } from '@/modules/usuarios/usuarios.repository';

const DEMO_USERS = [
  {
    id: 'usr_admin_001',
    nome: 'Administrador Geral',
    email: 'admin@importdata.com',
    perfil: 'Admin',
  },
  {
    id: 'usr_gerente_002',
    nome: 'Gerente de Operações',
    email: 'gerente@importdata.com',
    perfil: 'Gerente',
  },
  {
    id: 'usr_operador_003',
    nome: 'Operador de Importação',
    email: 'operador@importdata.com',
    perfil: 'Operador',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios' }, { status: 400 });
    }

    const emailTrim = email.trim().toLowerCase();

    // 1. Verificação dos usuários de demonstração
    const demo = DEMO_USERS.find(u => u.email.toLowerCase() === emailTrim);
    if (demo && (senha === 'Password@123' || senha === 'admin')) {
      const response = NextResponse.json({ success: true, user: demo });
      response.cookies.set('user_session', JSON.stringify(demo), {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24, // 1 dia
      });
      return response;
    }

    // 2. Verificação no banco de dados
    const user = await usuariosRepository.findByEmail(emailTrim);
    if (!user || user.senha !== senha) {
      return NextResponse.json({ error: 'E-mail ou senha inválidos' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user });
    response.cookies.set('user_session', JSON.stringify(user), {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
