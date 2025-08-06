# BTapp Frontend

## Компоненты загрузки изображений

### UniversalImageUpload

Универсальный компонент для загрузки изображений разных типов.

#### Использование:

```tsx
import UniversalImageUpload from './components/UniversalImageUpload';
import { useUploadFactionLogoMutation } from '../store/api/apiSlice';

const MyComponent = () => {
  const [uploadLogo] = useUploadFactionLogoMutation();
  
  const handleLogoUpload = (imageUrl: string) => {
    console.log('Uploaded logo URL:', imageUrl);
  };

  return (
    <UniversalImageUpload
      uploadFunction={uploadLogo}
      uploadType="faction-logo"
      onImageUploaded={handleLogoUpload}
      currentImageUrl="/uploads/factions/logos/logo.png"
      label="Логотип фракции"
    />
  );
};
```

#### Пропсы:

- `uploadFunction` - функция загрузки из API slice
- `uploadType` - тип загрузки ('faction-logo', 'faction-banner', 'period-image', 'period-banner', 'game-icon', 'game-banner', 'mission-deployment')
- `onImageUploaded` - callback при успешной загрузке
- `currentImageUrl` - текущий URL изображения
- `label` - подпись для поля
- `accept` - принимаемые форматы файлов

### ImageDisplay

Компонент для отображения изображений с возможностью загрузки через модальное окно.

#### Использование:

```tsx
import ImageDisplay from './components/ImageDisplay';
import { useUploadFactionLogoMutation } from '../store/api/apiSlice';

const MyComponent = () => {
  const [uploadLogo] = useUploadFactionLogoMutation();
  
  return (
    <ImageDisplay
      imageUrl="/uploads/factions/logos/logo.png"
      alt="Faction Logo"
      showUploadButton={true}
      uploadFunction={uploadLogo}
      uploadLabel="Загрузить логотип"
      onImageUploaded={(url) => console.log('New logo URL:', url)}
    />
  );
};
```

#### Пропсы:

- `imageUrl` - URL изображения
- `alt` - альтернативный текст
- `className` - CSS класс
- `style` - инлайн стили
- `showUploadButton` - показывать ли кнопку загрузки
- `uploadFunction` - функция загрузки
- `uploadLabel` - подпись для кнопки загрузки
- `onImageUploaded` - callback при загрузке

## Интеграция в формы

### Форма фракции

Форма фракции теперь включает компоненты для загрузки логотипа и баннера:

```tsx
// В FactionForm.tsx
<Row>
  <Col md={6}>
    <UniversalImageUpload
      uploadFunction={uploadLogo}
      uploadType="faction-logo"
      onImageUploaded={handleLogoUpload}
      currentImageUrl={formData.logoUrl}
      label="Логотип фракции"
    />
  </Col>
  <Col md={6}>
    <UniversalImageUpload
      uploadFunction={uploadBanner}
      uploadType="faction-banner"
      onImageUploaded={handleBannerUpload}
      currentImageUrl={formData.bannerUrl}
      label="Баннер фракции"
    />
  </Col>
</Row>
```

### Форма игры

Форма игры включает компоненты для загрузки иконки и баннера:

```tsx
// В GameForm.tsx
<Row>
  <Col md={6}>
    <UniversalImageUpload
      uploadFunction={uploadIcon}
      uploadType="game-icon"
      onImageUploaded={handleIconUpload}
      currentImageUrl={formData.iconUrl}
      label="Иконка игры"
    />
  </Col>
  <Col md={6}>
    <UniversalImageUpload
      uploadFunction={uploadBanner}
      uploadType="game-banner"
      onImageUploaded={handleBannerUpload}
      currentImageUrl={formData.bannerUrl}
      label="Баннер игры"
    />
  </Col>
</Row>
```

## Поддерживаемые форматы

- PNG
- JPG/JPEG
- SVG

## Ограничения

- Максимальный размер файла: 5MB
- Требуется аутентификация для загрузки
- Только для пользователей с ролью ADMIN

## API эндпоинты

Все эндпоинты загрузки изображений доступны в `apiSlice.ts`:

- `useUploadFactionLogoMutation`
- `useUploadFactionBannerMutation`
- `useUploadPeriodImageMutation`
- `useUploadPeriodBannerMutation`
- `useUploadGameIconMutation`
- `useUploadGameBannerMutation`
- `useUploadMissionImageMutation`

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
