import { PrismaClient } from '@prisma/client';
import { CampaignPilotService } from '../src/modules/campaign-pilot/campaign-pilot.service';
import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaClient();

async function testMixedCulturePilots() {
  console.log('🧪 Тестирование генерации пилотов со смешанными культурами...\n');

  const pilotService = new CampaignPilotService(new PrismaService());

  try {
    // Находим фракции для тестирования
    const rasalhagueDominion = await prisma.faction.findFirst({
      where: { name: 'Rasalhague Dominion' }
    });

    const comStar = await prisma.faction.findFirst({
      where: { name: 'ComStar' }
    });

    const mercenaries = await prisma.faction.findFirst({
      where: { name: 'Mercenaries' }
    });

    if (!rasalhagueDominion || !comStar || !mercenaries) {
      console.log('❌ Не найдены тестовые фракции');
      return;
    }

    console.log('📊 Веса культур фракций:');
    console.log(`Rasalhague Dominion:`, await pilotService.getFactionCultureWeights(rasalhagueDominion.id));
    console.log(`ComStar:`, await pilotService.getFactionCultureWeights(comStar.id));
    console.log(`Mercenaries:`, await pilotService.getFactionCultureWeights(mercenaries.id));
    console.log('');

    // Тестируем генерацию пилотов для Rasalhague Dominion
    console.log('🎯 Генерация пилотов для Rasalhague Dominion (70% скандинавских, 30% индийских):');
    for (let i = 0; i < 5; i++) {
      const pilot = await pilotService.generatePilotData(rasalhagueDominion.id);
      console.log(`  ${i + 1}. ${pilot.firstName} ${pilot.lastName} '${pilot.callsign}' (${pilot.gender})`);
    }
    console.log('');

    // Тестируем генерацию пилотов для ComStar
    console.log('🎯 Генерация пилотов для ComStar (смешанная культура):');
    for (let i = 0; i < 5; i++) {
      const pilot = await pilotService.generatePilotData(comStar.id);
      console.log(`  ${i + 1}. ${pilot.firstName} ${pilot.lastName} '${pilot.callsign}' (${pilot.gender})`);
    }
    console.log('');

    // Тестируем генерацию пилотов для наемников
    console.log('🎯 Генерация пилотов для наемников (все культуры):');
    for (let i = 0; i < 5; i++) {
      const pilot = await pilotService.generatePilotData(mercenaries.id);
      console.log(`  ${i + 1}. ${pilot.firstName} ${pilot.lastName} '${pilot.callsign}' (${pilot.gender})`);
    }
    console.log('');

    // Тестируем генерацию с заданным полом
    console.log('🎯 Генерация пилотов с заданным полом:');
    const malePilot = await pilotService.generatePilotData(rasalhagueDominion.id, 'male');
    const femalePilot = await pilotService.generatePilotData(rasalhagueDominion.id, 'female');
    console.log(`  Мужчина: ${malePilot.firstName} ${malePilot.lastName} '${malePilot.callsign}'`);
    console.log(`  Женщина: ${femalePilot.firstName} ${femalePilot.lastName} '${femalePilot.callsign}'`);

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем тест
testMixedCulturePilots();
