import { NextRequest, NextResponse } from 'next/server';
import { usuariosRepository } from '@/modules/usuarios/usuarios.repository';

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json();

    // Fallback static login
    if (email === 'admin@importdata.com' && senha === 'admin') {
      return NextResponse.json({ success: true, user: { nome: 'Admin Master', email } });
    }

    const user = await usuariosRepository.findByEmail(email);
    if (!user || user.senha !== senha) {
      return NextResponse.json({ error: 'E-mail ou senha inválidos' }, { status: 401 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
