const prisma = require('./src/prisma');

async function main() {
  const contests = await prisma.contest.findMany({
    include: {
      contestProblems: {
        include: {
          problem: true
        }
      }
    }
  });
  console.log("TOTAL CONTESTS IN DB:", contests.length);
  console.log("CONTESTS:");
  contests.forEach(c => {
    console.log(`- ID: ${c.id}, Title: "${c.title}", Category: "${c.category}"`);
    c.contestProblems.forEach(cp => {
      console.log(`  -> Linked Problem ID: ${cp.problem.id}, Title: "${cp.problem.title}"`);
    });
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
