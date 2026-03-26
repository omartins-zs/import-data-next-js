import { Job } from 'bullmq';
import { importacaoService } from './importacao.service';
import { personasRepository } from '../pessoas/pessoas.repository';
import { logger } from '@/lib/logger';
import path from 'path';
import fs from 'fs';
import csv from 'fast-csv';
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
    
    const records: any[] = [];
    
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
        await importacaoService.addErro(importId, linha, record, error.message || 'Erro inesperado');
        erros++;
      } finally {
        if (linha % 10 === 0 || linha === records.length) {
          await importacaoService.updateProgress(importId, processados, erros);
        }
      }
    }

    const finalStatus = erros > 0 ? (processados === 0 ? 'ERRO' : 'CONCLUIDO_COM_ERROS') : 'CONCLUIDO';
    await importacaoService.finish(importId, finalStatus);
    scopedLogger.info(`Finalizado processamento da importação ${importId}`);
  } catch (error: any) {
    scopedLogger.error(`Erro crítico no processamento: ${error.message}`);
    await importacaoService.finish(importId, 'ERRO');
    await importacaoService.addLog(importId, `Erro crítico: ${error.message}`, 'ERROR');
  }
};
