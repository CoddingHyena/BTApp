import { PrismaClient } from '@prisma/client';
import { CampaignPilotService } from '../src/modules/campaign-pilot/campaign-pilot.service';
import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaClient();

async function testFactionCultureInheritance() {
  try {
    console.log('🎮 Тестирование системы наследования культур фракций\n');

    // Создаем экземпляр сервиса
    const prismaService = new PrismaService();
    const pilotService = new CampaignPilotService(prismaService);

    // Получаем фракции для тестирования
    const draconisCombine = await prisma.faction.findUnique({
      where: { name: 'Draconis Combine' },
      include: { childFactions: true }
    });

    const legionOfVega = await prisma.faction.findUnique({
      where: { name: '2nd Legion of Vega' },
      include: { parentFaction: true }
    });

    const clanHellHorses = await prisma.faction.findUnique({
      where: { name: 'Clan Hell\'s Horses' },
      include: { childFactions: true }
    });

    const omegaGalaxy = await prisma.faction.findUnique({
      where: { name: 'Omega Galaxy (Clan Hell\'s Horses)' },
      include: { parentFaction: true }
    });

    console.log('📋 Информация о фракциях:');
    console.log(`   Draconis Combine: culture = ${draconisCombine?.culture}`);
    console.log(`   2nd Legion of Vega: culture = ${legionOfVega?.culture}, parent = ${legionOfVega?.parentFaction?.name}`);
    console.log(`   Clan Hell's Horses: culture = ${clanHellHorses?.culture}`);
    console.log(`   Omega Galaxy: culture = ${omegaGalaxy?.culture}, parent = ${omegaGalaxy?.parentFaction?.name}`);
    console.log('');

    // Тестируем получение культуры через иерархию
    if (draconisCombine && legionOfVega) {
      console.log('🔍 Тестирование наследования культуры:');
      
      const draconisCulture = await pilotService.getFactionCulture(draconisCombine.id);
      const legionCulture = await pilotService.getFactionCulture(legionOfVega.id);
      
      console.log(`   Draconis Combine (ID: ${draconisCombine.id}): ${draconisCulture}`);
      console.log(`   2nd Legion of Vega (ID: ${legionOfVega.id}): ${legionCulture}`);
      console.log(`   ✅ Наследование работает: ${draconisCulture === legionCulture ? 'ДА' : 'НЕТ'}`);
      console.log('');

      // Тестируем генерацию пилотов
      console.log('👨‍✈️ Тестирование генерации пилотов:');
      
      const draconisPilot = await pilotService.generatePilotData(draconisCombine.id, 'male');
      const legionPilot = await pilotService.generatePilotData(legionOfVega.id, 'male');
      
      console.log(`   Draconis Combine пилот: ${draconisPilot.firstName} ${draconisPilot.lastName} '${draconisPilot.callsign}'`);
      console.log(`   2nd Legion пилот: ${legionPilot.firstName} ${legionPilot.lastName} '${legionPilot.callsign}'`);
      console.log(`   ✅ Оба пилота японские: ${draconisPilot.firstName.includes('Takeshi') || draconisPilot.firstName.includes('Kenji') ? 'ДА' : 'НЕТ'}`);
      console.log('');
    }

    // Тестируем клановые фракции
    if (clanHellHorses && omegaGalaxy) {
      console.log('🏛️ Тестирование клановых фракций:');
      
      const clanCulture = await pilotService.getFactionCulture(clanHellHorses.id);
      const omegaCulture = await pilotService.getFactionCulture(omegaGalaxy.id);
      
      console.log(`   Clan Hell's Horses (ID: ${clanHellHorses.id}): ${clanCulture}`);
      console.log(`   Omega Galaxy (ID: ${omegaGalaxy.id}): ${omegaCulture}`);
      console.log(`   ✅ Наследование работает: ${clanCulture === omegaCulture ? 'ДА' : 'НЕТ'}`);
      console.log('');

      // Тестируем генерацию пилотов кланов
      const clanPilot = await pilotService.generatePilotData(clanHellHorses.id, 'male');
      const omegaPilot = await pilotService.generatePilotData(omegaGalaxy.id, 'male');
      
      console.log(`   Clan Hell's Horses пилот: ${clanPilot.firstName} ${clanPilot.lastName} '${clanPilot.callsign}'`);
      console.log(`   Omega Galaxy пилот: ${omegaPilot.firstName} ${omegaPilot.lastName} '${omegaPilot.callsign}'`);
      console.log(`   ✅ Оба пилота индийские: ${clanPilot.firstName.includes('Arjun') || clanPilot.firstName.includes('Vikram') ? 'ДА' : 'НЕТ'}`);
      console.log('');
    }

    console.log('✅ Тестирование завершено успешно!');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем тест
testFactionCultureInheritance();
