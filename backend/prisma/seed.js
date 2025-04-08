const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('superadminpassword', 10); // Change this password

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' }, // Change to your preferred email
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 1, // Super Admin Role
    },
  });

  console.log('Super Admin seeded:', superAdmin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
