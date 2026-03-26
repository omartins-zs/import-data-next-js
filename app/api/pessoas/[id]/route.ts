import { NextRequest, NextResponse } from 'next/server';
import { personasRepository } from '@/modules/pessoas/pessoas.repository';
import { z } from 'zod';

const pessoaSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido, deve conter 11 dígitos'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional().or(z.literal('')),
  data_nascimento: z.string().optional().or(z.literal('')),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const pessoa = await personasRepository.findById(id);
    if (!pessoa) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(pessoa);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validated = pessoaSchema.partial().safeParse(body);
    if (!validated.success) return NextResponse.json({ errors: validated.error.flatten().fieldErrors }, { status: 400 });

    const data = {
      ...validated.data,
      data_nascimento: validated.data.data_nascimento ? new Date(validated.data.data_nascimento) : null,
    };

    const pessoa = await personasRepository.update(id, data);
    return NextResponse.json(pessoa);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await personasRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
