const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

prisma.checkDbConnection = async () => {
  const rawUrl = process.env.DATABASE_URL || '';
  let target = 'unknown';

  try {
    const parsed = new URL(rawUrl);
    target = `${parsed.hostname}:${parsed.port || '5432'}${parsed.pathname}`;
  } catch (_) {
    target = rawUrl.replace(/:\/\/.*@/, '://***:***@');
  }

  console.log(`[Database] Verifying connection to: ${target}...`);

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`[Database] Connected successfully to PostgreSQL database!`);
    return { success: true };
  } catch (error) {
    console.error(`[Database] Connection failed:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = prisma;

