const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
console.log('DATABASE_URL exists:', !!connectionString);
console.log('DATABASE_URL length:', connectionString ? connectionString.length : 0);

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    const count = await prisma.job.count();
    console.log(`✅ Found ${count} jobs in database`);
    
    await prisma.$disconnect();
    console.log('✅ Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

test();
