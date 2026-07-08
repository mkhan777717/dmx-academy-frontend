const fs = require('fs');
const path = require('path');

// Manually parse backend/.env
const envPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, 'utf8');
  for (const line of envText.split('\n')) {
    const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
    if (match) {
      let key = match[1].trim();
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  }
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.problem.findUnique({
    where: { id: 45 },
    include: { testCases: true }
  });
  console.log(JSON.stringify(p, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
