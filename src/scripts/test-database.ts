import 'dotenv/config';
import { prisma } from "../lib/prisma.js";

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    const result = await prisma.$queryRaw<
    {database: string; version: string}[]
    >`
    SELECT 
      current_database() AS database,
      version() AS version
    `;
    console.log('PostgreSQL connected successfully!');
    console.log('Database:', result[0]?.database);
    console.log('Version:', result[0]?.version);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();