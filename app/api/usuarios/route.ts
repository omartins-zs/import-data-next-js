import { NextRequest, NextResponse } from 'next/server';
import { usuariosRepository } from '@/modules/usuarios/usuarios.repository';

export async function GET() {
  try {
    const users = await usuariosRepository.findAll();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.nome || !body.email || !body.senha) {
      return NextResponse.json({ error: 'Nome, e-mail e senha são obrigatórios' }, { status: 400 });
    }

    const existing = await usuariosRepository.findByEmail(body.email);
    if (existing) {
      return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 });
    }

    const user = await usuariosRepository.create(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
