# Backend Service - Основной микросервис BTApp

## 📋 Описание

Backend Service - это основной микросервис системы BTApp, отвечающий за управление игровыми данными, включая фракции, игры, периоды, мехи, миссии и их доступность. Сервис предоставляет REST API для работы с игровым контентом и интегрируется с Auth Service для аутентификации пользователей.

## 🏗️ Архитектура

### Технологический стек:
- **NestJS** - основной фреймворк
- **TypeScript** - язык программирования
- **Prisma ORM** - работа с базой данных
- **PostgreSQL** - база данных
- **Multer** - загрузка файлов
- **class-validator** - валидация данных
- **Swagger** - документация API
- **JWT** - интеграция с Auth Service

### Структура проекта:
```
backend/
├── src/
│   ├── modules/              # Модули приложения
│   │   ├── factions/         # Управление фракциями
│   │   │   ├── faction.controller.ts
│   │   │   ├── faction.service.ts
│   │   │   ├── faction.module.ts
│   │   │   ├── faction-upload.controller.ts
│   │   │   └── dto/
│   │   │       ├── create-faction.dto.ts
│   │   │       └── update-faction.dto.ts
│   │   ├── game/             # Управление играми
│   │   │   ├── game.controller.ts
│   │   │   ├── game.service.ts
│   │   │   ├── game.module.ts
│   │   │   ├── game-upload.controller.ts
│   │   │   └── dto/
│   │   │       ├── create-game.dto.ts
│   │   │       └── update-game.dto.ts
│   │   ├── period/           # Управление периодами
│   │   │   ├── period.controller.ts
│   │   │   ├── period.service.ts
│   │   │   ├── periods.module.ts
│   │   │   └── dto/
│   │   │       ├── create-period.dto.ts
│   │   │       └── update-period.dto.ts
│   │   ├── mech/             # Управление мехами
│   │   │   ├── mech.controller.ts
│   │   │   ├── mech.service.ts
│   │   │   ├── mech.module.ts
│   │   │   └── dto/
│   │   │       ├── create-mech.dto.ts
│   │   │       └── update-mech.dto.ts
│   │   ├── mech-availability/ # Доступность мехов
│   │   │   ├── mech-availability.controller.ts
│   │   │   ├── mech-availability.service.ts
│   │   │   ├── mech-availability.module.ts
│   │   │   └── dto/
│   │   │       ├── create-mech-availability.dto.ts
│   │   │       └── update-mech-availability.dto.ts
│   │   ├── mission/          # Управление миссиями
│   │   │   ├── mission.controller.ts
│   │   │   ├── mission.service.ts
│   │   │   ├── mission.module.ts
│   │   │   ├── mission-upload.controller.ts
│   │   │   └── dto/
│   │   │       ├── create-mission.dto.ts
│   │   │       └── update-mission.dto.ts
│   │   ├── raw-mech/         # Валидация сырых данных мехов
│   │   │   ├── raw-mech.controller.ts
│   │   │   ├── raw-mech.service.ts
│   │   │   ├── raw-mech.module.ts
│   │   │   └── dto/
│   │   │       ├── update-raw-mech.dto.ts
│   │   │       └── validate-raw-mech.dto.ts
│   │   └── csv_download/     # Экспорт данных в CSV
│   │       ├── csv-download.controller.ts
│   │       ├── csv-download.service.ts
│   │       ├── csv-download.module.ts
│   │       ├── dto/
│   │       │   ├── csv-download-request.dto.ts
│   │       │   └── csv-download-result.dto.ts
│   │       ├── interfaces/
│   │       │   ├── csv-download-options.interface.ts
│   │       │   └── raw-mech-csv-record.interface.ts
│   │       └── utils/
│   │           └── csv-parser.util.ts
│   ├── auth/                 # Интеграция с Auth Service
│   │   ├── auth.guard.ts     # Гвард аутентификации
│   │   ├── auth.module.ts    # Модуль аутентификации
│   │   ├── roles.guard.ts    # Гвард ролей
│   │   └── decorators/
│   │       └── roles.decorator.ts
│   ├── prisma/               # Работа с базой данных
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.controller.ts      # Основной контроллер
│   ├── app.service.ts        # Основной сервис
│   ├── app.module.ts         # Корневой модуль
│   └── main.ts               # Точка входа
├── prisma/                   # Схема и миграции БД
│   ├── schema.prisma         # Схема базы данных
│   ├── migrations/           # Миграции
│   └── seeds/                # Сиды данных
│       ├── faction.seeds.ts  # Сиды фракций
│       ├── game.seeds.ts     # Сиды игр
│       ├── period.seeds.ts   # Сиды периодов
│       ├── mech-availability.seeds.ts # Сиды доступности
│       └── mech.seeds.ts     # Сиды мехов
├── uploads/                  # Загруженные файлы
│   ├── factions/             # Изображения фракций
│   │   ├── logos/           # Логотипы фракций
│   │   └── banners/         # Баннеры фракций
│   ├── games/               # Изображения игр
│   │   ├── icons/           # Иконки игр
│   │   └── banners/         # Баннеры игр
│   ├── periods/             # Изображения периодов
│   │   ├── images/          # Иконки периодов
│   │   └── banners/         # Баннеры периодов
│   └── missions/            # Изображения миссий
│       └── deployments/     # Схемы расстановки
├── scripts/                 # Вспомогательные скрипты
│   ├── faction-logos-base64.js
│   └── update-faction-seeds-with-logos.js
└── public/                  # Статические файлы
    └── uploads/             # Публичные загрузки
```

