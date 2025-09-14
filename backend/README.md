# BTapp Backend API

## Описание

BTapp Backend - это REST API сервер, построенный на NestJS, предназначенный для управления настольными играми, в частности для игр в стиле BattleTech. Приложение предоставляет полный набор функций для управления кампаниями, игроками, техникой, фракциями и другими игровыми элементами.

## 🚀 Основные возможности

- **Аутентификация и авторизация** - JWT-based система с ролевым доступом
- **Управление кампаниями** - создание, редактирование и управление игровыми кампаниями
- **Система пилотов** - генерация пилотов с учетом культурных особенностей фракций
- **Управление техникой** - каталог мехов с доступностью по фракциям и периодам
- **Система фракций** - иерархическая структура фракций с культурными настройками
- **Управление игроками** - система пользователей с различными ролями
- **Система миссий** - каталог миссий с различными типами и сложностью
- **Экономика кампаний** - управление ресурсами и экономикой
- **Система уведомлений** - встроенная система уведомлений
- **API документация** - автоматическая генерация Swagger документации

## 🛠 Технологический стек

- **Framework**: NestJS 11.x
- **Database**: PostgreSQL с Prisma ORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript
- **Package Manager**: npm

## 📋 Требования

- Node.js 18+ 
- PostgreSQL 12+
- npm или yarn

## 🚀 Установка и запуск

### 1. Клонирование и установка зависимостей

```bash
cd backend
npm install
```

### 2. Настройка базы данных

Создайте файл `.env` на основе `.example.env`:

```bash
cp .example.env .env
```

Отредактируйте `.env` файл:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/BTapp?schema=public"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="24h"
```

### 3. Настройка базы данных

```bash
# Генерация Prisma клиента
npm run prisma:generate

# Применение миграций
npm run prisma:migrate

# Заполнение базы начальными данными
npm run prisma:seed
```

### 4. Запуск приложения

```bash
# Режим разработки
npm run start:dev

# Продакшн режим
npm run build
npm run start:prod
```

Приложение будет доступно по адресу: `http://localhost:3000`

## 📚 API Документация

После запуска приложения, Swagger документация доступна по адресу:
`http://localhost:3000/api`

## 🏗 Архитектура приложения

### Структура модулей

```
src/
├── auth/                    # Аутентификация и авторизация
├── modules/
│   ├── campaign/           # Управление кампаниями
│   ├── campaign-player/    # Игроки кампаний
│   ├── campaign-pilot/     # Система пилотов
│   ├── campaign-unit/      # Юниты кампаний
│   ├── campaign-economy/   # Экономика кампаний
│   ├── campaign-progress/  # Прогресс кампаний
│   ├── battle/            # Система сражений
│   ├── battle-report/     # Отчеты о сражениях
│   ├── factions/          # Управление фракциями
│   ├── game/              # Управление играми
│   ├── mech/              # Управление техникой
│   ├── mech-availability/ # Доступность техники
│   ├── mission/           # Система миссий
│   ├── period/            # Временные периоды
│   ├── formation/         # Боевые формирования (CombatFormation)
│   ├── map/               # Карты и локации
│   ├── movement/          # Система передвижения
│   ├── user/              # Управление пользователями
│   ├── notification/      # Система уведомлений
│   └── csv_download/      # Экспорт данных в CSV
├── prisma/                # Конфигурация базы данных
└── utils/                 # Утилиты
```

### Основные сущности

#### Пользователи (Users)
- Роли: ADMIN, MODERATOR, STRATEGIST, PLAYER
- Система аутентификации с JWT
- Управление профилями и правами доступа

#### Кампании (Campaigns)
- Типы: SOLO, MULTIPLAYER, TOURNAMENT
- Управление игроками и стратегами
- Система прогресса и экономики

#### Фракции (Factions)
- Иерархическая структура
- Культурные настройки для генерации пилотов
- Настройки кланов
- Логотипы и баннеры

#### Техника (Mechs)
- Каталог мехов с характеристиками
- Система доступности по фракциям и периодам
- Валидация данных

