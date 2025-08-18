# Позывные пилотов (Callsigns) в BTApp

## 🎯 Обзор

В BTApp добавлено поле `callsign` для пилотов кампаний. Позывной - это важная часть культуры BattleTech, которая отражает характер и стиль пилота.

## 📊 Структура данных

### Модель CampaignPilot

```prisma
model CampaignPilot {
  id              String              @id @default(uuid())
  campaignId      String
  factionId       Int
  name            String              // Имя пилота
  callsign        String              // Позывной пилота
  rank            FormationMemberRole @default(MEMBER)
  gunnery         Int                 // Навык стрельбы (3-7)
  piloting        Int                 // Навык пилотирования (4-8)
  // ... остальные поля
}
```

### Валидация

- Позывной обязателен при создании пилота
- Позывной должен быть уникальным в рамках кампании и фракции
- При обновлении пилота проверяется уникальность нового позывного

## 🎨 Категории позывных

### 1. WEAPON_THEMED (Оружие и боевые действия)
- Iron Fist, Thunder Hammer, Shadow Blade
- Death Ray, Storm Breaker, Fire Storm
- Подходит для: House Marik, агрессивных пилотов

### 2. ANIMAL_THEMED (Животные)
- Iron Wolf, Shadow Fox, Thunder Bear
- Steel Eagle, Fire Dragon, Ice Tiger
- Подходит для: House Kurita, пилотов-хищников

### 3. NATURE_THEMED (Природные явления)
- Thunder Storm, Fire Storm, Ice Storm
- Shadow Wind, Iron Rain, Steel Thunder
- Подходит для: House Liao, спокойных пилотов

### 4. MYTHOLOGICAL (Мифология и легенды)
- Iron Thor, Shadow Loki, Thunder Zeus
- Steel Odin, Fire Ares, Ice Athena
- Подходит для: House Steiner, традиционалистов

### 5. SPACE_THEMED (Космос и технологии)
- Iron Star, Shadow Nova, Thunder Comet
- Steel Nebula, Fire Meteor, Ice Asteroid
- Подходит для: House Liao, технократов

### 6. CHARACTER_THEMED (Эмоции и характер)
- Iron Will, Shadow Mind, Thunder Heart
- Steel Soul, Fire Spirit, Ice Blood
- Подходит для: House Davion, рыцарей

## 🔧 Использование

### Создание пилота с позывным

```typescript
import { getFactionThemedCallsign, getRandomCallsign } from './callsigns';

// Автоматический подбор позывного для фракции
const pilotData = {
  campaignId: 'camp-001',
  factionId: 1, // House Steiner
  name: 'Leutnant Hans Mueller',
  callsign: getFactionThemedCallsign('House Steiner'), // "Iron Thor"
  gunnery: 4,
  piloting: 5,
  // ... остальные поля
};

// Ручной выбор позывного
const pilotData2 = {
  campaignId: 'camp-001',
  factionId: 2, // House Davion
  name: 'Captain James Davion',
  callsign: 'Iron Will', // Ручной выбор
  gunnery: 3,
  piloting: 4,
  // ... остальные поля
};
```

### API Endpoints

```bash
# Создание пилота с позывным
POST /campaign-pilots
{
  "campaignId": "camp-001",
  "factionId": 1,
  "name": "Leutnant Hans Mueller",
  "callsign": "Iron Thor",
  "gunnery": 4,
  "piloting": 5,
  "alphaStrikeSkill": 3
}

# Обновление позывного
PATCH /campaign-pilots/:id
{
  "callsign": "Thunder Hammer"
}
```

## 🎮 Примеры использования в игре

### Сценарий 1: Создание элитного пилота
```typescript
const elitePilot = {
  name: 'Hauptmann Anna Schmidt',
  callsign: 'Iron Will', // Отражает силу характера
  gunnery: 3, // Отличный стрелок
  piloting: 4, // Хороший пилот
  rank: 'LANCE_LEADER'
};
```

### Сценарий 2: Пилот-новичок
```typescript
const rookiePilot = {
  name: 'Cadet Karl Weber',
  callsign: 'Storm Cloud', // Отражает неопределенность
  gunnery: 6, // Средний стрелок
  piloting: 7, // Средний пилот
  rank: 'MEMBER'
};
```

### Сценарий 3: Ветеран с историей
```typescript
const veteranPilot = {
  name: 'Major Sarah Johnson',
  callsign: 'Death Dealer', // Отражает боевой опыт
  gunnery: 2, // Отличный стрелок
  piloting: 3, // Отличный пилот
  rank: 'COMPANY_LEADER',
  experience: 500
};
```

## 🔍 Поиск и фильтрация

### Поиск по позывному
```typescript
// В сервисе можно добавить метод поиска
async findByCallsign(campaignId: string, callsign: string) {
  return this.prisma.campaignPilot.findFirst({
    where: {
      campaignId,
      callsign: { contains: callsign, mode: 'insensitive' }
    }
  });
}
```

### Группировка по категориям
```typescript
// Получение всех пилотов с позывными определенной категории
const weaponPilots = pilots.filter(pilot => 
  WEAPON_THEMED.includes(pilot.callsign)
);
```

## 🎯 Рекомендации по использованию

1. **Соответствие фракции**: Используйте позывные, соответствующие культуре фракции
2. **Характер пилота**: Позывной должен отражать личность и стиль пилота
3. **Боевой опыт**: Ветераны могут иметь более агрессивные позывные
4. **Уникальность**: Избегайте дублирования позывных в одной фракции
5. **Тематичность**: Поддерживайте общую тематику кампании

## 🚀 Расширение функциональности

### Возможные улучшения:
- Генерация позывных на основе достижений пилота
- Система "прозвищ" для пилотов с особыми заслугами
- Автоматическое изменение позывного после значимых событий
- Интеграция с системой достижений и наград
