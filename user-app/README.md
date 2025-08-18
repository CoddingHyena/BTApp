# BTapp User Application

## Описание

BTapp User Application - это клиентское веб-приложение, предназначенное для игроков настольных игр, в частности для игр в стиле BattleTech. Приложение предоставляет интуитивный интерфейс для участия в кампаниях, управления пилотами, формирования армий и взаимодействия с другими игроками.

## 🚀 Основные возможности

- **Управление кампаниями** - создание, участие и управление игровыми кампаниями
- **Система пилотов** - генерация и управление пилотами с учетом культурных особенностей фракций
- **Формирования** - создание и управление военными формированиями
- **Система приглашений** - приглашение игроков в кампании
- **Управление игроками** - администрирование участников кампаний
- **Профиль пользователя** - настройка личного профиля и предпочтений
- **Уведомления** - система уведомлений о событиях в кампаниях
- **Адаптивный дизайн** - поддержка мобильных устройств

## 🛠 Технологический стек

- **Framework**: React 19.x с TypeScript
- **Build Tool**: Vite 7.x
- **State Management**: Redux Toolkit
- **UI Library**: Bootstrap 5.x
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios
- **Styling**: CSS + Bootstrap
- **Development**: ESLint + TypeScript

## 📋 Требования

- Node.js 18+
- npm или yarn
- Работающий backend сервер (порт 3000)

## 🚀 Установка и запуск

### 1. Клонирование и установка зависимостей

```bash
cd user-app
npm install
```

### 2. Настройка окружения

Создайте файл `.env` в корне проекта:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=BTapp User
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

Приложение будет доступно по адресу: `http://127.0.0.1:3003`

## 🏗 Архитектура приложения

### Структура проекта

```
src/
├── components/           # Переиспользуемые компоненты
│   ├── Layout.tsx       # Основной макет приложения
│   ├── Navigation.tsx   # Навигационная панель
│   ├── ProtectedRoute.tsx # Защищенные маршруты
│   ├── Button.tsx       # Кастомные кнопки
│   ├── LoadingSpinner.tsx # Индикатор загрузки
│   ├── PilotGenerator.tsx # Генератор пилотов
│   ├── PilotList.tsx    # Список пилотов
│   ├── FormationModal.tsx # Модальное окно формирований
│   ├── InvitePlayersModal.tsx # Приглашение игроков
│   ├── PlayerManagement.tsx # Управление игроками
│   ├── FactionSelector.tsx # Выбор фракции
│   └── ...
├── pages/               # Страницы приложения
│   ├── LoginPage.tsx    # Страница входа
│   ├── RegisterPage.tsx # Страница регистрации
│   ├── CampaignsPage.tsx # Список кампаний
│   ├── CreateCampaignPage.tsx # Создание кампании
│   ├── CampaignPage.tsx # Детальная страница кампании
│   ├── FormationsPage.tsx # Страница формирований
│   ├── ProfilePage.tsx  # Профиль пользователя
│   └── ...
├── store/               # Redux store
│   ├── index.ts         # Конфигурация store
│   └── slices/          # Redux slices
├── services/            # API сервисы
│   └── api.ts           # Основной API клиент
├── types/               # TypeScript типы
├── hooks/               # Кастомные хуки
├── utils/               # Утилиты
└── styles/              # Стили
```

### Основные компоненты

#### Layout.tsx
- Основной макет приложения
- Обработка защищенных маршрутов
- Вложенная маршрутизация

#### PilotGenerator.tsx
- Генерация пилотов с учетом фракции
- Выбор пола пилота
- Перегенерация пилотов
- Интеграция с культурными настройками

#### CampaignPage.tsx
- Детальная страница кампании
- Табы: Обзор, Армия, Пилоты, Карта, Миссии, Администрирование
- Управление участниками
- Система прав доступа

#### FormationModal.tsx
- Создание и редактирование формирований
- Выбор техники и пилотов
- Валидация формирований

### Страницы приложения

#### Аутентификация
- **LoginPage** - вход в систему
- **RegisterPage** - регистрация нового пользователя

#### Кампании
- **CampaignsPage** - список доступных кампаний
- **CreateCampaignPage** - создание новой кампании
- **CampaignPage** - детальная страница кампании с табами

#### Управление
- **FormationsPage** - управление формированиями
- **ProfilePage** - профиль пользователя и настройки

## 🔐 Система аутентификации

### Защищенные маршруты

```typescript
// Все маршруты защищены, кроме login и register
<Route path="/" element={
  <ProtectedRoute>
    <Layout />
  </ProtectedRoute>
}>
  <Route index element={<Navigate to="/campaigns" replace />} />
  <Route path="campaigns" element={<CampaignsPage />} />
  <Route path="campaigns/new" element={<CreateCampaignPage />} />
  <Route path="campaigns/:id" element={<CampaignPage />} />
  <Route path="profile" element={<ProfilePage />} />
</Route>
```

### Проверка прав доступа

```typescript
// Проверка прав администратора кампании
const canAccessAdmin = () => {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  return user.role === 'STRATEGIST';
};
```

## 📊 Управление состоянием

### Redux Store

```typescript
// Основные slices
- auth: управление аутентификацией
- campaigns: управление кампаниями
- factions: фракции и их иерархия
- pilots: пилоты и их генерация
- games: игровые системы
- users: пользователи
- notifications: уведомления
```

### API Интеграция