## 🎮 Функциональность

### Управление фракциями:
- **CRUD операции** - создание, чтение, обновление, удаление фракций
- **Загрузка изображений** - логотипы и баннеры фракций
- **Фильтрация** - по играм, статусу активности
- **Связи с играми** - привязка фракций к играм
- **Исторические данные** - годы формирования и роспуска

### Управление играми:
- **CRUD операции** - создание, чтение, обновление, удаление игр
- **Загрузка изображений** - иконки и баннеры игр
- **Категоризация** - тактические, стратегические, RPG игры
- **Сортировка** - порядок отображения игр

### Управление периодами:
- **CRUD операции** - создание, чтение, обновление, удаление периодов
- **Исторические данные** - годы начала и окончания периодов
- **Загрузка изображений** - иконки и баннеры периодов
- **Сортировка** - хронологический порядок периодов

### Управление мехами:
- **CRUD операции** - создание, чтение, обновление, удаление мехов
- **Технические характеристики** - тоннаж, боевая ценность, стоимость
- **Валидация данных** - проверка корректности характеристик
- **Связи с периодами** - доступность мехов по периодам

### Управление доступностью мехов:
- **Связи мех-фракция-период** - доступность конкретных мехов
- **Уровни доступности** - Common, Uncommon, Rare, Unique
- **Исторические данные** - год введения меха
- **Примечания** - дополнительная информация

### Управление миссиями:
- **CRUD операции** - создание, чтение, обновление, удаление миссий
- **Типы миссий** - Classic, Alpha Strike
- **Сложность** - Easy, Medium, Hard
- **Warchest система** - стоимость и награды миссий
- **Загрузка схем** - схемы расстановки для миссий

### Валидация сырых данных:
- **Импорт CSV** - загрузка данных мехов из CSV файлов
- **Валидация** - проверка корректности данных
- **Преобразование** - конвертация в валидные записи мехов
- **Обработка ошибок** - детальная отчетность о проблемах

### Экспорт данных:
- **CSV экспорт** - выгрузка данных в CSV формат
- **Фильтрация** - выборка данных по критериям
- **Настройка полей** - выбор экспортируемых полей
- **Форматирование** - настройка формата данных

## 🗄️ Модель данных

### Faction (Фракция):
```typescript
model Faction {
  id             Int      @id @default(autoincrement())
  name           String   @unique
  code           String   @unique
  primaryColor   String?  // HEX код основного цвета
  secondaryColor String?  // HEX код вторичного цвета
  formationYear  Int?     // Год формирования фракции
  dissolutionYear Int?    // Год роспуска фракции
  description    String?  @db.Text
  logoUrl        String?  // Путь к логотипу
  bannerUrl      String?  // Путь к баннеру
  gameIdRef      String?  // Ссылка на игру
  game           Game?    @relation(fields: [gameIdRef], references: [id])
  isMajor        Boolean  @default(false) // Основная фракция
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  mechAvailabilities MechAvailability[]
}
```

