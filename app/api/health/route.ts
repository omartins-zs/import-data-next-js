import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Redis from 'ioredis';

export async function GET() {
  const status = {
    database: 'OFFLINE',
    redis: 'OFFLINE',
    worker: 'OFFLINE',
    api: 'ONLINE'
  };

  try {
    // Check Database
    await prisma.$queryRaw`SELECT 1`;
    status.database = 'ONLINE';
  } catch (e) {
    status.database = 'OFFLINE';
  }

  try {
    // Check Redis
    const redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      connectTimeout: 2000,
    });
    const pong = await redis.ping();
    if (pong === 'PONG') {
      status.redis = 'ONLINE';
    }
    
    // Check Worker via Heartbeat Key (set by the worker itself every 5s)
    const heartbeat = await redis.get('worker:import:heartbeat');
    status.worker = heartbeat === 'online' ? 'ONLINE' : 'OFFLINE';

    redis.disconnect();
  } catch (e) {
    status.redis = 'OFFLINE';
    status.worker = 'OFFLINE';
  }

  return NextResponse.json(status);
}
