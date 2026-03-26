const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const imports = await prisma.importacao.findMany();
  for (const imp of imports) {
    console.log(`ID: ${imp.id} | File: ${imp.nome_arquivo} | Path: ${imp.file_path}`);
    if (imp.file_path) {
      const exists = fs.existsSync(imp.file_path);
      console.log(`  -> Exists on disk? ${exists}`);
    } else {
      console.log(`  -> Path is NULL`);
    }
  }
}
main().finally(() => prisma.$disconnect());
