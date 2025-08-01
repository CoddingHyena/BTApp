import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedFactions(prismaClient: PrismaClient) {
  // Используем переданный экземпляр PrismaClient
  const client = prismaClient || prisma;
  
  try {
    // Очистка таблицы перед заполнением (опционально)
    await client.faction.deleteMany({});

    // Получаем ID игр для связывания
    const battletechGame = await client.game.findUnique({
      where: { name: 'BattleTech' }
    });
    
    const alphaStrikeGame = await client.game.findUnique({
      where: { name: 'Alpha Strike' }
    });

    if (!battletechGame || !alphaStrikeGame) {
      throw new Error('Games not found. Please run game seeding first.');
    }

    // Массив данных фракций BattleTech
    const factions = [
      {
        name: 'Federated Suns',
        code: 'FS',
        primaryColor: '#FFD700', // Золотой
        secondaryColor: '#8B0000', // Темно-красный
        formationYear: 2317,
        dissolutionYear: null,
        description: 'The Federated Suns is one of the major Successor States of the Inner Sphere, located in the "eastern" quadrant of human-inhabited space. Known for their strong military tradition and principles of personal freedom.',
        logoUrl: 'factions/logos/federated-suns.png',
        bannerUrl: 'factions/banners/federated-suns.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Draconis Combine',
        code: 'DC',
        primaryColor: '#FF0000', // Красный
        secondaryColor: '#000000', // Черный
        formationYear: 2319,
        dissolutionYear: null,
        description: 'The Draconis Combine is one of the major Successor States of the Inner Sphere, ruled by House Kurita. Its society is based on a feudal Japanese model, emphasizing loyalty, honor, and duty.',
        logoUrl: 'factions/logos/draconis-combine.png',
        bannerUrl: 'factions/banners/draconis-combine.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Capellan Confederation',
        code: 'CC',
        primaryColor: '#007700', // Зеленый
        secondaryColor: '#000000', // Черный
        formationYear: 2367,
        dissolutionYear: null,
        description: 'The Capellan Confederation is one of the major Successor States of the Inner Sphere, ruled by House Liao. It is known for its authoritarian government, emphasis on the collective good, and highly trained elite forces.',
        logoUrl: 'factions/logos/capellan-confederation.png',
        bannerUrl: 'factions/banners/capellan-confederation.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Free Worlds League',
        code: 'FWL',
        primaryColor: '#800080', // Пурпурный
        secondaryColor: '#FFD700', // Золотой
        formationYear: 2271,
        dissolutionYear: 3078,
        description: 'The Free Worlds League was one of the major Successor States of the Inner Sphere until its dissolution during the Jihad. It was known for its industrial might and democratic traditions, though it suffered from internal political divisions.',
        logoUrl: 'factions/logos/free-worlds-league.png',
        bannerUrl: 'factions/banners/free-worlds-league.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Lyran Commonwealth',
        code: 'LC',
        primaryColor: '#1E90FF', // Синий
        secondaryColor: '#FFFFFF', // Белый
        formationYear: 2341,
        dissolutionYear: 3084,
        description: 'The Lyran Commonwealth was one of the major Successor States of the Inner Sphere, known for its commercial wealth, social mobility, and heavy military units.',
        logoUrl: 'factions/logos/lyran-commonwealth.png',
        bannerUrl: 'factions/banners/lyran-commonwealth.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Lyran Alliance',
        code: 'LA',
        primaryColor: '#1E90FF', // Синий
        secondaryColor: '#C0C0C0', // Серебряный
        formationYear: 3084,
        dissolutionYear: null,
        description: 'The successor state to the Lyran Commonwealth, the Lyran Alliance maintains the commercial powerhouse status of its predecessor while emphasizing a more independent identity.',
        logoUrl: 'factions/logos/lyran-alliance.png',
        bannerUrl: 'factions/banners/lyran-alliance.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'ComStar',
        code: 'CS',
        primaryColor: '#FFFFFF', // Белый
        secondaryColor: '#000000', // Черный
        formationYear: 2785,
        dissolutionYear: null,
        description: 'ComStar is an interstellar organization that maintains the hyperpulse generator (HPG) network, providing communication between star systems. Originally quasi-religious in nature, it later split into secular ComStar and the fanatical Word of Blake.',
        logoUrl: 'factions/logos/comstar.png',
        bannerUrl: 'factions/banners/comstar.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Clan Wolf',
        code: 'CW',
        primaryColor: '#C0C0C0', // Серебряный
        secondaryColor: '#FF0000', // Красный
        formationYear: 2807,
        dissolutionYear: null,
        description: 'One of the original Clans founded by Nicholas Kerensky, Clan Wolf is named after the Timber Wolf (Canis lupus). They are known for their pragmatism and adaptability compared to other Clans.',
        logoUrl: 'factions/logos/clan-wolf.png',
        bannerUrl: 'factions/banners/clan-wolf.jpg',
        gameIdRef: alphaStrikeGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Clan Jade Falcon',
        code: 'CJF',
        primaryColor: '#006400', // Темно-зеленый
        secondaryColor: '#FFD700', // Золотой
        formationYear: 2807,
        dissolutionYear: null,
        description: 'One of the original Clans founded by Nicholas Kerensky, Clan Jade Falcon is known for their strict adherence to Clan ways and their particular rivalry with Clan Wolf.',
        logoUrl: 'factions/logos/clan-jade-falcon.png',
        bannerUrl: 'factions/banners/clan-jade-falcon.jpg',
        gameIdRef: alphaStrikeGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Clan Ghost Bear',
        code: 'CGB',
        primaryColor: '#4682B4', // Стальной синий
        secondaryColor: '#FFFFFF', // Белый
        formationYear: 2807,
        dissolutionYear: null,
        description: 'One of the original Clans founded by Nicholas Kerensky, Clan Ghost Bear is known for their strength, perseverance, and strong family bonds, unusual among the Clans.',
        logoUrl: 'factions/logos/clan-ghost-bear.png',
        bannerUrl: 'factions/banners/clan-ghost-bear.jpg',
        gameIdRef: alphaStrikeGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: "Wolf's Dragoons",
        code: 'WD',
        primaryColor: '#000000', // Черный
        secondaryColor: '#FF0000', // Красный
        formationYear: 3000,
        dissolutionYear: null,
        description: "Wolf's Dragoons is an elite mercenary unit with secret ties to Clan Wolf, sent to the Inner Sphere as an advance reconnaissance unit before the Clan invasion.",
        logoUrl: 'factions/logos/wolfs-dragoons.png',
        bannerUrl: 'factions/banners/wolfs-dragoons.jpg',
        gameIdRef: battletechGame.id,
        isMajor: false,
        isActive: true,
      },
      {
        name: 'Kell Hounds',
        code: 'KH',
        primaryColor: '#006400', // Темно-зеленый
        secondaryColor: '#C0C0C0', // Серебряный
        formationYear: 3010,
        dissolutionYear: null,
        description: 'The Kell Hounds are an elite mercenary unit founded by Morgan and Patrick Kell with close ties to House Steiner and the Federated Suns.',
        logoUrl: 'factions/logos/kell-hounds.png',
        bannerUrl: 'factions/banners/kell-hounds.jpg',
        gameIdRef: battletechGame.id,
        isMajor: false,
        isActive: true,
      },
      {
        name: 'Word of Blake',
        code: 'WOB',
        primaryColor: '#FFFFFF', // Белый
        secondaryColor: '#800080', // Пурпурный
        formationYear: 3052,
        dissolutionYear: 3081,
        description: 'A radical splinter faction of ComStar, the Word of Blake held to the mystical and religious aspects of ComStar. They were responsible for the Jihad, a massive interstellar conflict.',
        logoUrl: 'factions/logos/word-of-blake.png',
        bannerUrl: 'factions/banners/word-of-blake.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Republic of the Sphere',
        code: 'ROS',
        primaryColor: '#4682B4', // Стальной синий
        secondaryColor: '#FFFFFF', // Белый
        formationYear: 3081,
        dissolutionYear: null,
        description: 'The Republic of the Sphere was established after the Jihad, centered on Terra and nearby worlds. It aimed to be a new power promoting peace and cooperation between the Inner Sphere and the Clans.',
        logoUrl: 'factions/logos/republic-of-the-sphere.png',
        bannerUrl: 'factions/banners/republic-of-the-sphere.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
    ];

    // Создание записей в базе данных
    for (const faction of factions) {
      await client.faction.create({
        data: faction,
      });
    }

    console.log('Factions seeded successfully');
  } catch (error) {
    console.error('Error seeding factions:', error);
    throw error; // Пробрасываем ошибку для обработки в основном скрипте
  }
}

// Если файл запущен напрямую, а не импортирован
if (require.main === module) {
  seedFactions(prisma)
    .catch((e) => {
      console.error('Error during seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}