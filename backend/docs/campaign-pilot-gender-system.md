# Система генерации пилотов с поддержкой половых различий

## 🎯 Обзор

Система генерации пилотов в BTApp была расширена для поддержки половых различий в именах и фамилиях, особенно для культур с грамматическими различиями (например, русские фамилии).

## 🌍 Поддерживаемые культуры

### Культуры с половыми различиями:
- **RUSSIAN**: Полное разделение мужских и женских имен/фамилий
  - Мужские: Иван Иванов
  - Женские: Наташа Иванова

### Культуры без половых различий:
- **GERMAN**: Единые списки имен и фамилий
- **JAPANESE**: Единые списки имен и фамилий
- **CHINESE**: Единые списки имен и фамилий
- **ANGLO_SAXON**: Единые списки имен и фамилий
- **MEDITERRANEAN**: Единые списки имен и фамилий
- **INDIAN**: Единые списки имен и фамилий

## 🔧 Основные функции

### Генерация пилотов

#### `generateCompletePilot(factionName: string, callsign?: string)`
Автоматическая генерация пилота с случайным полом.

```typescript
const pilot = generateCompletePilot('House Steiner');
// {
//   firstName: "Hans",
//   lastName: "Mueller",
//   gender: "male",
//   callsign: "Iron Thor",
//   fullName: "Hans Mueller 'Iron Thor'"
// }
```

#### `generateCompletePilotWithGender(factionName: string, gender: Gender, callsign?: string)`
Генерация пилота с заданным полом.

```typescript
const femalePilot = generateCompletePilotWithGender('House Kurita', 'female');
// {
//   firstName: "Akiko",
//   lastName: "Yamamoto",
//   gender: "female",
//   callsign: "Storm Surge",
//   fullName: "Akiko Yamamoto 'Storm Surge'"
// }
```

### Перегенерация

#### `regeneratePilot(factionName: string, callsign?: string)`
Полная перегенерация пилота (новый пол, новое имя).

#### `regeneratePilotName(factionName: string, currentGender: Gender, callsign?: string)`
Перегенерация только имени с сохранением пола.

### Валидация

#### `validateGenderNameCombination(firstName: string, lastName: string, gender: Gender, culture: CultureKey)`
Проверка корректности комбинации пола и имени.

```typescript
// Корректно
validateGenderNameCombination('Ivan', 'Ivanov', 'male', 'RUSSIAN'); // true

// Некорректно
validateGenderNameCombination('Ivan', 'Ivanova', 'male', 'RUSSIAN'); // false
```

#### `getGenderFromName(firstName: string, culture: CultureKey)`
Определение пола по имени (только для культур с различиями).

```typescript
getGenderFromName('Ivan', 'RUSSIAN'); // 'male'
getGenderFromName('Natasha', 'RUSSIAN'); // 'female'
getGenderFromName('Hans', 'GERMAN'); // null (неопределимо)
```

## 🗄️ База данных

### Обновленная модель CampaignPilot

```prisma
model CampaignPilot {
  id              String              @id @default(uuid())
  campaignId      String
  factionId       Int
  firstName       String              // Имя пилота
  lastName        String              // Фамилия пилота
  callsign        String              // Позывной пилота
  gender          Gender              @default(MALE) // Пол пилота
  // ... остальные поля
}

enum Gender {
  MALE
  FEMALE
}
```

### DTO обновления

```typescript
export class CreateCampaignPilotDto {
  // ... существующие поля
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender; // Пол пилота
}
```

## 🚀 API эндпоинты

### Генерация данных пилота

#### `POST /campaign-pilots/generate`
Генерирует данные пилота для указанной фракции.

**Запрос:**
```json
{
  "factionName": "House Steiner",
  "gender": "female" // опционально
}
```

**Ответ:**
```json
{
  "firstName": "Anna",
  "lastName": "Mueller",
  "gender": "female",
  "callsign": "Iron Thor",
  "fullName": "Anna Mueller 'Iron Thor'"
}
```

