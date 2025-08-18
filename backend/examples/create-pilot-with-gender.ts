import { PrismaClient } from '@prisma/client';
import { 
  generateCompletePilot, 
  generateCompletePilotWithGender,
  getFactionThemedNameWithGender, 
  getRandomNameWithGender,
  generateFullPilotName,
  regeneratePilot,
  regeneratePilotName,
  validateGenderNameCombination,
  getGenderFromName,
  generateRandomGender,
  CULTURE_CONFIG
} from '../src/modules/campaign-pilot/examples/names';
import { getFactionThemedCallsign } from '../src/modules/campaign-pilot/examples/callsigns';

const prisma = new PrismaClient();

async function createPilotWithGender() {
  try {
    console.log('🎮 Создание пилотов с поддержкой половых различий\n');

    // Пример 1: Автоматическая генерация с случайным полом
    console.log('🔄 Автоматическая генерация с случайным полом:');
    const steinerPilot = generateCompletePilot('House Steiner');
    console.log(`   Пол: ${steinerPilot.gender}`);
    console.log(`   Имя: ${steinerPilot.firstName} ${steinerPilot.lastName}`);
    console.log(`   Позывной: ${steinerPilot.callsign}`);
    console.log(`   Полное имя: ${steinerPilot.fullName}`);
    console.log('');

    // Пример 2: Генерация с заданным полом
    console.log('👨 Генерация мужского пилота:');
    const maleKuritaPilot = generateCompletePilotWithGender('House Kurita', 'male');
    console.log(`   Пол: ${maleKuritaPilot.gender}`);
    console.log(`   Имя: ${maleKuritaPilot.firstName} ${maleKuritaPilot.lastName}`);
    console.log(`   Позывной: ${maleKuritaPilot.callsign}`);
    console.log(`   Полное имя: ${maleKuritaPilot.fullName}`);
    console.log('');

    // Пример 3: Генерация женского пилота
    console.log('👩 Генерация женского пилота:');
    const femaleKuritaPilot = generateCompletePilotWithGender('House Kurita', 'female');
    console.log(`   Пол: ${femaleKuritaPilot.gender}`);
    console.log(`   Имя: ${femaleKuritaPilot.firstName} ${femaleKuritaPilot.lastName}`);
    console.log(`   Позывной: ${femaleKuritaPilot.callsign}`);
    console.log(`   Полное имя: ${femaleKuritaPilot.fullName}`);
    console.log('');

    // Пример 4: Русские пилоты с половыми различиями
    console.log('🇷🇺 Русские пилоты с половыми различиями:');
    
    const maleRussianPilot = generateCompletePilotWithGender('Periphery', 'male');
    console.log(`   Мужчина: ${maleRussianPilot.firstName} ${maleRussianPilot.lastName} (${maleRussianPilot.gender})`);
    
    const femaleRussianPilot = generateCompletePilotWithGender('Periphery', 'female');
    console.log(`   Женщина: ${femaleRussianPilot.firstName} ${femaleRussianPilot.lastName} (${femaleRussianPilot.gender})`);
    console.log('');

    // Пример 5: Перегенерация пилота
    console.log('🔄 Перегенерация пилота:');
    const originalPilot = generateCompletePilot('House Davion');
    console.log(`   Оригинал: ${originalPilot.firstName} ${originalPilot.lastName} (${originalPilot.gender})`);
    
    const regeneratedPilot = regeneratePilot('House Davion');
    console.log(`   Перегенерирован: ${regeneratedPilot.firstName} ${regeneratedPilot.lastName} (${regeneratedPilot.gender})`);
    console.log('');

    // Пример 6: Перегенерация только имени (сохранение пола)
    console.log('🔄 Перегенерация только имени (сохранение пола):');
    const pilotWithGender = generateCompletePilotWithGender('House Marik', 'female');
    console.log(`   Оригинал: ${pilotWithGender.firstName} ${pilotWithGender.lastName} (${pilotWithGender.gender})`);
    
    const regeneratedName = regeneratePilotName('House Marik', pilotWithGender.gender);
    console.log(`   Новое имя: ${regeneratedName.firstName} ${regeneratedName.lastName} (${regeneratedName.gender})`);
    console.log('');

    // Пример 7: Валидация комбинаций пола и имени
    console.log('✅ Валидация комбинаций пола и имени:');
    
    // Корректная комбинация для русских
    const validRussian = validateGenderNameCombination('Ivan', 'Ivanov', 'male', 'RUSSIAN');
    console.log(`   Иван Иванов (male): ${validRussian ? '✅' : '❌'}`);
    
    const validRussianFemale = validateGenderNameCombination('Natasha', 'Ivanova', 'female', 'RUSSIAN');
    console.log(`   Наташа Иванова (female): ${validRussianFemale ? '✅' : '❌'}`);
    
    // Некорректная комбинация
    const invalidRussian = validateGenderNameCombination('Ivan', 'Ivanova', 'male', 'RUSSIAN');
    console.log(`   Иван Иванова (male): ${invalidRussian ? '✅' : '❌'}`);
    
    // Для культур без различий
    const validGerman = validateGenderNameCombination('Hans', 'Mueller', 'female', 'GERMAN');
    console.log(`   Hans Mueller (female, German): ${validGerman ? '✅' : '❌'}`);
    console.log('');

    // Пример 8: Определение пола по имени
    console.log('🔍 Определение пола по имени:');
    
    const maleGender = getGenderFromName('Ivan', 'RUSSIAN');
    console.log(`   Иван: ${maleGender}`);
    
    const femaleGender = getGenderFromName('Natasha', 'RUSSIAN');
    console.log(`   Наташа: ${femaleGender}`);
    
    const unknownGender = getGenderFromName('Hans', 'GERMAN');
    console.log(`   Hans (German): ${unknownGender}`);
    console.log('');

    // Пример 9: Конфигурация культур
    console.log('🌍 Конфигурация культур:');
    Object.entries(CULTURE_CONFIG).forEach(([culture, config]) => {
      console.log(`   ${culture}: ${config.hasGenderDifferences ? 'Половые различия' : 'Без различий'}`);
    });
    console.log('');

    // Пример 10: Создание пилота в базе данных
    console.log('💾 Создание пилота в базе данных:');
    const pilotData = {
      campaignId: 'camp-001', // ID существующей кампании
      factionId: 1, // House Steiner
      firstName: steinerPilot.firstName,
      lastName: steinerPilot.lastName,
      callsign: steinerPilot.callsign,
      gender: steinerPilot.gender === 'male' ? 'MALE' : 'FEMALE', // Преобразование в enum
      rank: 'LANCE_LEADER' as const,
      gunnery: 4,
      piloting: 5,
      alphaStrikeSkill: 3,
      experience: 0,
      specialization: 'MECH' as const,
      cost: 1000
    };

    console.log(`   Данные:`, pilotData);
    
    // Раскомментируйте для реального создания в БД
    /*
    const pilot = await prisma.campaignPilot.create({
      data: pilotData,
      include: {
        campaign: true,
        faction: true
      }
    });

    console.log('✅ Пилот создан:', {
      id: pilot.id,
      fullName: `${pilot.firstName} ${pilot.lastName} '${pilot.callsign}'`,
      gender: pilot.gender,
      faction: pilot.faction.name,
      campaign: pilot.campaign.name
    });
    */

    // Примеры различных культур с полами
    console.log('🌍 Примеры имен по культурам с полами:');
    const cultures = ['GERMAN', 'JAPANESE', 'CHINESE', 'ANGLO_SAXON', 'MEDITERRANEAN', 'RUSSIAN', 'INDIAN'] as const;
    
    cultures.forEach(culture => {
      const maleName = getRandomNameWithGender(culture, 'male');
      const femaleName = getRandomNameWithGender(culture, 'female');
      console.log(`   ${culture}:`);
      console.log(`     Мужчина: ${maleName.firstName} ${maleName.lastName}`);
      console.log(`     Женщина: ${femaleName.firstName} ${femaleName.lastName}`);
    });

  } catch (error) {
    console.error('❌ Ошибка при создании пилота:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем пример
createPilotWithGender();
