import { PrismaClient } from '@prisma/client';
import { CampaignPilotService } from '../src/modules/campaign-pilot/campaign-pilot.service';
import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaClient();

async function testRasalhagueDominionPilots() {
  console.log('🧪 Тестирование генерации пилотов Rasalhague Dominion...\n');
  try {
    const rasalhagueDominion = await prisma.faction.findFirst({ where: { name: 'Rasalhague Dominion' } });
    if (!rasalhagueDominion) { console.log('❌ Rasalhague Dominion не найден в базе данных'); return; }
    
    console.log(`📋 Найдена фракция: ${rasalhagueDominion.name}`);
    console.log(`🏛️  Культура: ${rasalhagueDominion.culture}`);
    console.log(`🎭 Культурные веса:`, rasalhagueDominion.cultures);
    console.log(`⚔️  Клановые настройки:`, rasalhagueDominion.clanSettings);
    console.log('');
    
    const pilotService = new CampaignPilotService(new PrismaService());
    
    console.log('🎯 Генерация пилотов Rasalhague Dominion (40% скандинавские, 60% клановые правила):');
    console.log('─'.repeat(80));
    
    let scandinavianStylePilots = 0;
    let clanStylePilots = 0;
    const totalPilots = 50;
    
    for (let i = 1; i <= totalPilots; i++) {
      const pilot = await pilotService.generatePilotData(rasalhagueDominion.id);
      
      // Определяем стиль пилота
      const hasScandinavianName = pilot.firstName && ['Erik', 'Bjorn', 'Astrid', 'Ingrid', 'Harald', 'Sigrid', 'Helga', 'Gudrun', 'Solveig', 'Thyra', 'Liv', 'Hilda', 'Eira', 'Saga', 'Runa', 'Ylva', 'Alva', 'Tora', 'Leif', 'Olaf', 'Sven', 'Gunnar', 'Torsten', 'Lars', 'Anders', 'Magnus', 'Sten', 'Ragnar', 'Sigurd', 'Ivar', 'Hakon', 'Freya'].includes(pilot.firstName);
      const hasClanLastName = pilot.lastName && ['Kerensky', 'Ward', 'Wolf', 'Bear', 'Tiger', 'Jaguar', 'Cobra', 'Viper', 'Scorpion', 'Spider', 'Mongoose', 'Fox', 'Horse', 'Goat', 'Rat', 'Cat', 'Dog', 'Bird', 'Fish', 'Snake', 'Jorgensson', 'Showers', 'Fetladral', 'Hazen', 'Kabrinski', 'Osis', 'Pryde', 'Malthus', 'Dinour', 'Ferrer', 'Carns', 'Radick', 'Sennet', 'Devalis', 'Bekker', 'Mattlov', 'Fletcher', 'Leroux', 'Marek', 'Mechow', 'Nagle', 'Quinn', 'Rood', 'Shaw', 'Tanaga', 'Vong', 'Zane', 'Cynthy', 'Holliday', 'Irvine', 'Koga', 'Lankenau', 'Mendoza', 'Otis', 'Pavel', 'Rosse', 'Tseng', 'Volk', 'West', 'Yanez', 'Zibler', 'Carr', 'Dumont', 'Eld', 'Furey', 'Golightly', 'Hudson', 'Ilsa', 'Jerricho', 'Kisho', 'Lyon', 'Falcon'].includes(pilot.lastName);
      const hasScandinavianLastName = pilot.lastName && ['Andersen', 'Johansson', 'Nilsson', 'Eriksson', 'Svensson', 'Gustafsson', 'Olsson', 'Pettersson', 'Berg', 'Lund', 'Hansen', 'Pedersen', 'Jensen', 'Karlsen', 'Larsen', 'Nilsen', 'Solberg', 'Haugen', 'Kristiansen', 'Iversen', 'Amundsen', 'Bjornstad', 'Eide', 'Foss', 'Holm', 'Moen', 'Nygaard', 'Strand', 'Vik', 'Aas', 'Dahl', 'Engen'].includes(pilot.lastName);
      
      let pilotStyle = 'Unknown';
      let styleIndicator = '❓';
      
      if (hasScandinavianName && hasScandinavianLastName) {
        pilotStyle = 'Scandinavian';
        styleIndicator = '🇸🇪';
        scandinavianStylePilots++;
      } else if (hasClanLastName || (!hasScandinavianLastName && !hasScandinavianName)) {
        pilotStyle = 'Clan';
        styleIndicator = '⚔️';
        clanStylePilots++;
      }
      
      const warriorIndicator = hasClanLastName ? '⚔️' : '  ';
      const callsignIndicator = pilot.callsign && pilot.callsign.length > 0 ? '📢' : '  ';
      
      console.log(`${i.toString().padStart(2, '0')}. ${pilot.fullName} (${pilot.gender}) ${styleIndicator} ${warriorIndicator}${callsignIndicator}`);
    }
    
    console.log('');
    console.log('📊 Статистика:');
    console.log(`   Всего пилотов: ${totalPilots}`);
    console.log(`   Скандинавский стиль: ${scandinavianStylePilots} (${(scandinavianStylePilots/totalPilots*100).toFixed(1)}%)`);
    console.log(`   Клановый стиль: ${clanStylePilots} (${(clanStylePilots/totalPilots*100).toFixed(1)}%)`);
    console.log('');
    
    console.log('🎯 Примеры пилотов с заданным полом:');
    console.log('─'.repeat(50));
    for (let i = 1; i <= 5; i++) {
      const malePilot = await pilotService.generatePilotData(rasalhagueDominion.id, 'male');
      const femalePilot = await pilotService.generatePilotData(rasalhagueDominion.id, 'female');
      
      const maleWarrior = malePilot.lastName && ['Kerensky', 'Ward', 'Wolf', 'Bear', 'Tiger', 'Jaguar', 'Cobra', 'Viper', 'Scorpion', 'Spider', 'Mongoose', 'Fox', 'Horse', 'Goat', 'Rat', 'Cat', 'Dog', 'Bird', 'Fish', 'Snake', 'Jorgensson', 'Showers', 'Fetladral', 'Hazen', 'Kabrinski', 'Osis', 'Pryde', 'Malthus', 'Dinour', 'Ferrer', 'Carns', 'Radick', 'Sennet', 'Devalis', 'Bekker', 'Mattlov', 'Fletcher', 'Leroux', 'Marek', 'Mechow', 'Nagle', 'Quinn', 'Rood', 'Shaw', 'Tanaga', 'Vong', 'Zane', 'Cynthy', 'Holliday', 'Irvine', 'Koga', 'Lankenau', 'Mendoza', 'Otis', 'Pavel', 'Rosse', 'Tseng', 'Volk', 'West', 'Yanez', 'Zibler', 'Carr', 'Dumont', 'Eld', 'Furey', 'Golightly', 'Hudson', 'Ilsa', 'Jerricho', 'Kisho', 'Lyon', 'Falcon'].includes(malePilot.lastName) ? '⚔️' : '  ';
      const maleCallsign = malePilot.callsign && malePilot.callsign.length > 0 ? '📢' : '  ';
      const femaleWarrior = femalePilot.lastName && ['Kerensky', 'Ward', 'Wolf', 'Bear', 'Tiger', 'Jaguar', 'Cobra', 'Viper', 'Scorpion', 'Spider', 'Mongoose', 'Fox', 'Horse', 'Goat', 'Rat', 'Cat', 'Dog', 'Bird', 'Fish', 'Snake', 'Jorgensson', 'Showers', 'Fetladral', 'Hazen', 'Kabrinski', 'Osis', 'Pryde', 'Malthus', 'Dinour', 'Ferrer', 'Carns', 'Radick', 'Sennet', 'Devalis', 'Bekker', 'Mattlov', 'Fletcher', 'Leroux', 'Marek', 'Mechow', 'Nagle', 'Quinn', 'Rood', 'Shaw', 'Tanaga', 'Vong', 'Zane', 'Cynthy', 'Holliday', 'Irvine', 'Koga', 'Lankenau', 'Mendoza', 'Otis', 'Pavel', 'Rosse', 'Tseng', 'Volk', 'West', 'Yanez', 'Zibler', 'Carr', 'Dumont', 'Eld', 'Furey', 'Golightly', 'Hudson', 'Ilsa', 'Jerricho', 'Kisho', 'Lyon', 'Falcon'].includes(femalePilot.lastName) ? '⚔️' : '  ';
      const femaleCallsign = femalePilot.callsign && femalePilot.callsign.length > 0 ? '📢' : '  ';
      
      console.log(`${i.toString().padStart(2, '0')}. М: ${malePilot.fullName} ${maleWarrior}${maleCallsign}`);
      console.log(`     Ж: ${femalePilot.fullName} ${femaleWarrior}${femaleCallsign}`);
    }
    
    console.log('');
    console.log('✅ Тестирование завершено успешно!');
    console.log('💡 Ожидаемые результаты:');
    console.log('   - ~40% пилотов должны быть в скандинавском стиле (имя + фамилия + позывной)');
    console.log('   - ~60% пилотов должны быть в клановом стиле (европейское имя + редкие фамилии/позывные)');
    console.log('   - Скандинавские имена: Erik, Bjorn, Astrid, Ingrid, Harald, Sigrid, Helga, Gudrun, Solveig, Thyra, Liv, Hilda, Eira, Saga, Runa, Ylva, Alva, Tora, Leif, Olaf, Sven, Gunnar, Torsten, Lars, Anders, Magnus, Sten, Ragnar, Sigurd, Ivar, Hakon, Freya');
    console.log('   - Скандинавские фамилии: Andersen, Johansson, Nilsson, Eriksson, Svensson, Gustafsson, Olsson, Pettersson, Berg, Lund, Hansen, Pedersen, Jensen, Karlsen, Larsen, Nilsen, Solberg, Haugen, Kristiansen, Iversen, Amundsen, Bjornstad, Eide, Foss, Holm, Moen, Nygaard, Strand, Vik, Aas, Dahl, Engen');
    console.log('   - Клановые фамилии: Kerensky, Ward, Wolf, Bear, Tiger, Jaguar, Cobra, Viper, Scorpion, Spider, Mongoose, Fox, Horse, Goat, Rat, Cat, Dog, Bird, Fish, Snake, Jorgensson, Showers, Fetladral, Hazen, Kabrinski, Osis, Pryde, Malthus, Dinour, Ferrer, Carns, Radick, Sennet, Devalis, Bekker, Mattlov, Fletcher, Leroux, Marek, Mechow, Nagle, Quinn, Rood, Shaw, Tanaga, Vong, Zane, Cynthy, Holliday, Irvine, Koga, Lankenau, Mendoza, Otis, Pavel, Rosse, Tseng, Volk, West, Yanez, Zibler, Carr, Dumont, Eld, Furey, Golightly, Hudson, Ilsa, Jerricho, Kisho, Lyon, Falcon');
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRasalhagueDominionPilots();
