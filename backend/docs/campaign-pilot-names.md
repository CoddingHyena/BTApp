# Система имен пилотов в BTApp

## 🎯 Обзор

В BTApp реализована система автоматической генерации имен и фамилий пилотов в соответствии с культурой фракций BattleTech. Система поддерживает 7 культурных категорий с более чем 400 уникальными именами и фамилиями.

## 📊 Структура данных

### Обновленная модель CampaignPilot

```prisma
model CampaignPilot {
  id              String              @id @default(uuid())
  campaignId      String
  factionId       Int
  firstName       String              // Имя пилота
  lastName        String              // Фамилия пилота
  callsign        String              // Позывной пилота
  rank            FormationMemberRole @default(MEMBER)
  gunnery         Int                 // Навык стрельбы (3-7)
  piloting        Int                 // Навык пилотирования (4-8)
  // ... остальные поля
}
```

### Валидация

- Имя и фамилия обязательны при создании пилота
- Комбинация имени и фамилии должна быть уникальной в рамках кампании и фракции
- Позывной должен быть уникальным в рамках кампании и фракции

## 🌍 Культурные категории имен

### 1. GERMAN (House Steiner/Lyran Commonwealth)
- **Имена**: Hans, Klaus, Wolfgang, Anna, Greta, Helena
- **Фамилии**: Mueller, Schmidt, Weber, Meyer, Wagner
- **Характеристика**: Немецкие/европейские имена, отражающие военную традицию

### 2. JAPANESE (House Kurita/Draconis Combine)
- **Имена**: Takeshi, Kenji, Hiroshi, Akiko, Aya, Chie
- **Фамилии**: Yamamoto, Tanaka, Sato, Watanabe, Ito
- **Характеристика**: Японские имена, отражающие самурайскую культуру

### 3. CHINESE (House Liao/Capellan Confederation)
- **Имена**: Wei, Li, Zhang, Xia, Ling, Mei
- **Фамилии**: Li, Wang, Zhang, Liu, Chen, Yang
- **Характеристика**: Китайские имена, отражающие конфуцианскую традицию

### 4. ANGLO_SAXON (House Davion/Federated Suns)
- **Имена**: James, John, Robert, Sarah, Jennifer, Jessica
- **Фамилии**: Smith, Johnson, Williams, Brown, Jones
- **Характеристика**: Англо-саксонские имена, отражающие рыцарскую традицию

### 5. MEDITERRANEAN (House Marik/Free Worlds League)
- **Имена**: Marco, Giuseppe, Antonio, Sofia, Giulia, Alessia
- **Фамилии**: Rossi, Ferrari, Russo, Bianchi, Romano
- **Характеристика**: Средиземноморские имена, отражающие торговую культуру

### 6. RUSSIAN (Periphery/Outer Worlds)
- **Имена**: Ivan, Dmitri, Sergei, Natasha, Elena, Olga
- **Фамилии**: Ivanov, Petrov, Sidorov, Smirnov, Popov
- **Характеристика**: Русские/славянские имена, отражающие периферийную культуру

### 7. INDIAN (Clan/Deep Periphery)
- **Имена**: Arjun, Vikram, Raj, Priya, Meera, Anjali
- **Фамилии**: Patel, Singh, Kumar, Sharma, Verma
- **Характеристика**: Индийские имена, отражающие клановую культуру

## 🔧 Использование

### Автоматическая генерация полного пилота

```typescript
import { generateCompletePilot } from './names';

// Автоматическая генерация для любой фракции
const steinerPilot = generateCompletePilot('House Steiner');
console.log(steinerPilot);
// {
//   firstName: "Hans",
//   lastName: "Mueller", 
//   callsign: "Iron Thor",
//   fullName: "Hans Mueller 'Iron Thor'"
// }
```

### Генерация имен по культуре

```typescript
import { getFactionThemedName } from './names';

// Получение имени по фракции
const { firstName, lastName } = getFactionThemedName('House Kurita');
// firstName: "Takeshi", lastName: "Yamamoto"

// Получение имени из конкретной культуры
const { firstName, lastName } = getRandomName('JAPANESE');
```

### Генерация полного имени с званием

```typescript
import { generateFullPilotName } from './names';

const fullName = generateFullPilotName('Hans', 'Mueller', 'Iron Thor', 'Leutnant');
// "Leutnant Hans Mueller 'Iron Thor'"
```

## 🎮 Примеры использования в игре

### Сценарий 1: Создание элитного пилота Steiner
```typescript
const elitePilot = generateCompletePilot('House Steiner');
// Результат: "Leutnant Hans Mueller 'Iron Thor'"
```

### Сценарий 2: Создание пилота Kurita с кастомным позывным
```typescript
const { firstName, lastName } = getFactionThemedName('House Kurita');
const customPilot = {
  firstName, // "Takeshi"
  lastName,  // "Yamamoto"
  callsign: 'Shadow Blade',
  fullName: generateFullPilotName(firstName, lastName, 'Shadow Blade', 'Tai-i')
};
// Результат: "Tai-i Takeshi Yamamoto 'Shadow Blade'"
```

### Сценарий 3: Создание пилота Davion
```typescript
const davionPilot = generateCompletePilot('House Davion');
// Результат: "Captain James Smith 'Iron Will'"
```

## 🔍 API Endpoints

### Создание пилота с автоматической генерацией

```bash
POST /campaign-pilots
{
  "campaignId": "camp-001",
  "factionId": 1,
  "firstName": "Hans",
  "lastName": "Mueller", 
  "callsign": "Iron Thor",
  "gunnery": 4,
  "piloting": 5,
  "alphaStrikeSkill": 3
}
```

### Обновление имени пилота

```bash
PATCH /campaign-pilots/:id
{
  "firstName": "Klaus",
  "lastName": "Schmidt",
  "callsign": "Thunder Hammer"
}
```

## 🎯 Рекомендации по использованию

1. **Соответствие культуре**: Используйте имена, соответствующие культуре фракции
2. **Уникальность**: Избегайте дублирования полных имен в одной фракции
3. **Звания**: Добавляйте звания при отображении полных имен
4. **Позывные**: Позывные должны отражать характер и достижения пилота
5. **Наследование**: Рассмотрите систему наследования фамилий для династий

## 🚀 Расширение функциональности

### Возможные улучшения:
- Система наследования фамилий
- Генерация имен на основе достижений
- Система "легендарных" фамилий
- Интеграция с системой званий
- Автоматическое изменение позывных после событий

### Примеры будущих функций:
```typescript
// Система династий
const dynastyPilot = generateDynastyPilot('House Steiner', 'Mueller');

// Легендарные пилоты
const legendaryPilot = generateLegendaryPilot('House Davion', 'Davion');

// Пилоты с достижениями
const acePilot = generateAcePilot('House Kurita', 5); // 5 побед
```

## 📈 Статистика

- **Всего имен**: 224 (32 имени × 7 культур)
- **Всего фамилий**: 224 (32 фамилии × 7 культур)
- **Всего позывных**: 440 (40 позывных × 11 категорий)
- **Возможных комбинаций**: 50,176,000 уникальных пилотов

Эта система обеспечивает практически неограниченное разнообразие пилотов для любых кампаний! 🎮⚔️
