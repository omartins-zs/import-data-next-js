const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), 'uploads');

async function main() {
  if (!fs.existsSync(uploadDir)) {
    console.log('Upload directory not found.');
    return;
  }

  const files = fs.readdirSync(uploadDir);
  console.log('Files in uploads:', files);

  const imports = await prisma.importacao.findMany();

  for (const imp of imports) {
    // Procura o arquivo real no disco que termine com "-nome_arquivo"
    const realFile = files.find(f => f.endsWith(`-${imp.nome_arquivo}`));
    
    if (realFile) {
      const fullPath = path.join(uploadDir, realFile);
      // O path no DB deve ser relativo ao diretório do projeto ou absoluto conforme esperado pelov processor
      // No processor, usamos o path diretamente
      await prisma.importacao.update({
        where: { id: imp.id },
        data: { file_path: fullPath }
      });
      console.log(`Matched! Record ${imp.id} (${imp.nome_arquivo}) -> ${fullPath}`);
    } else {
      console.log(`No file found for Record ${imp.id} (${imp.nome_arquivo})`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
