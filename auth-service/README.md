# Auth Service - Микросервис аутентификации

## 📋 Описание

Auth Service - это отдельный микросервис, отвечающий за аутентификацию и авторизацию пользователей в системе BTApp. Сервис предоставляет REST API для регистрации, входа, управления пользователями и работы с JWT токенами.

## 🏗️ Архитектура

### Технологический стек:
- **NestJS** - основной фреймворк
- **TypeScript** - язык программирования
- **Prisma ORM** - работа с базой данных
- **PostgreSQL** - база данных
- **JWT** - JSON Web Tokens для аутентификации
- **bcrypt** - хеширование паролей
- **class-validator** - валидация данных

### Структура проекта:
```
auth-service/
├── auth/                    # Модуль аутентификации
│   ├── auth.controller.ts   # Контроллер аутентификации
│   ├── auth.service.ts      # Сервис аутентификации
│   ├── auth.module.ts       # Модуль аутентификации
│   ├── strategies/          # Стратегии аутентификации
│   │   ├── jwt.strategy.ts  # JWT стратегия
│   │   └── local.strategy.ts # Локальная стратегия
│   ├── guards/              # Гварды
│   │   └── jwt-auth.guard.ts # JWT гвард
│   └── dto/                 # Data Transfer Objects
│       ├── login.dto.ts     # DTO для входа
│       ├── register.dto.ts  # DTO для регистрации
│       ├── update-user-role.dto.ts # DTO для обновления роли
│       └── update-user-status.dto.ts # DTO для обновления статуса
├── users/                   # Модуль пользователей
│   ├── users.controller.ts  # Контроллер пользователей
│   ├── users.service.ts     # Сервис пользователей
│   ├── users.module.ts      # Модуль пользователей
│   └── dto/                 # DTO пользователей
│       ├── create-user.dto.ts # DTO создания пользователя
│       └── update-user.dto.ts # DTO обновления пользователя
├── prisma/                  # Работа с базой данных
│   ├── schema.prisma        # Схема базы данных
│   ├── prisma.service.ts    # Сервис Prisma
│   ├── prisma.module.ts     # Модуль Prisma
│   └── seed.ts              # Сиды для базы данных
├── guards/                  # Глобальные гварды
├── decorators/              # Декораторы
├── dto/                     # Общие DTO
└── types/                   # Типы TypeScript
    └── user.types.ts        # Типы пользователя
```

## 🔐 Функциональность

### Аутентификация:
- **Регистрация** - создание нового пользователя
- **Вход** - аутентификация с получением JWT токена
- **Обновление токена** - получение нового access токена
- **Выход** - инвалидация токенов

### Управление пользователями:
- **CRUD операции** - создание, чтение, обновление, удаление
- **Управление ролями** - назначение ролей (PLAYER, MODERATOR, ADMIN)
- **Управление статусом** - активация/деактивация пользователей
- **Верификация** - подтверждение email адреса

### Безопасность:
- **Хеширование паролей** - bcrypt с солью
- **JWT токены** - access и refresh токены
- **Валидация данных** - проверка входных данных
- **Роли и права** - система ролей для авторизации

## 🗄️ Модель данных

### User (Пользователь):
```typescript
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  username    String   @unique
  password    String   // Хешированный пароль
  role        UserRole @default(PLAYER)
  firstName   String?
  lastName    String?
  avatar      String?  // URL аватара
  isActive    Boolean  @default(true)
  isVerified  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lastLoginAt DateTime?
  refreshTokens RefreshToken[]
}
```

### RefreshToken (Токен обновления):
```typescript
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  isRevoked Boolean  @default(false)
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
}
```

### Роли пользователей:
```typescript
enum UserRole {
  PLAYER     // Обычный игрок
  MODERATOR  // Модератор
  ADMIN      // Администратор
}
```

## 🚀 API Endpoints

### Аутентификация:
- `POST /auth/register` - Регистрация пользователя
- `POST /auth/login` - Вход в систему
- `POST /auth/refresh` - Обновление токена
- `POST /auth/logout` - Выход из системы

### Пользователи:
- `GET /users` - Получение списка пользователей
- `GET /users/:id` - Получение пользователя по ID
- `POST /users` - Создание пользователя
- `PATCH /users/:id` - Обновление пользователя
- `DELETE /users/:id` - Удаление пользователя
- `PATCH /users/:id/role` - Обновление роли пользователя
- `PATCH /users/:id/status` - Обновление статуса пользователя

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
DATABASE_URL="postgresql://username:password@localhost:5432/auth_db"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_REFRESH_EXPIRES_IN="7d"

# Порт сервера
PORT=3002
```

### Настройки JWT:
- **Access Token** - короткий срок жизни (15 минут)
- **Refresh Token** - длительный срок жизни (7 дней)
- **Автоматическое обновление** токенов при истечении

## 🔒 Безопасность

### Хеширование паролей:
- Используется **bcrypt** с солью
- **12 раундов** хеширования для баланса безопасности и производительности
- **Автоматическое хеширование** при создании/обновлении пользователя

### JWT токены:
- **Access Token** - для доступа к защищенным ресурсам
- **Refresh Token** - для получения новых access токенов
- **Автоматическая инвалидация** при выходе
- **Проверка IP и User Agent** для refresh токенов

### Валидация данных:
- **class-validator** для проверки входных данных
- **Автоматическая санитизация** данных
- **Строгая типизация** с TypeScript

## 📊 Мониторинг и логирование

### Логирование:
- **Structured logging** с NestJS Logger
- **Различные уровни** логирования (error, warn, info, debug)
- **Контекстная информация** в логах

### Мониторинг:
- **Health checks** для проверки состояния сервиса
- **Метрики производительности** (время ответа, количество запросов)
- **Обработка ошибок** с детальной информацией

## 🔄 Интеграция с другими сервисами

### BTApp Frontend:
- **CORS настройки** для взаимодействия с фронтендом
- **Единая система аутентификации** для всего приложения
- **Передача токенов** через HTTP заголовки

### BTApp Backend:
- **Верификация токенов** для доступа к API
- **Передача информации о пользователе** в заголовках
- **Синхронизация ролей** между сервисами

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

### Регистрация пользователя:
```bash
curl -X POST http://localhost:3002/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123",
    "firstName": "Иван",
    "lastName": "Иванов"
  }'
```

### Вход в систему:
```bash
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Обновление роли пользователя:
```bash
curl -X PATCH http://localhost:3002/users/123/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "role": "MODERATOR"
  }'
```

## 🚨 Обработка ошибок

### Типичные ошибки:
- **400 Bad Request** - неверные данные запроса
- **401 Unauthorized** - отсутствие или неверный токен
- **403 Forbidden** - недостаточно прав
- **404 Not Found** - пользователь не найден
- **409 Conflict** - пользователь уже существует
- **500 Internal Server Error** - внутренняя ошибка сервера

### Структура ответа с ошибкой:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
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

## 📚 Дополнительные ресурсы

### Документация:
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT.io](https://jwt.io/)

### Полезные команды:
- `npm run start:dev` - запуск в режиме разработки
- `npm run build` - сборка проекта
- `npm run start:prod` - запуск в продакшене
- `npm run prisma:studio` - открытие Prisma Studio
- `npm run prisma:generate` - генерация Prisma клиента

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

---

**Auth Service** - надежный и безопасный микросервис аутентификации для системы BTApp, обеспечивающий современные стандарты безопасности и удобство использования.
