const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const imports = await prisma.importacao.findMany({
    orderBy: { criado_em: 'desc' },
    take: 5
  });
  console.log(JSON.stringify(imports, null, 2));
}
main();
