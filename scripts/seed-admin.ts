import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const [email, password, nameParam] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Usage: npm run seed:admin -- <email> <password> [name]');
    process.exit(1);
  }

  const name = nameParam ?? 'Admin User';

  const passwordHash = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name,
        passwordHash,
        role: 'ADMIN',
        updatedAt: new Date(),
      },
    });

    console.log(`Updated existing user ${email} to ADMIN.`);
  } else {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'ADMIN',
        phone: null,
      },
    });

    console.log(`Created new ADMIN user ${email}.`);
  }
}

main()
  .catch((err) => {
    console.error('Failed to seed admin user:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
