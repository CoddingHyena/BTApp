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
        culture: 'ANGLO_SAXON',
        cultures: { "ANGLO_SAXON": 0.7, "GERMAN": 0.1, "MEDITERRANEAN": 0.1, "RUSSIAN": 0.1 }, 
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
        culture: 'JAPANESE',
        cultures: { "JAPANESE": 0.8, "MEDITERRANEAN": 0.1, "RUSSIAN": 0.1 }, 
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
        culture: 'CHINESE',
        cultures: { "CHINESE": 0.5, "INDIAN": 0.2, "RUSSIAN": 0.2, "ANGLO_SAXON": 0.1 }, 
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
        culture: 'MEDITERRANEAN',
        cultures: { "ANGLO_SAXON": 0.7, "GERMAN": 0.1, "MEDITERRANEAN": 0.1, "CHINESE": 0.1 }, 
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
        culture: 'GERMAN',
        cultures: { "GERMAN": 0.7, "ANGLO_SAXON": 0.1, "MEDITERRANEAN": 0.1,  "RUSSIAN": 0.1 }, 
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
        culture: 'GERMAN',
        cultures: { "GERMAN": 0.7, "ANGLO_SAXON": 0.1, "MEDITERRANEAN": 0.1,  "RUSSIAN": 0.1 }, 
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
        culture: 'ANGLO_SAXON', // Основная культура (для обратной совместимости)
        cultures: { "ANGLO_SAXON": 0.3, "GERMAN": 0.2, "JAPANESE": 0.15, "CHINESE": 0.15, "MEDITERRANEAN": 0.1, "RUSSIAN": 0.1 }, // Смешанная культура
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
        culture: 'CLAN',
        cultures: { 
          "ANGLO_SAXON": 0.35,    // Европейские имена
          "GERMAN": 0.25,         // Европейские имена
          "SCANDINAVIAN": 0.15,   // Европейские имена
          "MEDITERRANEAN": 0.10,  // Европейские имена
          "JAPANESE": 0.08,       // Азиатские имена
          "CHINESE": 0.04,        // Азиатские имена
          "RUSSIAN": 0.03         // Славянские имена
        },
        clanSettings: {
          warriorNameChance: 0.2,  // 20% воинов с фамилиями
          callsignChance: 0.15,    // 15% воинов с позывными
          warriorNames: [
            // Настоящие клановые фамилии BattleTech
            'Kerensky', 'Ward', 'Jorgensson', 'Showers', 'Fetladral', 'Hazen',
            'Kabrinski', 'Osis', 'Pryde', 'Malthus', 'Dinour', 'Ferrer', 'Carns',
            'Radick', 'Sennet', 'Devalis', 'Bekker', 'Mattlov', 'Bjorn', 'Fletcher',
            'Leroux', 'Marek', 'Mechow', 'Nagle', 'Quinn', 'Rood', 'Shaw', 'Tanaga',
            'Vong', 'Zane', 'Cynthy', 'Holliday', 'Irvine', 'Koga', 'Lankenau',
            'Mendoza', 'Otis', 'Pavel', 'Rosse', 'Tseng', 'Volk', 'West', 'Yanez',
            'Zibler', 'Carr', 'Dumont', 'Eld', 'Furey', 'Golightly', 'Hudson',
            'Ilsa', 'Jerricho', 'Kisho', 'Lyon', 'Wolf', 'Falcon', 'Bear', 'Tiger',
            'Jaguar', 'Cobra', 'Viper', 'Scorpion', 'Spider', 'Mongoose', 'Fox',
            'Horse', 'Goat', 'Rat', 'Cat', 'Dog', 'Bird', 'Fish', 'Snake'
          ]
        }
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
        culture: 'INDIAN',
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
        culture: 'INDIAN',
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
        culture: 'ANGLO_SAXON', // Наемники используют смешанную культуру
        cultures: { "ANGLO_SAXON": 0.17, "GERMAN": 0.17, "JAPANESE": 0.13, "CHINESE": 0.12, "MEDITERRANEAN": 0.17, "RUSSIAN": 0.12,  "INDIAN": 0.12 }, // Смешанная культура
        
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
        culture: 'ANGLO_SAXON', // Наемники используют смешанную культуру
         cultures: { "ANGLO_SAXON": 0.17, "GERMAN": 0.17, "JAPANESE": 0.13, "CHINESE": 0.12, "MEDITERRANEAN": 0.17, "RUSSIAN": 0.12,  "INDIAN": 0.12 }, // Смешанная культура
        
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
        culture: 'ANGLO_SAXON', // Наследует от ComStar
        cultures: { "ANGLO_SAXON": 0.3, "GERMAN": 0.2, "JAPANESE": 0.15, "CHINESE": 0.15, "MEDITERRANEAN": 0.1, "RUSSIAN": 0.1 }, // Смешанная культура
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
        culture: 'ANGLO_SAXON', // Смешанная культура
        cultures: { "ANGLO_SAXON": 0.3, "GERMAN": 0.2, "JAPANESE": 0.15, "CHINESE": 0.15, "MEDITERRANEAN": 0.1, "RUSSIAN": 0.1 }, // Смешанная культура
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
        culture: 'SCANDINAVIAN', 
        cultures: { "SCANDINAVIAN": 0.7, "GERMAN": 0.1, "JAPANESE": 0.2}, // Смешанная культура
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
        culture: 'SCANDINAVIAN', // Основная культура (для обратной совместимости)
        cultures: { "SCANDINAVIAN": 0.4, "CLAN": 0.6 }, // 40% скандинавские правила, 60% клановые правила
        clanSettings: {
          warriorNameChance: 0.2,  // 20% воинов с фамилиями (для клановой части)
          callsignChance: 0.15,    // 15% воинов с позывными (для клановой части)
          warriorNames: [
            // Клановые фамилии для Dominion
            'Kerensky', 'Ward', 'Jorgensson', 'Showers', 'Fetladral', 'Hazen',
            'Kabrinski', 'Osis', 'Pryde', 'Malthus', 'Dinour', 'Ferrer', 'Carns',
            'Radick', 'Sennet', 'Devalis', 'Bekker', 'Mattlov', 'Bjorn', 'Fletcher',
            'Leroux', 'Marek', 'Mechow', 'Nagle', 'Quinn', 'Rood', 'Shaw', 'Tanaga',
            'Vong', 'Zane', 'Cynthy', 'Holliday', 'Irvine', 'Koga', 'Lankenau',
            'Mendoza', 'Otis', 'Pavel', 'Rosse', 'Tseng', 'Volk', 'West', 'Yanez',
            'Zibler', 'Carr', 'Dumont', 'Eld', 'Furey', 'Golightly', 'Hudson',
            'Ilsa', 'Jerricho', 'Kisho', 'Lyon', 'Wolf', 'Falcon', 'Bear', 'Tiger',
            'Jaguar', 'Cobra', 'Viper', 'Scorpion', 'Spider', 'Mongoose', 'Fox',
            'Horse', 'Goat', 'Rat', 'Cat', 'Dog', 'Bird', 'Fish', 'Snake'
          ]
        }
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
        culture: 'ANGLO_SAXON', // Основная культура (для обратной совместимости)
        cultures: { "ANGLO_SAXON": 0.25, "GERMAN": 0.15, "JAPANESE": 0.1, "CHINESE": 0.1, "MEDITERRANEAN": 0.1, "RUSSIAN": 0.15, "INDIAN": 0.1, "SCANDINAVIAN": 0.05 }, // Все культуры
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
        culture: 'INDIAN',
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
        culture: 'ANGLO_SAXON', // Европейская средневековая культура
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
        culture: 'RUSSIAN', // Тёмная культура еретиков
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
        culture: 'ANGLO_SAXON', // Технократическая культура
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
        // culture: null - наследует от Draconis Combine
        // parentFactionId будет установлен после создания всех фракций
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
        // culture: null - наследует от Draconis Combine
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
        // culture: null - наследует от Clan Hell's Horses
      },
    ];

    // Создание записей в базе данных
    const createdFactions: any[] = [];
    for (const faction of factions) {
      const createdFaction = await client.faction.create({
        data: faction,
      });
      createdFactions.push(createdFaction);
    }

    // Установка связей parentFactionId для дочерних фракций
    const draconisCombine = createdFactions.find(f => f.name === 'Draconis Combine');
    const clanHellHorses = createdFactions.find(f => f.name === 'Clan Hell\'s Horses');
    const rasalhagueRepublic = createdFactions.find(f => f.name === 'Rasalhague Republic');

    // Обновляем дочерние фракции
    const childFactions = [
      { name: '2nd Legion of Vega', parentId: draconisCombine?.id },
      { name: '4th Sword of Light', parentId: draconisCombine?.id },
      { name: 'Omega Galaxy (Clan Hell\'s Horses)', parentId: clanHellHorses?.id },
      // Rasalhague Dominion - самостоятельная фракция, не дочерняя
    ];

    for (const childFaction of childFactions) {
      if (childFaction.parentId) {
        await client.faction.update({
          where: { name: childFaction.name },
          data: { parentFactionId: childFaction.parentId }
        });
        console.log(`✅ Установлена связь: ${childFaction.name} → ${childFaction.parentId}`);
      }
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