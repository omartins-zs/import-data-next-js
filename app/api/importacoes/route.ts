import { NextRequest, NextResponse } from "next/server";
import { importacaoService } from '@/modules/importacao/importacao.service';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as csv from 'fast-csv';
import ExcelJS from 'exceljs';

export async function GET() {
  try {
    const importacoes = await importacaoService.listAll();
    return NextResponse.json(importacoes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Get total records
    let totalRegistros = 0;
    if (file.name.endsWith('.csv')) {
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv.parse({ headers: true }))
          .on('data', () => totalRegistros++)
          .on('error', (err) => reject(err))
          .on('end', () => resolve(true));
      });
    } else if (file.name.endsWith('.xlsx')) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.worksheets[0];
      totalRegistros = worksheet.rowCount - 1; // subtract header
    }

    const importacao = await importacaoService.create(file.name, totalRegistros);
    await importacaoService.startProcessing(importacao.id, filePath);

    return NextResponse.json(importacao, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
