import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPeriods(prismaClient: PrismaClient) {
  // Используем переданный экземпляр PrismaClient
  const client = prismaClient || prisma;
  
  try {
    // Очистка таблицы перед заполнением (опционально)
    await client.period.deleteMany({});

    // Массив данных периодов BattleTech
    const periods = [
      {
        name: 'Star League',
        code: 'SL',
        startYear: 2571,
        endYear: 2781,
        sortOrder: 100,
        description: 'The Star League was the zenith of technological and cultural achievement in human history.',
        imageUrl: 'periods/star-league.jpg',
        bannerUrl: 'periods/banners/star-league.jpg',
        isActive: true,
      },
      {
        name: 'First Succession War',
        code: 'SW1',
        startYear: 2786,
        endYear: 2821,
        sortOrder: 200,
        description: 'A destructive conflict that followed the fall of the Star League, resulting in massive technological regression.',
        imageUrl: 'periods/first-succession-war.jpg',
        bannerUrl: 'periods/banners/first-succession-war.jpg',
        isActive: true,
      },
      {
        name: 'Second Succession War',
        code: 'SW2',
        startYear: 2830,
        endYear: 2864,
        sortOrder: 300,
        description: 'The continuation of the Great Houses\' struggle for dominance, further depleting technological capabilities.',
        imageUrl: 'periods/second-succession-war.jpg',
        bannerUrl: 'periods/banners/second-succession-war.jpg',
        isActive: true,
      },
      {
        name: 'Third Succession War',
        code: 'SW3',
        startYear: 2866,
        endYear: 3025,
        sortOrder: 400,
        description: 'The longest of the Succession Wars, characterized by limited warfare and technological stagnation.',
        imageUrl: 'periods/third-succession-war.jpg',
        bannerUrl: 'periods/banners/third-succession-war.jpg',
        isActive: true,
      },
      {
        name: 'Fourth Succession War',
        code: 'SW4',
        startYear: 3028,
        endYear: 3030,
        sortOrder: 500,
        description: 'A brief but intense conflict that resulted in major territorial changes, particularly for House Davion and House Steiner.',
        imageUrl: 'periods/fourth-succession-war.jpg',
        bannerUrl: 'periods/banners/fourth-succession-war.jpg',
        isActive: true,
      },
      {
        name: 'Clan Invasion',
        code: 'CI',
        startYear: 3050,
        endYear: 3060,
        sortOrder: 600,
        description: 'The period when the Clans returned to the Inner Sphere and conquered many worlds with their superior technology.',
        imageUrl: 'periods/clan-invasion.jpg',
        bannerUrl: 'periods/banners/clan-invasion.jpg',
        isActive: true,
      },
      {
        name: 'FedCom Civil War',
        code: 'FCCW',
        startYear: 3062,
        endYear: 3067,
        sortOrder: 700,
        description: 'A devastating conflict between the Lyran and Federated Suns halves of the Federated Commonwealth.',
        imageUrl: 'periods/fedcom-civil-war.jpg',
        bannerUrl: 'periods/banners/fedcom-civil-war.jpg',
        isActive: true,
      },
      {
        name: 'Jihad',
        code: 'JH',
        startYear: 3067,
        endYear: 3081,
        sortOrder: 800,
        description: 'A massive conflict initiated by the Word of Blake against all major powers of the Inner Sphere.',
        imageUrl: 'periods/jihad.jpg',
        bannerUrl: 'periods/banners/jihad.jpg',
        isActive: true,
      },
      {
        name: 'Dark Age',
        code: 'DA',
        startYear: 3081,
        endYear: 3150,
        sortOrder: 900,
        description: 'A period of technological regression and conflict following the Jihad.',
        imageUrl: 'periods/dark-age.jpg',
        bannerUrl: 'periods/banners/dark-age.jpg',
        isActive: true,
      },
      {
        name: 'ilClan Era',
        code: 'ICE',
        startYear: 3151,
        endYear: null,  // Продолжается в текущее время
        sortOrder: 1000,
        description: 'The current era where Clan Wolf has conquered Terra and claimed the mantle of ilClan.',
        imageUrl: 'periods/ilclan-era.jpg',
        bannerUrl: 'periods/banners/ilclan-era.jpg',
        isActive: true,
      },
    ];

    // Создание записей в базе данных
    for (const period of periods) {
      await client.period.create({
        data: period,
      });
    }

    console.log('Periods seeded successfully');
  } catch (error) {
    console.error('Error seeding periods:', error);
    throw error; // Пробрасываем ошибку для обработки в основном скрипте
  }
}

// Если файл запущен напрямую, а не импортирован
if (require.main === module) {
  seedPeriods(prisma)
    .catch((e) => {
      console.error('Error during seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}