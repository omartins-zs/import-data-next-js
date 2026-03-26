import { Job } from 'bullmq';
import { importacaoService } from './importacao.service';
import { personasRepository } from '../pessoas/pessoas.repository';
import { logger } from '@/lib/logger';
import path from 'path';
import fs from 'fs';
import * as csv from 'fast-csv';
import ExcelJS from 'exceljs';
import { z } from 'zod';

const pessoaSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido, deve conter 11 dígitos'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional().or(z.literal('')),
  data_nascimento: z.string().optional().or(z.literal('')),
});

export const processImport = async (job: Job) => {
  const { importId, filePath } = job.data;
  const scopedLogger = logger.child({ importId });

  try {
    scopedLogger.info(`Iniciando processamento da importação ${importId}`);
    await importacaoService.addLog(importId, `Iniciando mapeamento do arquivo ${path.basename(filePath)}`, 'INFO');
    
    const records: any[] = [];
    
    try {
      if (filePath.endsWith('.csv')) {
        await new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true, delimiter: ',', ignoreEmpty: true }))
            .on('data', (row) => records.push(row))
            .on('error', (err) => reject(err))
            .on('end', () => resolve(records));
        });
      } else if (filePath.endsWith('.xlsx')) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];
        const headers: string[] = [];
        worksheet.getRow(1).eachCell((cell, colNumber) => {
          headers[colNumber] = cell.value?.toString() || '';
        });
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return;
          const record: any = {};
          row.eachCell((cell, colNumber) => {
            if (headers[colNumber]) record[headers[colNumber]] = cell.value;
          });
          records.push(record);
        });
      }
    } catch (parseError: any) {
      await importacaoService.addLog(importId, `Falha crítica na leitura do arquivo: Formato incorreto ou corrompido.`, 'ERROR');
      throw parseError;
    }

    if (records.length === 0) {
      await importacaoService.addLog(importId, `Alerta: Arquivo sem registros ou cabeçalho incorreto (Linhas faltando).`, 'WARNING');
    } else {
      await importacaoService.addLog(importId, `Mapeamento concluído: ${records.length} registros identificados.`, 'INFO');
    }

    let processados = 0;
    let erros = 0;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const linha = i + 1;

      try {
        const validated = pessoaSchema.safeParse(record);
        if (!validated.success) {
          const firstIssue = validated.error.issues[0];
          await importacaoService.addErro(
            importId,
            linha,
            record,
            firstIssue.message,
            firstIssue.path[0] as string
          );
          erros++;
          continue;
        }

        const data = validated.data;
        const processedData = {
          ...data,
          data_nascimento: data.data_nascimento ? new Date(data.data_nascimento) : null,
          status: 'ATIVO' as const,
        };

        await personasRepository.upsert(processedData.cpf, {
          nome: processedData.nome,
          email: processedData.email,
          telefone: processedData.telefone,
          data_nascimento: processedData.data_nascimento,
        });

        processados++;
      } catch (error: any) {
        await importacaoService.addErro(importId, linha, record, error.message || 'Erro inesperado no banco');
        erros++;
      } finally {
        if (linha % 10 === 0 || linha === records.length) {
          await importacaoService.updateProgress(importId, processados, erros);
        }
      }
    }

    let finalStatus: 'SUCESSO' | 'SUCESSO_PARCIAL' | 'FALHA' | 'ERRO' = 'SUCESSO';
    if (records.length === 0) {
      finalStatus = 'FALHA';
      await importacaoService.addLog(importId, `Processamento abortado: Nenhuma linha válida encontrada no arquivo.`, 'ERROR');
    } else if (erros > 0) {
      if (processados === 0) {
        finalStatus = 'FALHA';
        await importacaoService.addLog(importId, `Processamento concluído com Falha Total (100% de erros).`, 'WARNING');
      } else {
        finalStatus = 'SUCESSO_PARCIAL';
        await importacaoService.addLog(importId, `Processamento concluído com Divergências (${erros} erros detectados).`, 'WARNING');
      }
    } else {
      await importacaoService.addLog(importId, `Processamento concluído com 100% de sucesso.`, 'INFO');
    }

    await importacaoService.finish(importId, finalStatus);
    scopedLogger.info(`Finalizado processamento da importação ${importId}`);
  } catch (error: any) {
    scopedLogger.error(`Erro crítico no processamento: ${error.message}`);
    await importacaoService.finish(importId, 'ERRO');
    await importacaoService.addLog(importId, `Erro do Motor: ${error.message}`, 'ERROR');
  }
};
