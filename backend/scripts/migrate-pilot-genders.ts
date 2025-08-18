import { PrismaClient } from '@prisma/client';
import { 
  getGenderFromName, 
  validateGenderNameCombination,
  CULTURE_CONFIG,
  getFactionThemedNameWithGender
} from '../src/modules/campaign-pilot/examples/names';

const prisma = new PrismaClient();

async function migratePilotGenders() {
  try {
    console.log('🔄 Начинаем миграцию пилотов с добавлением пола...\n');

    // Получаем всех пилотов
    const pilots = await prisma.campaignPilot.findMany({
      include: {
        faction: true,
        campaign: true
      }
    });

    console.log(`📊 Найдено ${pilots.length} пилотов для миграции\n`);

    let updatedCount = 0;
    let correctedCount = 0;
    let errors: Array<{ pilotId: string; error: string }> = [];

    for (const pilot of pilots) {
      try {
        console.log(`🔍 Обрабатываем пилота: ${pilot.firstName} ${pilot.lastName} (${pilot.faction.name})`);

        // Определяем культуру по фракции
        const factionName = pilot.faction.name.toLowerCase();
        let culture: string;
        
        if (factionName.includes('steiner') || factionName.includes('lyran')) {
          culture = 'GERMAN';
        } else if (factionName.includes('davion') || factionName.includes('federated')) {
          culture = 'ANGLO_SAXON';
        } else if (factionName.includes('kurita') || factionName.includes('draconis')) {
          culture = 'JAPANESE';
        } else if (factionName.includes('liao') || factionName.includes('capellan')) {
          culture = 'CHINESE';
        } else if (factionName.includes('marik') || factionName.includes('free worlds')) {
          culture = 'MEDITERRANEAN';
        } else if (factionName.includes('periphery') || factionName.includes('bandit')) {
          culture = 'RUSSIAN';
        } else if (factionName.includes('clan') || factionName.includes('wolf')) {
          culture = 'INDIAN';
        } else {
          culture = 'ANGLO_SAXON'; // По умолчанию
        }

        // Определяем пол по имени
        let gender = getGenderFromName(pilot.firstName, culture as any);
        
        // Если не удалось определить пол, генерируем случайный
        if (!gender) {
          gender = Math.random() < 0.5 ? 'male' : 'female';
          console.log(`   ⚠️  Не удалось определить пол, установлен случайный: ${gender}`);
        }

        // Проверяем корректность комбинации
        const isValid = validateGenderNameCombination(
          pilot.firstName, 
          pilot.lastName, 
          gender, 
          culture as any
        );

        let needsCorrection = false;
        let newFirstName = pilot.firstName;
        let newLastName = pilot.lastName;

        // Если комбинация некорректна, исправляем
        if (!isValid && CULTURE_CONFIG[culture as any]?.hasGenderDifferences) {
          console.log(`   ❌ Некорректная комбинация: ${pilot.firstName} ${pilot.lastName} (${gender})`);
          
          // Генерируем корректное имя для данного пола
          const correctedName = getFactionThemedNameWithGender(pilot.faction.name, gender);
          newFirstName = correctedName.firstName;
          newLastName = correctedName.lastName;
          needsCorrection = true;
          correctedCount++;
          
          console.log(`   ✅ Исправлено на: ${newFirstName} ${newLastName} (${gender})`);
        } else {
          console.log(`   ✅ Корректная комбинация: ${pilot.firstName} ${pilot.lastName} (${gender})`);
        }

        // Обновляем пилота
        await prisma.campaignPilot.update({
          where: { id: pilot.id },
          data: {
            gender: gender === 'male' ? 'MALE' : 'FEMALE',
            firstName: newFirstName,
            lastName: newLastName
          }
        });

        updatedCount++;
        console.log(`   ✅ Обновлен пилот: ${newFirstName} ${newLastName} (${gender})\n`);

      } catch (error) {
        console.error(`   ❌ Ошибка при обработке пилота ${pilot.id}:`, error);
        errors.push({ pilotId: pilot.id, error: error.message });
      }
    }

    console.log('📊 Результаты миграции:');
    console.log(`   ✅ Обновлено пилотов: ${updatedCount}`);
    console.log(`   🔧 Исправлено некорректных комбинаций: ${correctedCount}`);
    console.log(`   ❌ Ошибок: ${errors.length}`);

    if (errors.length > 0) {
      console.log('\n❌ Ошибки:');
      errors.forEach(({ pilotId, error }) => {
        console.log(`   Пилот ${pilotId}: ${error}`);
      });
    }

    console.log('\n🎉 Миграция завершена!');

  } catch (error) {
    console.error('❌ Критическая ошибка при миграции:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем миграцию
migratePilotGenders();
