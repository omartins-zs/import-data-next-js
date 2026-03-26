import { logger } from './logger';
import { prisma } from './prisma';

export const checkIdempotency = async (key: string) => {
  const existing = await prisma.importacao.findUnique({
    where: { id: key },
  });

  if (existing && (existing.status === 'CONCLUIDO' || existing.status === 'PROCESSANDO')) {
    logger.warn(`Importação com ID ${key} já existe com status ${existing.status}.`);
    return true;
  }
  return false;
};