### Game (Игра):
```typescript
model Game {
  id          String       @id @default(uuid())
  name        String       @unique
  description String?      @db.Text
  category    GameCategory // Тип игры
  iconUrl     String?      // Путь к иконке
  bannerUrl   String?      // Путь к баннеру
  isActive    Boolean      @default(true)
  sortOrder   Int          @unique
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  factions    Faction[]
}
```

### Period (Период):
```typescript
model Period {
  id             Int      @id @default(autoincrement())
  name           String   @unique
  code           String   @unique
  startYear      Int
  endYear        Int?     // null для текущих периодов
  sortOrder      Int      @unique
  description    String?  @db.Text
  imageUrl       String?  // Путь к изображению
  bannerUrl      String?  // Путь к баннеру
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  mechAvailabilities MechAvailability[]
}
```

### Mech (Мех):
```typescript
model Mech {
  id          String   @id @default(uuid())
  dbId        Int      @unique
  name        String
  unitType    String
  technology  String
  chassis     String
  era         String
  year        Int
  rulesLevel  String
  tonnage     Float
  battleValue Int
  pointValue  Int
  cost        Float?
  rating      String?
  designer    String?
  alphaCard   String?  // Ссылка на Alpha Strike карточку
  recSheet    String?  // Ссылка на Record Sheet
  vid         String?  // Ссылка на видео
  rawMechId   String?
  rawMech     RawMech? @relation(fields: [rawMechId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  availabilities MechAvailability[]
}
```

### MechAvailability (Доступность меха):
```typescript
model MechAvailability {
  id                String    @id @default(uuid())
  mechId            String
  mech              Mech      @relation(fields: [mechId], references: [id])
  factionId         Int
  periodId          Int
  availabilityLevel String    // Common, Uncommon, Rare, Unique
  introducedYear    Int?
  notes             String?   @db.Text
  faction           Faction   @relation(fields: [factionId], references: [id])
  period            Period    @relation(fields: [periodId], references: [id])
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  @@unique([mechId, factionId, periodId])
}
```

### Mission (Миссия):
```typescript
model Mission {
  id             String    @id @default(uuid())
  code           String    @unique // BT-XXX
  title          String
  description    String?   @db.Text
  objectives     String[]  // Основные задачи
  type           MissionType
  difficulty     MissionDifficulty
  deploymentUrl  String?   // Схема расстановки
  cost           Int?      @default(0) // Warchest Points
  reward         Json?     // { points: Int, bonuses: String[] }
  source         String?   // Источник
  isOfficial     Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
```

### RawMech (Сырые данные меха):
```typescript
model RawMech {
  id          String   @id @default(uuid())
  dbId        Int      @unique
  name        String
  unitType    String
  technology  String
  chassis     String
  era         String
  year        Int
  rulesLevel  String
  tonnage     Float
  battleValue Int
  pointValue  Int
  cost        Float?
  rating      String?
  designer    String?
  validated   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  mechs       Mech[]
}
```

## 🚀 API Endpoints

### Фракции:
- `GET /factions` - Получение списка фракций
- `GET /factions/:id` - Получение фракции по ID
- `POST /factions` - Создание фракции
- `PATCH /factions/:id` - Обновление фракции
- `DELETE /factions/:id` - Удаление фракции
- `POST /factions/upload/logo` - Загрузка логотипа фракции
- `POST /factions/upload/banner` - Загрузка баннера фракции

### Игры:
- `GET /games` - Получение списка игр
- `GET /games/:id` - Получение игры по ID
- `POST /games` - Создание игры
- `PATCH /games/:id` - Обновление игры
- `DELETE /games/:id` - Удаление игры
- `POST /games/upload/icon` - Загрузка иконки игры
- `POST /games/upload/banner` - Загрузка баннера игры

