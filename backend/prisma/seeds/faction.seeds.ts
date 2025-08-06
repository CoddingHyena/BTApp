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
      where: { name: 'Battletech' }
    });
    
    const trenchCrusadeGame = await client.game.findUnique({
      where: { name: 'Trench Crusade' }
    });

    if (!battletechGame || !trenchCrusadeGame) {
      throw new Error('Games not found. Please run game seeding first.');
    }

    // Массив данных фракций BattleTech
    const factions = [
      {
        name: 'Federated Suns',
        code: 'FS',
        primaryColor: '#FFD700',
        secondaryColor: '#000080',
        formationYear: 2571,
        dissolutionYear: null,
        description: 'Одна из пяти Великих Домов, основанная Домом Дэвион. Известна своей военной традицией и рыцарским кодексом.',
        logoUrl: 'uploads/factions/logos/DavionLogo.png',
        bannerUrl: 'uploads/factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Draconis Combine',
        code: 'DC',
        primaryColor: '#FF0000',
        secondaryColor: '#000000',
        formationYear: 2319,
        dissolutionYear: null,
        description: 'Имперская фракция, управляемая Домом Куриты. Известна своей строгой иерархией и самурайскими традициями.',
        logoUrl: 'uploads/factions/logos/Draconis Combine Logo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Capellan Confederation',
        code: 'CC',
        primaryColor: '#00FF00',
        secondaryColor: '#FFFF00',
        formationYear: 2366,
        dissolutionYear: null,
        description: 'Фракция, управляемая Домом Ляо. Известна своей политической интригой и разведывательными операциями.',
        logoUrl: 'uploads/factions/logos/HouseLiaoLogo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Free Worlds League',
        code: 'FWL',
        primaryColor: '#800080',
        secondaryColor: '#FFFFFF',
        formationYear: 2271,
        dissolutionYear: null,
        description: 'Демократическая конфедерация, управляемая Домом Марик. Известна своей торговой сетью и разнообразием.',
        logoUrl: 'uploads/factions/logos/MaricLogo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Lyran Commonwealth',
        code: 'LC',
        primaryColor: '#0000FF',
        secondaryColor: '#FFFFFF',
        formationYear: 2341,
        dissolutionYear: null,
        description: 'Фракция, управляемая Домом Штайнер. Известна своей экономической мощью и торговыми связями.',
        logoUrl: 'uploads/factions/logos/Lyran Commonwealth Logo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Lyran Alliance',
        code: 'LA',
        primaryColor: '#0000FF',
        secondaryColor: '#FFFFFF',
        formationYear: 3057,
        dissolutionYear: null,
        description: 'Продолжение Lyran Commonwealth после объединения с Federated Commonwealth.',
        logoUrl: 'uploads/factions/logos/Lyran Alliance Logo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'ComStar',
        code: 'CS',
        primaryColor: '#FFFFFF',
        secondaryColor: '#000000',
        formationYear: 2788,
        dissolutionYear: null,
        description: 'Нейтральная организация, контролирующая связь и технологии во Внутренней Сфере.',
        logoUrl: 'uploads/factions/logos/ComStar Logo.jpg',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Clan Wolf',
        code: 'CW',
        primaryColor: '#FFA500',
        secondaryColor: '#000000',
        formationYear: 2807,
        dissolutionYear: null,
        description: 'Один из самых могущественных кланов, известный своей военной традицией и честью.',
        logoUrl: 'uploads/factions/logos/Clan Wolf Logo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Clan Jade Falcon',
        code: 'CJF',
        primaryColor: '#00FF00',
        secondaryColor: '#000000',
        formationYear: 2807,
        dissolutionYear: null,
        description: 'Клан, известный своей агрессивностью и строгим следованием традициям кланов.',
        logoUrl: 'uploads/factions/logos/Clan Jade Falcon Logo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Clan Ghost Bear',
        code: 'CGB',
        primaryColor: '#8B4513',
        secondaryColor: '#FFFFFF',
        formationYear: 2807,
        dissolutionYear: null,
        description: 'Клан, известный своей семейной традицией и защитой своих территорий.',
        logoUrl: 'uploads/factions/logos/GhostBearLogo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Kell Hounds',
        code: 'KH',
        primaryColor: '#FF0000',
        secondaryColor: '#000000',
        formationYear: 3007,
        dissolutionYear: null,
        description: 'Известная наемная команда, основанная Морганом и Патриком Келл.',
        logoUrl: 'uploads/factions/logos/imagesKH.jpg',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Wolf\'s Dragoons',
        code: 'WD',
        primaryColor: '#8B0000',
        secondaryColor: '#000000',
        formationYear: 3005,
        dissolutionYear: null,
        description: 'Легендарная наемная команда, известная своей преданностью и военным мастерством. Основана Джейми Вулфом.',
        logoUrl: 'uploads/factions/logos/Wolf`s Dragoons Logo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Word of Blake',
        code: 'WoB',
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF',
        formationYear: 3052,
        dissolutionYear: null,
        description: 'Радикальная фракция ComStar, известная своей религиозной фанатичностью.',
        logoUrl: 'uploads/factions/logos/Word Of Blake Logo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },
      {
        name: 'Republic of the Sphere',
        code: 'RoS',
        primaryColor: '#FFD700',
        secondaryColor: '#000080',
        formationYear: 3081,
        dissolutionYear: null,
        description: 'Новая фракция, возникшая после событий Jihad.',
        logoUrl: 'uploads/factions/logos/Republic Of The Sphere Logo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },

          {
        name: 'Rasalhague Republic',
        code: 'RR',
        primaryColor: '#0066CC',
        secondaryColor: '#FFFFFF',
        formationYear: 3034,
        dissolutionYear: 3135,
        description: 'Независимое государство, созданное при поддержке ComStar и Lyran Commonwealth. Известно своей скандинавской культурой и борьбой за независимость.',
        logoUrl: 'uploads/factions/logos/Rasalhague Republic Logo.jpg',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: false,
      },
      {
        name: 'Rasalhague Dominion',
        code: 'RD',
        primaryColor: '#0066CC',
        secondaryColor: '#FF0000',
        formationYear: 3135,
        dissolutionYear: null,
        description: 'Государство, образованное в результате объединения остатков Rasalhague Republic и Clan Ghost Bear. Сочетает традиции Скандинавии и клановую культуру.',
        logoUrl: 'uploads/factions/logos/Rasalhague Dominion Logo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },

        {
        name: 'Mercenaries',
        code: 'MERC',
        primaryColor: '#808080',
        secondaryColor: '#FFD700',
        formationYear: 2300, // Условно — наёмники существуют с начала эпохи войн
        dissolutionYear: null,
        description: 'Разношёрстные наёмные отряды, продающие свои услуги домам, корпорациям или кланам.',
        logoUrl: 'uploads/factions/logos/MRBC.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true, 
        isActive: true,
      },
        {
        name: 'Clan Hell\'s Horses',
        code: 'HH',
        primaryColor: '#8B0000', // Тёмно-красный
        secondaryColor: '#FFD700', // Золотой
        formationYear: 2807, // Основан во время Кланового Исхода
        dissolutionYear: null,
        description: 'Агрессивный клан, делающий ставку на комбинированные удары боевых машин и пехоты. Известен тактикой "бронированного кулака" и пренебрежением к традиционным клановым дуэлям.',
        logoUrl: 'uploads/factions/logos/Clan Hells Horses.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: true,
        isActive: true,
      },

            {
        name: 'The Holy Order',
        code: 'HO',
        primaryColor: '#C0C0C0', // Серебряный — символ веры и чистоты
        secondaryColor: '#800000', // Тёмно-красный — кровь мучеников
        formationYear: 1243, // Условная дата основания ордена
        dissolutionYear: null,
        description: 'Воинственный орден, объединяющий фанатиков-крестоносцев. Их догмы требуют искоренения ереси огнём и мечом. Используют древние реликвии и тяжёлые доспехи.',
        logoUrl: 'uploads/factions/logos/temp.jpg',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: trenchCrusadeGame.id, 
        isMajor: false,
        isActive: true,
      },
            {
        name: 'The Apostates',
        code: 'APOS',
        primaryColor: '#5E1914', // Тёмно-бордовый — цвет запёкшейся крови
        secondaryColor: '#000000', // Чёрный — тайные знания
        formationYear: null, // Не имеют точной даты, возникли стихийно
        dissolutionYear: null,
        description: 'Разрозненные культы, поклоняющиеся запретным богам и демонам. Их тактика — партизанская война, подкуп и тёмные ритуалы. Объединяет их лишь ненависть к Ордену.',
        logoUrl: 'uploads/factions/logos/temp.jpg',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: trenchCrusadeGame.id,
        isMajor: false,
        isActive: true,
      },
          {
        name: 'The Iron Pact',
        code: 'IRON',
        primaryColor: '#3A3A3A', // Цвет ржавого металла
        secondaryColor: '#8B0000', // Кроваво-красный — жестокость
        formationYear: 1459, // Условная дата "восстания машин"
        dissolutionYear: null,
        description: 'Осколки древних технократических культов, слившиеся с бандитами и мутантами. Используют уродливые механические гибриды и запретное оружие. Презирают и Орден, и еретиков.',
        logoUrl: 'uploads/factions/logos/temp.jpg',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: trenchCrusadeGame.id,
        isMajor: false,
        isActive: true,
      },
            {
        name: '2nd Legion of Vega',
        code: '2LV',
        primaryColor: '#C0C0C0', // Светло-серый — цвет "изгоев"
        secondaryColor: '#8B0000', // Тёмно-красный — скрытая ярость
        formationYear: 3025, // Реформа после 4-й Усперимской войны
        dissolutionYear: null,
        description: 'Позорное подразделение DCMS, куда ссылают провинившихся самураев. Несмотря на репутацию "отбросов", после 3039 года показали удивительную стойкость.',
        logoUrl: 'uploads/factions/logos/2nd Legion of Vega Logo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: false, // Не главная фракция, но культовая
        isActive: true,
      },
            {
        name: '4th Sword of Light',
        code: '4SOL',
        primaryColor: '#FF0000', // Ярко-красный — цвет Дракона
        secondaryColor: '#000000',
        formationYear: 2319, // Основаны при создании DCMS
        dissolutionYear: null,
        description: 'Одно из старейших и самых престижных подразделений DCMS. Прославились жестокостью в рейдах на Лайранское Содружество. Уничтожены в 3050-х, но позже восстановлены.',
        logoUrl: 'uploads/factions/logos/4th Sword of Light Logo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: false, // Часть DCMS, но не отдельная фракция
        isActive: true,
      },
            {
        name: 'Omega Galaxy (Clan Hell\'s Horses)',
        code: 'OMG-HH', // или "CHH-Omega"
        primaryColor: '#8B0000', // Тёмно-красный клана
        secondaryColor: '#000000', // Чёрный для "теневого" статуса
        formationYear: 3061, // Создана во время Войны Теней
        dissolutionYear: null,
        description: 'Элитная галактика Clan Hell\'s Horses, специализирующаяся на прорывах через укреплённые линии. Известна операцией "Теневой Проход" во время Войны Теней.',
        logoUrl: 'uploads/factions/logos/Omega Galaxy (Clan Hell\'s Horses) Logo.png',
        bannerUrl: 'factions/banners/temp.jpg',
        gameIdRef: battletechGame.id,
        isMajor: false, // Галактика — часть клана, не отдельная фракция
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