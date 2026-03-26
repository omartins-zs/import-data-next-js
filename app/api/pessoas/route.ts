import { NextRequest, NextResponse } from "next/server";
import { personasRepository } from '@/modules/pessoas/pessoas.repository';
import { z } from 'zod';

const pessoaSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido, deve conter 11 dígitos'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional().or(z.literal('')),
  data_nascimento: z.string().optional().or(z.literal('')),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = Number(searchParams.get('skip')) || 0;
    const take = Number(searchParams.get('take')) || 50;
    const search = searchParams.get('search') || '';

    const where = search
      ? {
          OR: [
            { nome: { contains: search, mode: 'insensitive' as const } },
            { cpf: { contains: search } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [pessoas, total] = await Promise.all([
      personasRepository.findAll({ skip, take, where, orderBy: { criado_em: 'desc' } }),
      personasRepository.count(where),
    ]);

    return NextResponse.json({ data: pessoas, total, skip, take });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = pessoaSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ errors: validated.error.flatten().fieldErrors }, { status: 400 });
    }

    const existing = await personasRepository.findByCpf(validated.data.cpf);
    if (existing) {
      return NextResponse.json({ error: 'CPF já cadastrado' }, { status: 400 });
    }

    const data = {
      ...validated.data,
      data_nascimento: validated.data.data_nascimento ? new Date(validated.data.data_nascimento) : null,
    };

    const pessoa = await personasRepository.create(data);
    return NextResponse.json(pessoa, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