```typescript
// Централизованный API клиент
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Автоматическое добавление токена
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🎮 Игровые функции

### Генерация пилотов

#### Особенности генерации
- **Культурная адаптация** - имена и позывные в соответствии с фракцией
- **Гендерная система** - выбор пола пилота
- **Перегенерация** - возможность пересоздать пилота
- **Валидация имен** - проверка корректности сгенерированных имен

#### Пример использования

```typescript
const handleGenerate = async () => {
  const result = await dispatch(generatePilot({ 
    factionId: selectedFactionId, 
    gender: selectedGender 
  })).unwrap();
  
  if (onPilotGenerated) {
    onPilotGenerated(result);
  }
};
```

### Управление кампаниями

#### Типы кампаний
- **SOLO** - одиночные кампании
- **MULTIPLAYER** - многопользовательские кампании
- **TOURNAMENT** - турнирные кампании

#### Функции кампаний
- Создание и настройка
- Приглашение игроков
- Управление стратегами
- Назначение фракций
- Отслеживание прогресса

### Система формирований

#### Создание формирований
- Выбор техники из доступной по фракции
- Назначение пилотов
- Валидация состава
- Сохранение и редактирование

#### Типы формирований
- Боевые группы
- Подразделения
- Специальные отряды

## 🎨 UI/UX Особенности

### Дизайн система

- **Bootstrap 5** - основа дизайна
- **Адаптивная верстка** - поддержка мобильных устройств
- **Карточный интерфейс** - для отображения данных
- **Модальные окна** - для форм и детальной информации
- **Табы** - для организации контента

### Компоненты

#### Button.tsx
- Кастомные кнопки с различными вариантами
- Поддержка состояний загрузки
- Адаптивные размеры

#### LoadingSpinner.tsx
- Индикаторы загрузки
- Различные размеры
- Контекстные сообщения

#### FactionSelector.tsx
- Выбор фракции с визуализацией
- Иерархическая структура
- Фильтрация по играм

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
- Responsive таблицы и карточки

## 🔧 Разработка

### Скрипты

```bash
# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build

# Линтинг
npm run lint

# Предварительный просмотр
npm run preview
```

### Конфигурация Vite

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3003,
    host: '127.0.0.1',
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

## 🌐 Интеграция с API

### Основные эндпоинты

#### Кампании
```typescript
campaigns.getAll()           // Получить все кампании
campaigns.getById(id)        // Получить кампанию по ID
campaigns.create(data)       // Создать кампанию
campaigns.update(id, data)   // Обновить кампанию
campaigns.delete(id)         // Удалить кампанию
```

#### Пилоты
```typescript
pilots.generate(data)        // Генерировать пилота
pilots.regenerate(data)      // Перегенерировать пилота
pilots.validateName(data)    // Валидировать имя
pilots.getGenderFromName(data) // Определить пол по имени
```

#### Фракции
```typescript
factions.getAll()            // Получить все фракции
factions.getTopLevel()       // Получить топ-уровень фракций
factions.getChildren(id)     // Получить дочерние фракции
```

### Обработка ошибок

```typescript
// Автоматический редирект при 401 ошибке
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🧪 Тестирование

### Тестовые файлы

В проекте есть несколько тестовых файлов для проверки функциональности:

- `test-api.js` - тестирование API эндпоинтов
- `test-token.js` - тестирование аутентификации
- `test-factions.js` - тестирование работы с фракциями
- `test-admin-tab.js` - тестирование админ-панели
- `test-invite-modal.js` - тестирование модального окна приглашений

### Запуск тестов

```bash
# Запуск тестовых скриптов
node test-api.js
node test-token.js
node test-factions.js
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
- **Path aliases** - удобные импорты с @

### Статические файлы

- Автоматическая обработка изображений
- Оптимизация шрифтов
- Кэширование статических ресурсов

## 🔍 Отладка

### Инструменты разработчика

- **React DevTools** - отладка компонентов
- **Redux DevTools** - отладка состояния
- **Network tab** - мониторинг API запросов
- **Console** - логирование

### Логирование

```typescript
// Примеры логирования
console.log('Campaign loaded:', campaign);
console.error('API Error:', error);
console.warn('Validation warning:', warning);
```

## 🤝 Вклад в проект

### Стиль кода

- **TypeScript** - строгая типизация
- **ESLint** - проверка качества кода
- **Path aliases** - удобные импорты
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
2. **API недоступен** - убедитесь, что backend запущен на порту 3000
3. **Проблемы с аутентификацией** - проверьте JWT токен
4. **Проблемы с портом** - убедитесь, что порт 3003 свободен

### Получение помощи

1. Проверьте логи в консоли браузера
2. Убедитесь в корректности API запросов
3. Проверьте настройки окружения
4. Запустите тестовые скрипты
5. Создайте issue в репозитории

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
- [Bootstrap Documentation](https://getbootstrap.com/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React Router Documentation](https://reactrouter.com/)

## 🎯 Особенности приложения

### Игровая специфика

- **Культурная адаптация** - генерация пилотов с учетом культуры фракции
- **Иерархия фракций** - поддержка сложной структуры фракций
- **Система ролей** - различные уровни доступа в кампаниях
- **Формирования** - создание военных подразделений
- **Приглашения** - система приглашения игроков

### Пользовательский опыт

- **Интуитивный интерфейс** - простота использования
- **Быстрая навигация** - эффективная маршрутизация
- **Адаптивность** - работа на всех устройствах
- **Обратная связь** - информативные сообщения об ошибках
