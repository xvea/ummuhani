import { hashPassword } from '../src/utils/password.js';
import { prisma } from '../src/config/prisma.js';

const adminLogin = process.env.SEED_ADMIN_LOGIN;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const adminName = process.env.SEED_ADMIN_NAME || 'Administrator';
const seedPoli = process.env.SEED_SAMPLE_POLI !== 'false';

try {
  if (seedPoli) {
    const samplePoli = [
      { kode_poli: 'UMUM', poli: 'Poli Umum', deskripsi: 'Poliklinik umum', aktifonline: 1 },
      { kode_poli: 'ANAK', poli: 'Poli Anak', deskripsi: 'Poliklinik anak', aktifonline: 1 },
      { kode_poli: 'GIGI', poli: 'Poli Gigi', deskripsi: 'Poliklinik gigi', aktifonline: 0 }
    ];
    for (const poli of samplePoli) {
      await prisma.poli.upsert({ where: { kode_poli: poli.kode_poli }, update: {}, create: poli });
    }
    console.log('Sampel poli UMUM, ANAK, GIGI sudah dipastikan tersedia.');
  }

  if (adminLogin && adminPassword && adminPassword.length >= 8 && adminPassword !== 'change-me-before-running-seed') {
    const password = await hashPassword(adminPassword);
    await prisma.user.upsert({
      where: { login: adminLogin },
      update: { password, namalengkap: adminName, grupuser: 'admin', poli: null, token: null },
      create: { login: adminLogin, password, namalengkap: adminName, grupuser: 'admin', poli: null, token: null }
    });
    console.log(`Akun admin seed ${adminLogin} siap digunakan.`);
  } else {
    console.log('Akun admin tidak dibuat: isi SEED_ADMIN_LOGIN dan SEED_ADMIN_PASSWORD yang aman, atau jalankan pnpm admin:create.');
  }
} finally {
  await prisma.$disconnect();
}
