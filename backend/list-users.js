const prisma = require('./src/prisma');

async function main() {
  const users = await prisma.user.findMany();
  console.log("TOTAL USERS IN DB:", users.length);
  console.log("USERS:");
  users.forEach(u => {
    console.log(`- ID: ${u.id}, Username: "${u.username}", Email: "${u.email}", Role: ${u.role}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
