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
        imageUrl: 'uploads/periods/images/Star League Logo.png',
        bannerUrl: 'uploads/periods/banners/star-league.jpg',
      },
      {
        name: 'First Succession War',
        code: 'SW1',
        startYear: 2786,
        endYear: 2821,
        sortOrder: 200,
        description: 'A destructive conflict that followed the fall of the Star League, resulting in massive technological regression.',
        imageUrl: 'uploads/periods/images/Succession Wars Logo.png',
        bannerUrl: 'uploads/periods/banners/first-succession-war.jpg',
      },
      {
        name: 'Second Succession War',
        code: 'SW2',
        startYear: 2830,
        endYear: 2864,
        sortOrder: 300,
        description: 'The continuation of the Great Houses\' struggle for dominance, further depleting technological capabilities.',
        imageUrl: 'uploads/periods/images/Succession Wars Logo.png',
        bannerUrl: 'uploads/periods/banners/second-succession-war.jpg',
      },
      {
        name: 'Third Succession War',
        code: 'SW3',
        startYear: 2866,
        endYear: 3025,
        sortOrder: 400,
        description: 'The longest of the Succession Wars, characterized by limited warfare and technological stagnation.',
        imageUrl: 'uploads/periods/images/Succession Wars Logo.png',
        bannerUrl: 'uploads/periods/banners/third-succession-war.jpg',
      },
      {
        name: 'Fourth Succession War',
        code: 'SW4',
        startYear: 3028,
        endYear: 3030,
        sortOrder: 500,
        description: 'A brief but intense conflict that resulted in major territorial changes, particularly for House Davion and House Steiner.',
        imageUrl: 'uploads/periods/images/Succession Wars Logo.png',
        bannerUrl: 'uploads/periods/banners/fourth-succession-war.jpg',
      },
      {
        name: 'Clan Invasion',
        code: 'CI',
        startYear: 3050,
        endYear: 3060,
        sortOrder: 600,
        description: 'The period when the Clans returned to the Inner Sphere and conquered many worlds with their superior technology.',
        imageUrl: 'uploads/periods/images/Clan Invasion Logo.png',
        bannerUrl: 'uploads/periods/banners/clan-invasion.jpg',
      },
      {
        name: 'FedCom Civil War',
        code: 'FCCW',
        startYear: 3062,
        endYear: 3067,
        sortOrder: 700,
        description: 'A devastating conflict between the Lyran and Federated Suns halves of the Federated Commonwealth.',
        imageUrl: 'uploads/periods/images/Civil War Logo.png',
        bannerUrl: 'uploads/periods/banners/fedcom-civil-war.jpg',
      },
      {
        name: 'Jihad',
        code: 'JH',
        startYear: 3067,
        endYear: 3081,
        sortOrder: 800,
        description: 'A massive conflict initiated by the Word of Blake against all major powers of the Inner Sphere.',
        imageUrl: 'uploads/periods/images/Jihad Era Logo.png',
        bannerUrl: 'uploads/periods/banners/jihad.jpg',
      },
            {
        name: 'Early Republic',
        code: 'ER',
        startYear: 3081,
        endYear: 3100,
        sortOrder: 900,
        description: 'Stone’s Republic leads the way into peace and prosperity in the aftermath of the Jihad. Conflicts still occur, but they are small in scale and the massive wars of the past are not seen.',
        imageUrl: 'uploads/periods/images/Dark Age Logo.png',
        bannerUrl: 'uploads/periods/banners/dark-age.jpg',
      },
            {
        name: 'Late Republic',
        code: 'LR',
        startYear: 3101,
        endYear: 3130,
        sortOrder: 1000,
        description: 'The tides of war rise higher. Sun-Tzu Liao and his son, Daoshen, embark on a campaign of coordinated violence to reclaim their former worlds seized by the Republic. Other conflicts begin to boil over with pockets of fighting in all corners of the Inner Sphere and Periphery. The Second Combine-Dominion War was only the first of many conflicts during this period--the Victoria War, territorial strife between former members of the Free Worlds League, rebellion in the Marian Hegemony, and the ever-present threat of the Clans expanding their occupation zones all conspired to leave Stone\'s carefully crafted era of peace rent and sundered.',
        imageUrl: 'uploads/periods/images/Dark Age Logo.png',
        bannerUrl: 'uploads/periods/banners/dark-age.jpg',
      },
      {
        name: 'Dark Age',
        code: 'DA',
        startYear: 3131,
        endYear: 3150,
        sortOrder: 1100,
        description: 'A period of technological regression and conflict following the Jihad.',
        imageUrl: 'uploads/periods/images/Dark Age Logo.png',
        bannerUrl: 'uploads/periods/banners/dark-age.jpg',
      },
      {
        name: 'ilClan Era',
        code: 'ICE',
        startYear: 3151,
        endYear: null,  // Продолжается в текущее время
        sortOrder: 1200,
        description: 'The current era where Clan Wolf has conquered Terra and claimed the mantle of ilClan.',
        imageUrl: 'uploads/periods/images/IlClan Logo.png',
        bannerUrl: 'uploads/periods/banners/ilclan-era.jpg',
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