#### `POST /campaign-pilots/regenerate`
Перегенерирует данные пилота.

**Запрос:**
```json
{
  "factionName": "House Kurita",
  "currentGender": "male" // опционально, для сохранения пола
}
```

### Валидация

#### `POST /campaign-pilots/validate-name`
Проверяет корректность комбинации имени и пола.

**Запрос:**
```json
{
  "firstName": "Ivan",
  "lastName": "Ivanov",
  "gender": "male",
  "factionName": "Periphery"
}
```

**Ответ:**
```json
true // или false
```

#### `POST /campaign-pilots/get-gender-from-name`
Определяет пол по имени.

**Запрос:**
```json
{
  "firstName": "Ivan",
  "factionName": "Periphery"
}
```

**Ответ:**
```json
"male" // или "female" или null
```

## 🔄 Миграция данных

### Скрипт миграции

Для обновления существующих пилотов используйте скрипт:

```bash
npx ts-node scripts/migrate-pilot-genders.ts
```

Скрипт:
1. Определяет пол по имени для каждого пилота
2. Проверяет корректность комбинаций
3. Исправляет некорректные комбинации
4. Добавляет поле `gender` в базу данных

### Примеры миграции

```typescript
// До миграции
{
  firstName: "Ivan",
  lastName: "Ivanova", // Некорректно для мужчины
  gender: null
}

// После миграции
{
  firstName: "Ivan",
  lastName: "Ivanov", // Исправлено
  gender: "MALE"
}
```

## 🎮 Пользовательский интерфейс

### Рекомендуемый UX

1. **Создание пилота:**
   - Автоматическая генерация с случайным полом
   - Кнопка "Перегенерировать" для полной перегенерации
   - Кнопка "Только имя" для перегенерации имени с сохранением пола

2. **Визуальные индикаторы:**
   - Иконка пола рядом с именем пилота
   - Цветовая кодировка (опционально)
   - Фильтрация по полу в списках

3. **Валидация в реальном времени:**
   - Проверка корректности при вводе имени
   - Подсказки при некорректных комбинациях

## 📊 Статистика

### Возможные комбинации:
- **Культур с различиями**: 1,024 (32 × 32)
- **Культур без различий**: 1,024 (32 × 32)
- **Общее количество**: 7,168 комбинаций

### Точность валидации:
- **Русские имена**: 100% (полное разделение)
- **Другие культуры**: 100% (все комбинации допустимы)

## 🔮 Планы развития

1. **Добавление новых культур:**
   - Украинские имена
   - Белорусские имена
   - Польские имена

2. **Расширенные функции:**
   - Система наследования фамилий
   - Автоматическое изменение позывных
   - Интеграция с системой достижений

3. **Персонализация:**
   - Пользовательские имена и позывные
   - Настройка соотношения полов по фракциям
   - Голосовые актеры

## 🐛 Известные ограничения

1. **Определение пола по имени** работает только для культур с различиями
2. **Трансформация фамилий** поддерживается только для русских фамилий
3. **Смешанные культуры** могут требовать дополнительной настройки

## 📝 Примеры использования

### Создание пилота в коде

```typescript
import { generateCompletePilotWithGender } from './names';

// Создание женского пилота для House Steiner
const steinerPilot = generateCompletePilotWithGender('House Steiner', 'female');

// Создание мужского пилота для Periphery (русские имена)
const peripheryPilot = generateCompletePilotWithGender('Periphery', 'male');

console.log(steinerPilot.fullName); // "Anna Mueller 'Iron Thor'"
console.log(peripheryPilot.fullName); // "Ivan Ivanov 'Thunder Bear'"
```

### Валидация в форме

```typescript
import { validateGenderNameCombination } from './names';

const isValid = validateGenderNameCombination('Ivan', 'Ivanova', 'male', 'RUSSIAN');
if (!isValid) {
  showError('Некорректная комбинация имени и пола');
}
```

---

**💡 Совет**: Всегда используйте функции генерации вместо ручного ввода имен для обеспечения корректности и соответствия лору BattleTech.
