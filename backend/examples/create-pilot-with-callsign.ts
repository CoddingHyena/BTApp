import { PrismaClient } from '@prisma/client';
import { getFactionThemedCallsign, getRandomCallsign } from '../src/modules/campaign-pilot/examples/callsigns';

const prisma = new PrismaClient();

async function createPilotWithCallsign() {
  try {
    // Пример создания пилота с автоматически подобранным позывным
    const pilotData = {
      campaignId: 'camp-001', // ID существующей кампании
      factionId: 1, // House Steiner
      firstName: 'Hans',
      lastName: 'Mueller',
      callsign: getFactionThemedCallsign('House Steiner'), // Автоматически подбираем позывной для Steiner
      rank: 'LANCE_LEADER' as const,
      gunnery: 4,
      piloting: 5,
      alphaStrikeSkill: 3,
      experience: 0,
      specialization: 'MECH' as const,
      cost: 1000
    };

    console.log('Создаем пилота с позывным:', pilotData.callsign);
    
    const pilot = await prisma.campaignPilot.create({
      data: pilotData,
      include: {
        campaign: true,
        faction: true
      }
    });

    console.log('Пилот создан:', {
      id: pilot.id,
      name: `${pilot.firstName} ${pilot.lastName}`,
      callsign: pilot.callsign,
      faction: pilot.faction.name,
      campaign: pilot.campaign.name
    });

    // Пример создания пилота с ручным указанием позывного
    const pilotData2 = {
      campaignId: 'camp-001',
      factionId: 2, // House Davion
      firstName: 'James',
      lastName: 'Davion',
      callsign: 'Iron Will', // Ручной выбор позывного
      rank: 'LANCE_LEADER' as const,
      gunnery: 3,
      piloting: 4,
      alphaStrikeSkill: 2,
      experience: 50,
      specialization: 'MECH' as const,
      cost: 1500
    };

    console.log('Создаем второго пилота с позывным:', pilotData2.callsign);
    
    const pilot2 = await prisma.campaignPilot.create({
      data: pilotData2,
      include: {
        campaign: true,
        faction: true
      }
    });

    console.log('Второй пилот создан:', {
      id: pilot2.id,
      name: `${pilot2.firstName} ${pilot2.lastName}`,
      callsign: pilot2.callsign,
      faction: pilot2.faction.name,
      campaign: pilot2.campaign.name
    });

    // Примеры различных позывных
    console.log('\nПримеры позывных по категориям:');
    console.log('Оружие:', getFactionThemedCallsign('House Marik'));
    console.log('Животные:', getFactionThemedCallsign('House Kurita'));
    console.log('Природа:', getFactionThemedCallsign('House Liao'));
    console.log('Случайный:', getRandomCallsign());

  } catch (error) {
    console.error('Ошибка при создании пилота:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем пример
createPilotWithCallsign();
