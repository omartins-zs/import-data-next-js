import { Worker } from 'bullmq';
import { redisConnection } from '../lib/queue';
import { processImport } from '../modules/importacao/importacao.processor';
import { logger } from '../lib/logger';

const importWorker = new Worker(
  'import-queue',
  async (job) => {
    logger.info(`Processando job ${job.id} de importação...`);
    await processImport(job);
    logger.info(`Job ${job.id} finalizado`);
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

importWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} falhou: ${err.message}`);
});

logger.info('🚀 O Worker está online e aguardando novos trabalhos...');
