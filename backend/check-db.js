const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Проверяем базу данных...\n');

  try {
    // 1. Проверяем кампанию
    const campaignId = '57740924-cc35-4725-8aca-756983045c29';
    console.log('1️⃣ Проверяем кампанию:', campaignId);
    
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        players: {
          include: {
            player: true,
            faction: true,
          },
        },
      },
    });

    if (campaign) {
      console.log('✅ Кампания найдена:', campaign.name);
      console.log(`   Участников в кампании: ${campaign.players.length}`);
      
      if (campaign.players.length > 0) {
        console.log('   Участники:');
        campaign.players.forEach((player, index) => {
          console.log(`   ${index + 1}. ${player.player.username} - ${player.role} (${player.faction?.name || 'без фракции'})`);
        });
      } else {
        console.log('   ❌ Участников нет');
      }
    } else {
      console.log('❌ Кампания не найдена');
    }

    console.log('');

    // 2. Проверяем всех пользователей
    console.log('2️⃣ Проверяем всех пользователей');
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    console.log(`✅ Найдено ${users.length} активных пользователей:`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} (${user.email}) - ${user.role}`);
    });

    console.log('');

    // 3. Проверяем все записи CampaignPlayer
    console.log('3️⃣ Проверяем все записи CampaignPlayer');
    const allCampaignPlayers = await prisma.campaignPlayer.findMany({
      include: {
        player: {
          select: {
            username: true,
            email: true,
          },
        },
        faction: {
          select: {
            name: true,
          },
        },
        campaign: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`✅ Найдено ${allCampaignPlayers.length} записей CampaignPlayer:`);
    allCampaignPlayers.forEach((player, index) => {
      console.log(`   ${index + 1}. ${player.player.username} в кампании "${player.campaign.name}" - ${player.role} (${player.faction?.name || 'без фракции'})`);
    });

    console.log('');

    // 4. Проверяем конкретную кампанию через CampaignPlayer
    console.log('4️⃣ Проверяем участников конкретной кампании через CampaignPlayer');
    const campaignPlayers = await prisma.campaignPlayer.findMany({
      where: {
        campaignId: campaignId,
      },
      include: {
        player: {
          select: {
            username: true,
            email: true,
          },
        },
        faction: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`✅ Найдено ${campaignPlayers.length} участников в кампании ${campaignId}:`);
    if (campaignPlayers.length > 0) {
      campaignPlayers.forEach((player, index) => {
        console.log(`   ${index + 1}. ${player.player.username} (${player.player.email}) - ${player.role} (${player.faction?.name || 'без фракции'})`);
      });
    } else {
      console.log('   ❌ Участников нет');
    }

  } catch (error) {
    console.error('❌ Ошибка при проверке базы данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
