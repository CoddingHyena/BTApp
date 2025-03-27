// import { PrismaClient } from '@prisma/client';
// import { seedPeriods } from './seeds/period.seeds';
// // import { seedFactions } from './seeds/faction.seed';

// const prisma = new PrismaClient();

// async function main() {
//   // Запускаем seed-скрипты последовательно
//   await seedPeriods(prisma);
// //   await seedFactions(prisma);
  
//   console.log('Seeding completed');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaClient } from '@prisma/client';
import { seedPeriods } from './seeds/period.seeds';
import { seedFactions } from './seeds/faction.seeds';

const prisma = new PrismaClient();

async function main() {
  try {
    // Последовательно запускаем seed-скрипты
    await seedPeriods(prisma);
    console.log('Periods seeding completed');
    
    await seedFactions(prisma);
    console.log('Factions seeding completed');
    
    console.log('All seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

// Запускаем функцию main
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Закрываем соединение с БД по завершении
    await prisma.$disconnect();
  });