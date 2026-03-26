import { NextRequest, NextResponse } from 'next/server';
import { importacaoService } from '@/modules/importacao/importacao.service';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const errors = await importacaoService.getErrors(id);
    return NextResponse.json(errors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
