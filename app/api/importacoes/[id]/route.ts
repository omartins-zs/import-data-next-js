import { NextRequest, NextResponse } from 'next/server';
import { importacaoService } from '@/modules/importacao/importacao.service';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const importacao = await importacaoService.findById(id);
    if (!importacao) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(importacao);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
