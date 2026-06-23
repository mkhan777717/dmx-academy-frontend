const prisma = require('./src/prisma');

async function main() {
  const prob = await prisma.problem.findFirst({
    where: { id: 16 }
  });
  console.log("PROBLEM 16 DETAILS:");
  console.log(JSON.stringify(prob, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
