const prisma = require('./src/prisma');

async function main() {
  const prob = await prisma.problem.findUnique({
    where: { id: 20 }
  });
  console.log("PROBLEM 20:", JSON.stringify(prob, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
