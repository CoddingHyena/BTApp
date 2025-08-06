export const API_BASE_URL = 'http://localhost:3000';

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  
  // Убираем начальный слеш из imagePath, если он есть
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullUrl = `${API_BASE_URL}/${cleanPath}`;
  console.log('getImageUrl:', { imagePath, cleanPath, fullUrl });
  return fullUrl;
}; 