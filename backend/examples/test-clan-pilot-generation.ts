import { PrismaClient } from '@prisma/client';
import { CampaignPilotService } from '../src/modules/campaign-pilot/campaign-pilot.service';
import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaClient();

async function testClanPilotGeneration() {
  console.log('🧪 Тестирование генерации клановых пилотов...\n');
  try {
    const clanWolf = await prisma.faction.findFirst({ where: { name: 'Clan Wolf' } });
    if (!clanWolf) { console.log('❌ Clan Wolf не найден в базе данных'); return; }
    
    console.log(`📋 Найдена фракция: ${clanWolf.name}`);
    console.log(`🏛️  Культура: ${clanWolf.culture}`);
    console.log(`🎭 Культурные веса:`, clanWolf.cultures);
    console.log(`⚔️  Клановые настройки:`, clanWolf.clanSettings);
    console.log('');
    
    const pilotService = new CampaignPilotService(new PrismaService());
    
    console.log('🎯 Генерация клановых пилотов (20% воинских фамилий, 15% позывных):');
    console.log('─'.repeat(70));
    
    let pilotsWithWarriorNames = 0;
    let pilotsWithCallsigns = 0;
    const totalPilots = 50;
    
    for (let i = 1; i <= totalPilots; i++) {
      const pilot = await pilotService.generatePilotData(clanWolf.id);
      const hasWarriorName = pilot.lastName && pilot.lastName.length > 0;
      const hasCallsign = pilot.callsign && pilot.callsign.length > 0;
      
      if (hasWarriorName) pilotsWithWarriorNames++;
      if (hasCallsign) pilotsWithCallsigns++;
      
      const warriorNameIndicator = hasWarriorName ? '⚔️' : '  ';
      const callsignIndicator = hasCallsign ? '📢' : '  ';
      
      console.log(`${i.toString().padStart(2, '0')}. ${pilot.fullName} (${pilot.gender}) ${warriorNameIndicator}${callsignIndicator}`);
    }
    
    console.log('');
    console.log('📊 Статистика:');
    console.log(`   Всего пилотов: ${totalPilots}`);
    console.log(`   С воинскими фамилиями: ${pilotsWithWarriorNames} (${(pilotsWithWarriorNames/totalPilots*100).toFixed(1)}%)`);
    console.log(`   С позывными: ${pilotsWithCallsigns} (${(pilotsWithCallsigns/totalPilots*100).toFixed(1)}%)`);
    console.log('');
    
    console.log('🎯 Примеры пилотов с заданным полом:');
    console.log('─'.repeat(50));
    for (let i = 1; i <= 5; i++) {
      const malePilot = await pilotService.generatePilotData(clanWolf.id, 'male');
      const femalePilot = await pilotService.generatePilotData(clanWolf.id, 'female');
      
      const maleWarrior = malePilot.lastName && malePilot.lastName.length > 0 ? '⚔️' : '  ';
      const maleCallsign = malePilot.callsign && malePilot.callsign.length > 0 ? '📢' : '  ';
      const femaleWarrior = femalePilot.lastName && femalePilot.lastName.length > 0 ? '⚔️' : '  ';
      const femaleCallsign = femalePilot.callsign && femalePilot.callsign.length > 0 ? '📢' : '  ';
      
      console.log(`${i.toString().padStart(2, '0')}. М: ${malePilot.fullName} ${maleWarrior}${maleCallsign}`);
      console.log(`     Ж: ${femalePilot.fullName} ${femaleWarrior}${femaleCallsign}`);
    }
    
    console.log('');
    console.log('✅ Тестирование завершено успешно!');
    console.log('💡 Ожидаемые результаты:');
    console.log('   - ~20% пилотов должны иметь воинские фамилии');
    console.log('   - ~15% пилотов должны иметь позывные');
    console.log('   - Имена берутся из смешанных культур (европейские, азиатские, славянские)');
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testClanPilotGeneration();
