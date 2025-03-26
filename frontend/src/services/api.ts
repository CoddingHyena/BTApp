// src/services/api.ts
import axios from 'axios';
import { ImportResult } from '../types/mech';

// Базовый URL API (при разработке можно использовать прокси в vite.config.ts)
const API_BASE_URL = 'http://localhost:3000/api';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Сервис для работы с импортом мехов
export const mechImportService = {
  // Импорт мехов из CSV файла
  importMechsFromCsv: async (
    file: File,
    skipDuplicates: boolean = false,
    updateExisting: boolean = false
  ): Promise<ImportResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Добавляем параметры как строку, т.к. FormData не поддерживает boolean напрямую
    formData.append('skipDuplicates', skipDuplicates ? 'true' : 'false');
    formData.append('updateExisting', updateExisting ? 'true' : 'false');

    const response = await api.post<ImportResult>('/import/mechs/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
  
  // Получение списка мехов (этот метод нужно будет реализовать на бэкенде)
  getMechs: async () => {
    const response = await api.get('/mechs');
    return response.data;
  },
};

export default api;