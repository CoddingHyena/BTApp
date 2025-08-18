# NavButton_Type1 - Документация и примеры

## Описание
Компонент `NavButton_Type1` - это навигационная кнопка с поддержкой иконок, предназначенная для создания красивых карточек-ссылок.

## Props

```typescript
interface NavButton_Type1Props {
  to: string;                    // URL для навигации
  children: React.ReactNode;     // Текст кнопки
  variant?: string;              // Вариант Bootstrap (primary, success, info, warning, danger)
  size?: 'sm' | 'lg';           // Размер кнопки
  className?: string;            // Дополнительные CSS классы
  icon?: React.ReactNode;        // Иконка (опционально)
  iconSize?: number;             // Размер иконки в пикселях (по умолчанию: 48)
}
```

## Примеры использования

### 1. Простая кнопка без иконки
```tsx
<NavButton_Type1 to="/bt" variant="primary">
  BattleTech
</NavButton_Type1>
```

### 2. Кнопка с SVG иконкой
```tsx
<NavButton_Type1 
  to="/mechs" 
  variant="success"
  icon={<MechIcon size={48} color="white" />}
  iconSize={48}
>
  Список мехов
</NavButton_Type1>
```

### 3. Кнопка с эмодзи иконкой
```tsx
<NavButton_Type1 
  to="/factions" 
  variant="info"
  icon={
    <div style={{
      width: '48px',
      height: '48px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      color: 'white'
    }}>
      ⚔️
    </div>
  }
  iconSize={48}
>
  Фракции
</NavButton_Type1>
```

### 4. Кнопка с изображением
```tsx
<NavButton_Type1 
  to="/missions" 
  variant="warning"
  icon={
    <img 
      src="/path/to/icon.png" 
      alt="Mission Icon"
      style={{ width: '48px', height: '48px' }}
    />
  }
  iconSize={48}
>
  Миссии
</NavButton_Type1>
```

## Создание собственных иконок

### SVG иконка
```tsx
const CustomIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 48, 
  color = 'currentColor' 
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {/* Ваш SVG код */}
    </svg>
  );
};
```

### CSS иконка
```tsx
const CssIcon: React.FC<{ size?: number }> = ({ size = 48 }) => {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${size * 0.5}px`,
      color: 'white'
    }}>
      🎮
    </div>
  );
};
```

## Стилизация

Компонент использует следующие стили по умолчанию:
- Размер: 200x200px
- Flexbox для центрирования
- Отступ между иконкой и текстом: 12px
- Поддержка всех Bootstrap вариантов

## Советы по использованию

1. **Размер иконки**: Рекомендуется использовать `iconSize={48}` для лучшего визуального баланса
2. **Цвет иконки**: Для светлых кнопок используйте `color="white"`, для темных - `color="currentColor"`
3. **Типы иконок**: Поддерживаются SVG, эмодзи, изображения и любые React компоненты
4. **Responsive**: Компонент адаптивен и хорошо работает в сетке Bootstrap 