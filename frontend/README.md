# BTapp Frontend

## Описание

BTapp Frontend - это веб-приложение, построенное на React с использованием TypeScript, предназначенное для управления настольными играми, в частности для игр в стиле BattleTech и Trench Crusade. Приложение предоставляет интуитивный пользовательский интерфейс для работы с кампаниями, техникой, фракциями и другими игровыми элементами.

## 🚀 Основные возможности

- **Современный UI/UX** - интерфейс на основе React Bootstrap с адаптивным дизайном
- **Система аутентификации** - регистрация, вход и управление пользователями
- **Ролевая система** - различные уровни доступа (ADMIN, MODERATOR, STRATEGIST, PLAYER)
- **Управление контентом** - CRUD операции для всех игровых сущностей
- **Загрузка файлов** - поддержка загрузки изображений и документов
- **Валидация данных** - проверка и валидация игровых данных
- **Экспорт данных** - выгрузка информации в различных форматах
- **Маршрутизация** - защищенные и публичные маршруты

## 🛠 Технологический стек

- **Framework**: React 19.x с TypeScript
- **Build Tool**: Vite 6.x
- **State Management**: Redux Toolkit + RTK Query
- **UI Library**: React Bootstrap 2.x
- **Routing**: React Router DOM 7.x
- **Forms**: React Hook Form 7.x
- **HTTP Client**: Axios
- **Styling**: Bootstrap 5.x + CSS
- **Development**: ESLint + Prettier

## 📋 Требования

- Node.js 18+
- npm или yarn
- Работающий backend сервер (порт 3000)

## 🚀 Установка и запуск

### 1. Клонирование и установка зависимостей

```bash
cd frontend
npm install
```

### 2. Настройка окружения

Создайте файл `.env` в корне проекта:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=BTapp
```

### 3. Запуск приложения

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview
```

Приложение будет доступно по адресу: `http://localhost:3001`

## 🏗 Архитектура приложения

### Структура проекта

```
src/
├── components/           # Переиспользуемые компоненты
│   ├── Layout.tsx       # Основной макет приложения
│   ├── LoginForm.tsx    # Форма входа
│   ├── RegisterForm.tsx # Форма регистрации
│   ├── ProtectedRoute.tsx # Защищенные маршруты
│   ├── UserNav.tsx      # Навигация пользователя
│   ├── FactionCard.tsx  # Карточка фракции
│   ├── MechIcon.tsx     # Иконка меха
│   ├── FileUpload.tsx   # Загрузка файлов
│   └── ...
├── pages/               # Страницы приложения
│   ├── HomePage.tsx     # Главная страница
│   ├── BT_Page.tsx      # Страница BattleTech
│   ├── TC_Page.tsx      # Страница Trench Crusade
│   ├── MechListPage.tsx # Список мехов
│   ├── FactionListPage.tsx # Список фракций
│   ├── ImportPage.tsx   # Импорт данных
│   ├── UserManagementPage.tsx # Управление пользователями
│   └── ...
├── store/               # Redux store
│   ├── index.ts         # Конфигурация store
│   ├── api/             # RTK Query API
│   └── slices/          # Redux slices
├── types/               # TypeScript типы
├── config/              # Конфигурация
├── hooks/               # Кастомные хуки
└── assets/              # Статические ресурсы
```

### Основные компоненты

#### Layout.tsx
- Основной макет приложения
- Навигационная панель
- Система ролей и прав доступа
- Адаптивный дизайн

#### ProtectedRoute.tsx
- Защита маршрутов по ролям
- Редирект неавторизованных пользователей
- Проверка прав доступа

#### FileUpload.tsx
- Загрузка изображений и документов
- Валидация файлов
- Предварительный просмотр
- Drag & Drop функциональность

### Страницы приложения

#### Главная страница (HomePage)
- Выбор игровой системы (BattleTech/Trench Crusade)
- Навигация по основным разделам
- Информация о проекте

#### Управление контентом
- **MechListPage** - каталог мехов с фильтрацией
- **FactionListPage** - список фракций с детальной информацией
- **PeriodListPage** - временные периоды
- **MissionListPage** - каталог миссий
- **AvailabilityPage** - таблица доступности техники

#### Административные функции
- **ImportPage** - импорт данных из CSV
- **UserManagementPage** - управление пользователями
- **FactionManagementPage** - управление фракциями
- **GameManagementPage** - управление играми
- **RawMechValidationPage** - валидация данных мехов

## 🔐 Система аутентификации

### Роли пользователей

- **ADMIN** - полный доступ ко всем функциям
- **MODERATOR** - управление контентом
- **STRATEGIST** - управление кампаниями
- **PLAYER** - базовый доступ к просмотру

### Защищенные маршруты

```typescript
// Пример защищенного маршрута
<Route path="/admin" element={
  <ProtectedRoute requiredRoles={['ADMIN']}>
    <AdminPage />
  </ProtectedRoute>
} />
```