#### Пилоты (Campaign Pilots)
- Автоматическая генерация с учетом культуры фракции
- Система позывных и имен
- Гендерная система

#### Боевые формирования (CombatFormation)
- Типы: LANCE (4 юнита), COMPANY (12 юнитов), DIVISION (40 юнитов)
- Иерархическая структура: Лэнс → Рота → Дивизия
- Система ролей: LANCE_LEADER, COMPANY_LEADER, DIVISION_COMMANDER, BODYGUARD
- Управление составом и валидация правил формирования

## 🔐 Аутентификация

### Регистрация
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password"
}
```

### Вход
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

### Использование токена
Добавьте заголовок к запросам:
```
Authorization: Bearer <your-jwt-token>
```

## 📊 Основные API эндпоинты

### Кампании
- `GET /campaigns` - список всех кампаний
- `POST /campaigns` - создание кампании
- `GET /campaigns/:id` - получение кампании
- `PATCH /campaigns/:id` - обновление кампании
- `DELETE /campaigns/:id` - удаление кампании

### Фракции
- `GET /factions` - список фракций
- `POST /factions` - создание фракции
- `GET /factions/:id` - получение фракции
- `PATCH /factions/:id` - обновление фракции

### Техника
- `GET /mechs` - список мехов
- `GET /mechs/:id` - получение меха
- `GET /mech-availability` - доступность техники

### Пилоты
- `POST /campaign-pilots/generate` - генерация пилота
- `GET /campaign-pilots` - список пилотов
- `PATCH /campaign-pilots/:id` - обновление пилота

### Боевые формирования
- `GET /formations` - список формирований
- `POST /formations` - создание формирования
- `GET /formations/:id` - получение формирования
- `PATCH /formations/:id` - обновление формирования
- `DELETE /formations/:id` - удаление формирования
- `POST /formations/:id/members` - добавление участника
- `DELETE /formations/:id/members/:memberId` - удаление участника
- `PATCH /formations/:id/members/:memberId/role` - изменение роли участника

## 🗄 База данных

### Основные таблицы
- `users` - пользователи системы
- `campaigns` - игровые кампании
- `factions` - фракции
- `mechs` - техника
- `campaign_pilots` - пилоты кампаний
- `campaign_players` - игроки кампаний
- `missions` - миссии
- `periods` - временные периоды
- `combat_formations` - боевые формирования
- `combat_formation_members` - участники формирований
- `in_battle_combat_formations` - формирования в бою

### Миграции
```bash
# Создание новой миграции
npm run prisma:migrate

# Сброс базы данных
npm run db:reset

# Просмотр базы в Prisma Studio
npm run prisma:studio
```

## 🧪 Тестирование

```bash
# Запуск unit тестов
npm run test

# Запуск e2e тестов
npm run test:e2e

# Покрытие кода тестами
npm run test:cov
```

## 📁 Статические файлы

Приложение поддерживает загрузку и раздачу статических файлов:
- Логотипы фракций
- Баннеры игр
- Изображения периодов
- Файлы миссий

Файлы сохраняются в папке `public/uploads/` и доступны по URL `/uploads/`.

## 🔧 Скрипты разработки

```bash
# Форматирование кода
npm run format

# Проверка линтера
npm run lint

# Сборка проекта
npm run build

# Запуск в режиме отладки
npm run start:debug
```

## 🌐 CORS настройки

Приложение настроено для работы с фронтендом на портах:
- `http://localhost:3001`
- `http://localhost:3002` 
- `http://localhost:3003`
- `http://127.0.0.1:3002`
- `http://127.0.0.1:3003`

## 📝 Логирование

Приложение выводит логи в консоль с информацией о:
- Запуске сервера
- Создании директорий
- Ошибках базы данных
- API запросах

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## 📄 Лицензия

Проект использует лицензию UNLICENSED.

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте логи приложения
2. Убедитесь в корректности настроек базы данных
3. Проверьте переменные окружения
4. Создайте issue в репозитории

## 🔄 Обновления

Для обновления приложения:
```bash
git pull origin main
npm install
npm run prisma:generate
npm run prisma:migrate
npm run build
npm run start:prod
```
