const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const jobCount = await prisma.job.count();
  console.log('Total jobs in database:', jobCount);
  
  if (jobCount > 0) {
    const sampleJobs = await prisma.job.findMany({ take: 3 });
    console.log('Sample jobs:', sampleJobs.map(j => ({ id: j.id, title: j.title, employer_id: j.employer_id })));
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