## 📊 Управление состоянием

### Redux Store

```typescript
// Основные slices
- auth: управление аутентификацией
- users: управление пользователями
- mechs: каталог мехов
- factions: фракции
- periods: временные периоды
- missions: миссии
- availabilities: доступность техники
```

### RTK Query

- Автоматическое кэширование
- Оптимистичные обновления
- Автоматическая синхронизация
- Обработка ошибок

## 🎨 UI/UX Особенности

### Дизайн система

- **Bootstrap 5** - основа дизайна
- **Адаптивная верстка** - поддержка мобильных устройств
- **Темная тема** - навигационная панель
- **Карточный интерфейс** - для отображения данных
- **Модальные окна** - для форм и детальной информации

### Компоненты

#### NavButton_Type1
- Кастомные кнопки навигации
- Поддержка иконок
- Анимации и эффекты

#### FactionCard
- Карточки фракций с логотипами
- Информация о культуре
- Быстрые действия

#### MechIcon
- Визуализация мехов
- Различные размеры
- Поддержка fallback изображений

## 📁 Загрузка файлов

### Поддерживаемые типы

- **Изображения**: PNG, JPG, JPEG, GIF, WebP
- **Документы**: PDF, CSV, TXT
- **Максимальный размер**: 10MB

### Компоненты загрузки

- **UniversalImageUpload** - универсальная загрузка изображений
- **FileUpload** - загрузка любых файлов
- **ImageDisplay** - отображение изображений

## 🔧 Разработка

### Скрипты

```bash
# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build

# Проверка типов TypeScript
npm run typecheck

# Линтинг
npm run lint
npm run lint:fix

# Форматирование кода
npm run format
npm run format:check

# Тестирование
npm run test
npm run test:watch
npm run test:coverage

# Предварительный просмотр
npm run preview
```

### Конфигурация Vite

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

## 🌐 Интеграция с API

### Конфигурация API

```typescript
// config/api.ts
export const API_BASE_URL = 'http://localhost:3000';

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${API_BASE_URL}/${cleanPath}`;
};
```

### RTK Query Endpoints

- Автоматическая генерация хуков
- Кэширование запросов
- Оптимистичные обновления
- Обработка ошибок

## 📱 Адаптивность

### Breakpoints

- **xs**: < 576px (мобильные)
- **sm**: ≥ 576px (планшеты)
- **md**: ≥ 768px (малые десктопы)
- **lg**: ≥ 992px (средние десктопы)
- **xl**: ≥ 1200px (большие десктопы)

### Мобильная оптимизация

- Адаптивная навигация
- Touch-friendly интерфейс
- Оптимизированные формы
- Responsive таблицы

## 🧪 Тестирование

### Виды тестов

- **Unit тесты** - тестирование компонентов
- **Integration тесты** - тестирование взаимодействий
- **E2E тесты** - тестирование пользовательских сценариев

### Покрытие кода

```bash
npm run test:coverage
```

## 📦 Сборка и деплой

### Продакшн сборка

```bash
npm run build
```

### Оптимизации

- **Code splitting** - разделение кода по маршрутам
- **Tree shaking** - удаление неиспользуемого кода
- **Minification** - минификация CSS и JS
- **Image optimization** - оптимизация изображений

### Статические файлы

- Автоматическая обработка изображений
- Поддержка SVG иконок
- Оптимизация шрифтов

## 🔍 Отладка

### Инструменты разработчика

- **React DevTools** - отладка компонентов
- **Redux DevTools** - отладка состояния
- **Network tab** - мониторинг API запросов
- **Console** - логирование

### Логирование

```typescript
// Примеры логирования
console.log('API Response:', data);
console.error('API Error:', error);
```

## 🤝 Вклад в проект

### Стиль кода

- **TypeScript** - строгая типизация
- **ESLint** - проверка качества кода
- **Prettier** - форматирование
- **Conventional Commits** - стандарт коммитов

### Процесс разработки

1. Создание feature ветки
2. Разработка функциональности
3. Написание тестов
4. Code review
5. Merge в main

## 📄 Лицензия

Проект использует лицензию UNLICENSED.

## 🆘 Поддержка

### Частые проблемы

1. **CORS ошибки** - проверьте настройки backend
2. **API недоступен** - убедитесь, что backend запущен
3. **Проблемы с аутентификацией** - проверьте JWT токен

### Получение помощи

1. Проверьте логи в консоли браузера
2. Убедитесь в корректности API запросов
3. Проверьте настройки окружения
4. Создайте issue в репозитории

## 🔄 Обновления

### Обновление зависимостей

```bash
npm update
npm audit fix
```

### Миграции

При обновлении основных зависимостей:
1. Проверьте breaking changes
2. Обновите типы TypeScript
3. Исправьте deprecated API
4. Запустите тесты

## 📚 Дополнительные ресурсы

- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Bootstrap Documentation](https://react-bootstrap.github.io/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
