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
        name: 'BattleTech',
        description: 'Классическая тактическая игра о гигантских боевых роботах в далеком будущем. Игроки управляют мехами в пошаговых тактических сражениях.',
        category: GameCategory.TACTICAL,
        iconUrl: 'games/icons/battletech.png',
        bannerUrl: 'games/banners/battletech.jpg',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Alpha Strike',
        description: 'Упрощенная версия BattleTech с более быстрыми и динамичными боями. Идеально подходит для больших сражений и турниров.',
        category: GameCategory.TACTICAL,
        iconUrl: 'games/icons/alpha-strike.png',
        bannerUrl: 'games/banners/alpha-strike.jpg',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Warhammer 40,000',
        description: 'Научно-фантастическая настольная игра о войне в далеком будущем. Игроки собирают армии миниатюр и сражаются на поле боя.',
        category: GameCategory.MINIATURES,
        iconUrl: 'games/icons/warhammer-40k.png',
        bannerUrl: 'games/banners/warhammer-40k.jpg',
        isActive: true,
        sortOrder: 3,
      },
      {
        name: 'Dungeons & Dragons',
        description: 'Культовая ролевая игра, где игроки создают персонажей и отправляются в эпические приключения под руководством Мастера Подземелий.',
        category: GameCategory.RPG,
        iconUrl: 'games/icons/dnd.png',
        bannerUrl: 'games/banners/dnd.jpg',
        isActive: true,
        sortOrder: 4,
      },
      {
        name: 'Risk',
        description: 'Классическая стратегическая игра о завоевании мира. Игроки размещают армии и сражаются за контроль над территориями.',
        category: GameCategory.STRATEGIC,
        iconUrl: 'games/icons/risk.png',
        bannerUrl: 'games/banners/risk.jpg',
        isActive: true,
        sortOrder: 5,
      },
      {
        name: 'Chess',
        description: 'Древняя стратегическая игра для двух игроков. Цель - поставить мат королю противника.',
        category: GameCategory.BOARD_GAME,
        iconUrl: 'games/icons/chess.png',
        bannerUrl: 'games/banners/chess.jpg',
        isActive: true,
        sortOrder: 6,
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