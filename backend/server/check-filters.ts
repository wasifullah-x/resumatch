import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkFilters() {
  const locations = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];
  const types = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experiences = ['Entry-level', 'Mid-level', 'Senior'];
  
  console.log('\n📊 Filter Combinations Analysis:\n');
  
  const needsMore: string[] = [];
  
  for (const loc of locations) {
    for (const type of types) {
      for (const exp of experiences) {
        const count = await prisma.job.count({
          where: {
            location: loc,
            type: type,
            experience: exp,
          },
        });
        
        if (count < 2) {
          const combo = `${loc} + ${type} + ${exp}: ${count} jobs`;
          console.log(`❌ ${combo} (NEEDS MORE)`);
          needsMore.push(combo);
        } else {
          console.log(`✅ ${loc} + ${type} + ${exp}: ${count} jobs`);
        }
      }
    }
  }
  
  console.log(`\n\n📈 Summary: ${needsMore.length} combinations need more jobs\n`);
  
  // Check current distribution
  console.log('\n📊 Current Distribution:');
  const byLocation = await prisma.job.groupBy({
    by: ['location'],
    _count: true,
  });
  console.log('\nBy Location:');
  byLocation.forEach(({ location, _count }) => {
    console.log(`  ${location}: ${_count}`);
  });
  
  const byType = await prisma.job.groupBy({
    by: ['type'],
    _count: true,
  });
  console.log('\nBy Type:');
  byType.forEach(({ type, _count }) => {
    console.log(`  ${type}: ${_count}`);
  });
  
  const byExperience = await prisma.job.groupBy({
    by: ['experience'],
    _count: true,
  });
  console.log('\nBy Experience:');
  byExperience.forEach(({ experience, _count }) => {
    console.log(`  ${experience}: ${_count}`);
  });
  
  await prisma.$disconnect();
}

checkFilters();