### Периоды:
- `GET /periods` - Получение списка периодов
- `GET /periods/:id` - Получение периода по ID
- `POST /periods` - Создание периода
- `PATCH /periods/:id` - Обновление периода
- `DELETE /periods/:id` - Удаление периода

### Мехи:
- `GET /mechs` - Получение списка мехов
- `GET /mechs/:id` - Получение меха по ID
- `POST /mechs` - Создание меха
- `PATCH /mechs/:id` - Обновление меха
- `DELETE /mechs/:id` - Удаление меха

### Доступность мехов:
- `GET /mech-availability` - Получение списка доступностей
- `GET /mech-availability/:id` - Получение доступности по ID
- `POST /mech-availability` - Создание доступности
- `PATCH /mech-availability/:id` - Обновление доступности
- `DELETE /mech-availability/:id` - Удаление доступности

### Миссии:
- `GET /missions` - Получение списка миссий
- `GET /missions/:id` - Получение миссии по ID
- `POST /missions` - Создание миссии
- `PATCH /missions/:id` - Обновление миссии
- `DELETE /missions/:id` - Удаление миссии
- `POST /missions/upload/deployment` - Загрузка схемы расстановки

### Сырые данные мехов:
- `GET /raw-mechs` - Получение списка сырых данных
- `GET /raw-mechs/:id` - Получение сырых данных по ID
- `PATCH /raw-mechs/:id` - Обновление сырых данных
- `POST /raw-mechs/validate` - Валидация сырых данных

### Экспорт данных:
- `POST /csv-download` - Экспорт данных в CSV

## 🔧 Установка и запуск

### Предварительные требования:
- Node.js 18+
- PostgreSQL 12+
- npm или yarn

### Установка зависимостей:
```bash
npm install
```

### Настройка базы данных:
1. Создайте базу данных PostgreSQL
2. Настройте переменную окружения `DATABASE_URL` в `.env`
3. Выполните миграции:
```bash
npm run prisma:migrate
```

### Заполнение базы данных:
```bash
npm run prisma:seed
```

### Запуск в режиме разработки:
```bash
npm run start:dev
```

### Сборка и запуск в продакшене:
```bash
npm run build
npm run start:prod
```

## ⚙️ Конфигурация

### Переменные окружения (.env):
```env
# База данных
DATABASE_URL="postgresql://username:password@localhost:5432/btapp_db"

# Порт сервера
PORT=3001

# Интеграция с Auth Service
AUTH_SERVICE_URL="http://localhost:3002"
JWT_SECRET="your-jwt-secret"

# Загрузка файлов
UPLOAD_DEST="./uploads"
MAX_FILE_SIZE=5242880 # 5MB
```

### Настройки загрузки файлов:
- **Максимальный размер файла** - 5MB
- **Поддерживаемые форматы** - PNG, JPG, JPEG, GIF
- **Автоматическое создание папок** для загрузок
- **Валидация файлов** - проверка типа и размера

## 🔒 Безопасность

### Аутентификация:
- **Интеграция с Auth Service** - проверка JWT токенов
- **Роли пользователей** - PLAYER, MODERATOR, ADMIN
- **Защищенные эндпоинты** - требующие аутентификации
- **CORS настройки** - для взаимодействия с фронтендом

### Валидация данных:
- **class-validator** для проверки входных данных
- **Автоматическая санитизация** данных
- **Строгая типизация** с TypeScript
- **Проверка файлов** - валидация загружаемых изображений

### Обработка ошибок:
- **Структурированные ошибки** с детальной информацией
- **Логирование ошибок** для отладки
- **Graceful degradation** - корректная обработка сбоев

## 📊 Мониторинг и логирование

### Логирование:
- **Structured logging** с NestJS Logger
- **Различные уровни** логирования (error, warn, info, debug)
- **Контекстная информация** в логах
- **Логирование запросов** - время выполнения, статус

### Мониторинг:
- **Health checks** для проверки состояния сервиса
- **Метрики производительности** (время ответа, количество запросов)
- **Мониторинг базы данных** - состояние подключений
- **Мониторинг файловой системы** - свободное место для загрузок

