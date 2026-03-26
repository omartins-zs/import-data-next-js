import { prisma } from '@/lib/prisma';
import { importQueue } from '@/lib/queue';
import { ImportStatus } from '@prisma/client';
import { logger } from '@/lib/logger';

export class ImportacaoService {
  async listAll() {
    return prisma.importacao.findMany({
      orderBy: { criado_em: 'desc' },
      include: {
        _count: {
          select: { erros_list: true },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.importacao.findUnique({
      where: { id },
      include: {
        erros_list: true,
        logs: {
          orderBy: { criado_em: 'desc' },
        },
      },
    });
  }

  async create(nomeArquivo: string, totalRegistros: number) {
    const importacao = await prisma.importacao.create({
      data: {
        nome_arquivo: nomeArquivo,
        total_registros: totalRegistros,
        status: 'PENDENTE',
      },
    });

    await this.addLog(importacao.id, `Importação criada para o arquivo ${nomeArquivo}`, 'INFO');
    return importacao;
  }

  async startProcessing(id: string, filePath: string) {
    await prisma.importacao.update({
      where: { id },
      data: { status: 'PROCESSANDO' },
    });

    await importQueue.add('process-import', {
      importId: id,
      filePath,
    });

    await this.addLog(id, 'Enviado para a fila de processamento', 'INFO');
  }

  async addLog(importId: string, mensagem: string, nivel: 'INFO' | 'WARNING' | 'ERROR') {
    return prisma.logImportacao.create({
      data: {
        importacao_id: importId,
        mensagem,
        nivel,
      },
    });
  }

  async addErro(importId: string, linha: number, dados: any, mensagem: string, campo?: string) {
    return prisma.erroImportacao.create({
      data: {
        importacao_id: importId,
        linha,
        dados,
        mensagem,
        campo,
      },
    });
  }

  async updateProgress(id: string, processados: number, erros: number) {
    return prisma.importacao.update({
      where: { id },
      data: {
        processados,
        erros,
      },
    });
  }

  async finish(id: string, status: ImportStatus) {
    await prisma.importacao.update({
      where: { id },
      data: { status },
    });
    await this.addLog(id, `Processamento finalizado com status: ${status}`, 'INFO');
  }

  async getErrors(id: string) {
    return prisma.erroImportacao.findMany({
      where: { importacao_id: id },
      orderBy: { linha: 'asc' },
    });
  }
}

export const importacaoService = new ImportacaoService();
