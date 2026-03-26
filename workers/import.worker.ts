import { Worker } from 'bullmq';
import { redisConnection } from '../lib/queue';
import { processImport } from '../modules/importacao/importacao.processor';
import { logger } from '../lib/logger';

const importWorker = new Worker(
  process.env.IMPORT_QUEUE_NAME || 'import-queue',
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

const HEARTBEAT_KEY = 'worker:import:heartbeat';

// Loop de Heartbeat para o Dashboard saber que o Worker está vivo
const heartbeatInterval = setInterval(async () => {
  try {
    await redisConnection.set(HEARTBEAT_KEY, 'online', 'EX', 15);
  } catch (err) {
    logger.error('Erro ao registrar heartbeat do worker');
  }
}, 5000);

logger.info('🚀 O Worker está online e aguardando novos trabalhos...');

// Limpar ao encerrar
const cleanup = async () => {
  clearInterval(heartbeatInterval);
  await redisConnection.del(HEARTBEAT_KEY);
  await importWorker.close();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