## 🔄 Интеграция с другими сервисами

### Auth Service:
- **Верификация токенов** для доступа к API
- **Передача информации о пользователе** в заголовках
- **Синхронизация ролей** между сервисами
- **Единая система аутентификации**

### Frontend:
- **CORS настройки** для взаимодействия с фронтендом
- **REST API** для получения данных
- **Загрузка файлов** - изображения и схемы
- **Экспорт данных** - CSV файлы

## 🧪 Тестирование

### Unit тесты:
```bash
npm run test
```

### E2E тесты:
```bash
npm run test:e2e
```

### Покрытие кода:
```bash
npm run test:cov
```

## 📝 Примеры использования

### Создание фракции:
```bash
curl -X POST http://localhost:3001/factions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "House Davion",
    "code": "DAV",
    "primaryColor": "#FF0000",
    "secondaryColor": "#FFFFFF",
    "formationYear": 2317,
    "description": "Federated Suns ruling house",
    "gameIdRef": "game-uuid",
    "isMajor": true
  }'
```

### Загрузка логотипа фракции:
```bash
curl -X POST http://localhost:3001/factions/upload/logo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@logo.png" \
  -F "factionId=1"
```

### Экспорт данных в CSV:
```bash
curl -X POST http://localhost:3001/csv-download \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "entity": "factions",
    "filters": {
      "isActive": true
    },
    "fields": ["name", "code", "formationYear"]
  }'
```

## 🚨 Обработка ошибок

### Типичные ошибки:
- **400 Bad Request** - неверные данные запроса
- **401 Unauthorized** - отсутствие или неверный токен
- **403 Forbidden** - недостаточно прав
- **404 Not Found** - ресурс не найден
- **409 Conflict** - конфликт данных
- **413 Payload Too Large** - файл слишком большой
- **415 Unsupported Media Type** - неподдерживаемый тип файла
- **500 Internal Server Error** - внутренняя ошибка сервера

### Структура ответа с ошибкой:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "name",
      "message": "Name must be a string"
    }
  ]
}
```

## 🔄 Миграции и обновления

### Создание миграции:
```bash
npm run prisma:migrate:dev
```

### Применение миграций:
```bash
npm run prisma:migrate:deploy
```

### Сброс базы данных:
```bash
npm run prisma:migrate:reset
```

### Запуск сидов:
```bash
npm run prisma:seed
```

## 📚 Дополнительные ресурсы

### Документация:
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Multer Documentation](https://github.com/expressjs/multer)

### Полезные команды:
- `npm run start:dev` - запуск в режиме разработки
- `npm run build` - сборка проекта
- `npm run start:prod` - запуск в продакшене
- `npm run prisma:studio` - открытие Prisma Studio
- `npm run prisma:generate` - генерация Prisma клиента
- `npm run db:restart` - перезапуск базы данных с сидами

## 🤝 Вклад в проект

### Стандарты кодирования:
- **ESLint** для проверки кода
- **Prettier** для форматирования
- **TypeScript strict mode** для строгой типизации
- **Conventional Commits** для сообщений коммитов

### Процесс разработки:
1. Создание feature ветки
2. Разработка функциональности
3. Написание тестов
4. Code review
5. Merge в main ветку

## 📁 Управление файлами

### Структура папок загрузок:
- **uploads/factions/** - изображения фракций
- **uploads/games/** - изображения игр
- **uploads/periods/** - изображения периодов
- **uploads/missions/** - схемы миссий

### Типы файлов:
- **Логотипы** - PNG, JPG (40x40px)
- **Баннеры** - PNG, JPG (ширина 300-800px)
- **Иконки** - PNG, JPG (40x40px)
- **Схемы** - PNG, JPG (размеры миссий)

### Обработка файлов:
- **Автоматическое изменение размера** для логотипов
- **Валидация форматов** - проверка расширений
- **Ограничение размера** - максимум 5MB
- **Безопасные имена** - санитизация имен файлов

---

**Backend Service** - мощный и масштабируемый микросервис для управления игровыми данными системы BTApp, обеспечивающий надежную работу с большими объемами данных и интеграцию с другими сервисами.
