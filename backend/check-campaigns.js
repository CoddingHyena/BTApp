const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCampaigns() {
  console.log('🔍 Проверяем все кампании...\n');

  try {
    // Получаем все кампании
    const campaigns = await prisma.campaign.findMany({
      include: {
        creator: {
          select: {
            username: true,
            email: true,
          },
        },
        players: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`✅ Найдено ${campaigns.length} кампаний:\n`);

    campaigns.forEach((campaign, index) => {
      console.log(`${index + 1}. Кампания: "${campaign.name}"`);
      console.log(`   ID: ${campaign.id}`);
      console.log(`   Создатель: ${campaign.creator.username} (${campaign.creator.email})`);
      console.log(`   Статус: ${campaign.status}`);
      console.log(`   Участников: ${campaign.players.length}`);
      
      if (campaign.players.length > 0) {
        console.log('   Участники:');
        campaign.players.forEach((player, playerIndex) => {
          console.log(`     ${playerIndex + 1}. ${player.player.username} - ${player.role} (${player.faction?.name || 'без фракции'})`);
        });
      } else {
        console.log('   ❌ Участников нет');
      }
      console.log('');
    });

    // Показываем рекомендации
    console.log('💡 Рекомендации:');
    if (campaigns.length === 0) {
      console.log('   - Создайте новую кампанию');
    } else {
      const campaignsWithPlayers = campaigns.filter(c => c.players.length > 0);
      if (campaignsWithPlayers.length > 0) {
        console.log(`   - Используйте кампанию "${campaignsWithPlayers[0].name}" (ID: ${campaignsWithPlayers[0].id}) для тестирования`);
      } else {
        console.log('   - Назначьте стратегов в любую из существующих кампаний');
      }
    }

  } catch (error) {
    console.error('❌ Ошибка при проверке кампаний:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCampaigns();
