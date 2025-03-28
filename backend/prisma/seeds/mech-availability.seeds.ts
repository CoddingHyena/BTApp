import { PrismaClient } from '@prisma/client';

// Интерфейс для записей доступности мехов
interface MechAvailabilityRecord {
  mechId: string;
  factionId: number;
  periodId: number;
  availabilityLevel: string;
  introducedYear: number;
  notes: string;
}

const prisma = new PrismaClient();

export async function seedMechAvailability(prismaClient: PrismaClient) {
  const client = prismaClient || prisma;
  
  try {
    // Очистка таблицы перед заполнением
    await client.mechAvailability.deleteMany({});

    // Получаем первые несколько мехов, фракций и периодов для демонстрационных данных
    const mechs = await client.mech.findMany({ take: 10 });
    const factions = await client.faction.findMany({ where: { isMajor: true } });
    const periods = await client.period.findMany();

    const availabilityLevels = ['common', 'uncommon', 'rare', 'very_rare', 'prototype'];

    // Создаем массив записей доступности с типизацией
    const availabilityRecords: MechAvailabilityRecord[] = [];

    // Для каждого меха создаем несколько записей с разными фракциями и периодами
    for (const mech of mechs) {
      // Определяем начальный период для меха на основе его года выпуска
      const startingPeriod = periods.find(p => 
        p.startYear <= mech.year && 
        (p.endYear === null || p.endYear >= mech.year)
      );

      if (!startingPeriod) continue;

      // Находим индекс начального периода
      const startPeriodIndex = periods.findIndex(p => p.id === startingPeriod.id);
      
      // Создаем записи доступности для этого меха для нескольких периодов и фракций
      for (const faction of factions) {
        // Проверяем, существует ли фракция в период создания меха
        if (faction.formationYear && faction.formationYear > mech.year) continue;
        if (faction.dissolutionYear && faction.dissolutionYear < mech.year) continue;
        
        // Определяем, в каких периодах мех доступен этой фракции
        for (let i = startPeriodIndex; i < periods.length; i++) {
          const period = periods[i];
          
          // Если фракция распалась до начала периода, пропускаем
          if (faction.dissolutionYear && faction.dissolutionYear < period.startYear) continue;
          
          // Если технология меха не соответствует фракции в текущий период, пропускаем
          // (упрощенно: предполагаем, что Кланы используют только Clan tech, а ВС - только IS tech)
          if (
            (faction.code.startsWith('C') && mech.technology === 'Inner Sphere') ||
            (!faction.code.startsWith('C') && mech.technology === 'Clan')
          ) {
            continue;
          }
          
          // Рандомно выбираем уровень доступности
          const availabilityLevel = availabilityLevels[Math.floor(Math.random() * availabilityLevels.length)];
          
          // Добавляем запись в массив
          availabilityRecords.push({
            mechId: mech.id,
            factionId: faction.id,
            periodId: period.id,
            availabilityLevel,
            introducedYear: mech.year,
            notes: `Auto-generated availability for ${mech.name} in ${faction.name} during ${period.name}.`
          });
        }
      }
    }

    // Вставляем все записи в базу данных
    console.log(`Creating ${availabilityRecords.length} mech availability records...`);
    
    for (const record of availabilityRecords) {
      try {
        await client.mechAvailability.create({
          data: record
        });
      } catch (error) {
        console.error(`Error creating record for mech ${record.mechId}, faction ${record.factionId}, period ${record.periodId}:`, error.message);
      }
    }
    
    console.log('Mech availability records seeded successfully');
  } catch (error) {
    console.error('Error seeding mech availability:', error);
    throw error;
  }
}

// Если файл запущен напрямую, а не импортирован
if (require.main === module) {
  seedMechAvailability(prisma)
    .catch((e) => {
      console.error('Error during seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}