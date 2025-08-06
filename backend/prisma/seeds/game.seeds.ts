import { PrismaClient, GameCategory } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedGames(prismaClient: PrismaClient) {
  // Используем переданный экземпляр PrismaClient
  const client = prismaClient || prisma;
  
  try {
    // Очистка таблицы перед заполнением (опционально)
    await client.game.deleteMany({});

    // Массив данных игр
    const games = [
      {
        name: 'Battletech',
        description: 'Это seed про БТ',
        category: GameCategory.TACTICAL,
        iconUrl: 'uploads/factions/logos/temp.jpg',
        bannerUrl: 'uploads/games/banners/Battletech_logo.png',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Trench Crusade',
        description: 'Это seed про TC',
        category: GameCategory.TACTICAL,
        iconUrl: 'uploads/factions/logos/temp.jpg',
        bannerUrl: 'uploads/games/banners/Trenchcrusade_logo.png',
        isActive: true,
        sortOrder: 2,
      },
    ];

    // Создание записей в базе данных
    for (const game of games) {
      await client.game.create({
        data: game,
      });
    }

    console.log('Games seeded successfully');
  } catch (error) {
    console.error('Error seeding games:', error);
    throw error; // Пробрасываем ошибку для обработки в основном скрипте
  }
}

// Если файл запущен напрямую, а не импортирован
if (require.main === module) {
  seedGames(prisma)
    .catch((e) => {
      console.error('Error during seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} 