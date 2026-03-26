import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import csv from 'fast-csv';
import ExcelJS from 'exceljs';

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

    const preview: any[] = [];
    const limit = 10;
    
    if (file.name.endsWith('.csv')) {
      await new Promise((resolve, reject) => {
        let count = 0;
        fs.createReadStream(filePath)
          .pipe(csv.parse({ headers: true, maxRows: limit }))
          .on('data', (row) => preview.push(row))
          .on('error', (err) => reject(err))
          .on('end', () => resolve(true));
      });
    } else if (file.name.endsWith('.xlsx')) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.worksheets[0];
      const headers: string[] = [];
      worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers[colNumber] = cell.value?.toString() || '';
      });
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        if (rowNumber > limit + 1) return;
        const record: any = {};
        row.eachCell((cell, colNumber) => {
          if (headers[colNumber]) record[headers[colNumber]] = cell.value;
        });
        preview.push(record);
      });
    }

    // Clean up temporary preview file
    fs.unlinkSync(filePath);

    return NextResponse.json({ 
      nome_arquivo: file.name,
      rows: preview,
      total_rows_estimate: preview.length > 0 ? preview.length : 0 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
