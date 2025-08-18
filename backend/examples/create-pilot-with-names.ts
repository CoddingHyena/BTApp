import { PrismaClient } from '@prisma/client';
import { generateCompletePilot, getFactionThemedName, generateFullPilotName } from '../src/modules/campaign-pilot/examples/names';
import { getFactionThemedCallsign } from '../src/modules/campaign-pilot/examples/callsigns';

const prisma = new PrismaClient();

async function createPilotWithNames() {
  try {
    console.log('🎮 Создание пилотов с автоматической генерацией имен и позывных\n');

    // Пример 1: Автоматическая генерация для House Steiner
    const steinerPilot = generateCompletePilot('House Steiner');
    console.log('🇩🇪 House Steiner пилот:');
    console.log(`   Имя: ${steinerPilot.firstName} ${steinerPilot.lastName}`);
    console.log(`   Позывной: ${steinerPilot.callsign}`);
    console.log(`   Полное имя: ${steinerPilot.fullName}`);
    console.log('');

    // Пример 2: Автоматическая генерация для House Kurita
    const kuritaPilot = generateCompletePilot('House Kurita');
    console.log('🇯🇵 House Kurita пилот:');
    console.log(`   Имя: ${kuritaPilot.firstName} ${kuritaPilot.lastName}`);
    console.log(`   Позывной: ${kuritaPilot.callsign}`);
    console.log(`   Полное имя: ${kuritaPilot.fullName}`);
    console.log('');

    // Пример 3: Автоматическая генерация для House Davion
    const davionPilot = generateCompletePilot('House Davion');
    console.log('🇺🇸 House Davion пилот:');
    console.log(`   Имя: ${davionPilot.firstName} ${davionPilot.lastName}`);
    console.log(`   Позывной: ${davionPilot.callsign}`);
    console.log(`   Полное имя: ${davionPilot.fullName}`);
    console.log('');

    // Пример 4: Автоматическая генерация для House Liao
    const liaoPilot = generateCompletePilot('House Liao');
    console.log('🇨🇳 House Liao пилот:');
    console.log(`   Имя: ${liaoPilot.firstName} ${liaoPilot.lastName}`);
    console.log(`   Позывной: ${liaoPilot.callsign}`);
    console.log(`   Полное имя: ${liaoPilot.fullName}`);
    console.log('');

    // Пример 5: Автоматическая генерация для House Marik
    const marikPilot = generateCompletePilot('House Marik');
    console.log('🇮🇹 House Marik пилот:');
    console.log(`   Имя: ${marikPilot.firstName} ${marikPilot.lastName}`);
    console.log(`   Позывной: ${marikPilot.callsign}`);
    console.log(`   Полное имя: ${marikPilot.fullName}`);
    console.log('');

    // Пример 6: Ручная генерация с кастомным позывным
    const { firstName, lastName } = getFactionThemedName('House Steiner');
    const customCallsign = 'Iron Fist';
    const customPilot = {
      firstName,
      lastName,
      callsign: customCallsign,
      fullName: generateFullPilotName(firstName, lastName, customCallsign, 'Leutnant')
    };
    
    console.log('⚔️ Кастомный пилот (Steiner с ручным позывным):');
    console.log(`   Звание: Leutnant`);
    console.log(`   Имя: ${customPilot.firstName} ${customPilot.lastName}`);
    console.log(`   Позывной: ${customPilot.callsign}`);
    console.log(`   Полное имя: ${customPilot.fullName}`);
    console.log('');

    // Пример 7: Создание пилота в базе данных
    const pilotData = {
      campaignId: 'camp-001', // ID существующей кампании
      factionId: 1, // House Steiner
      firstName: steinerPilot.firstName,
      lastName: steinerPilot.lastName,
      callsign: steinerPilot.callsign,
      rank: 'LANCE_LEADER' as const,
      gunnery: 4,
      piloting: 5,
      alphaStrikeSkill: 3,
      experience: 0,
      specialization: 'MECH' as const,
      cost: 1000
    };

    console.log('💾 Создание пилота в базе данных:');
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
      faction: pilot.faction.name,
      campaign: pilot.campaign.name
    });
    */

    // Примеры различных культур
    console.log('🌍 Примеры имен по культурам:');
    console.log('German:', getFactionThemedName('House Steiner'));
    console.log('Japanese:', getFactionThemedName('House Kurita'));
    console.log('Chinese:', getFactionThemedName('House Liao'));
    console.log('Anglo-Saxon:', getFactionThemedName('House Davion'));
    console.log('Mediterranean:', getFactionThemedName('House Marik'));
    console.log('Russian:', getFactionThemedName('Periphery'));
    console.log('Indian:', getFactionThemedName('Clan Wolf'));

  } catch (error) {
    console.error('❌ Ошибка при создании пилота:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем пример
createPilotWithNames();
