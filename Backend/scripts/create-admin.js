import { hashPassword } from '../src/utils/password.js';
import { prisma } from '../src/config/prisma.js';

const [login, password, namalengkap] = process.argv.slice(2);
if (!login || !password || !namalengkap) {
  console.error('Usage: pnpm admin:create <login> <password-min-8-karakter> <nama-lengkap>');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password minimal 8 karakter.');
  process.exit(1);
}
try {
  const hash = await hashPassword(password);
  await prisma.user.upsert({
    where: { login },
    update: { password: hash, namalengkap, grupuser: 'admin', poli: null, token: null },
    create: { login, password: hash, namalengkap, grupuser: 'admin', poli: null, token: null }
  });
  console.log(`Admin ${login} siap digunakan.`);
} finally {
  await prisma.$disconnect();
}
