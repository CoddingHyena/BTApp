import axios from 'axios';
import type { 
  User, 
  Campaign, 
  CampaignPlayer, 
  Faction, 
  Notification, 
  Pilot, 
  PilotGenerationRequest, 
  PilotRegenerationRequest, 
  NameValidationRequest, 
  GenderFromNameRequest,
  AssignStrategistRequest,
  CombatFormation 
} from '@/types';

// Создаем единый экземпляр axios для всех API запросов
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок
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

// API методы для кампаний
export const campaigns = {
  getAll: () => apiClient.get<Campaign[]>('/campaigns'),
  getById: (id: string) => apiClient.get<Campaign>(`/campaigns/${id}`),
  create: (data: Partial<Campaign>) => apiClient.post<Campaign>('/campaigns', data),
  update: (id: string, data: Partial<Campaign>) => apiClient.put<Campaign>(`/campaigns/${id}`, data),
  delete: (id: string) => apiClient.delete(`/campaigns/${id}`),
  
  // Новые методы для управления стратегами
  getStrategists: (id: string) => apiClient.get<CampaignPlayer[]>(`/campaigns/${id}/strategists`),
  assignStrategist: (id: string, data: AssignStrategistRequest) => 
    apiClient.post<CampaignPlayer>(`/campaigns/${id}/strategists`, data),
  removeStrategist: (id: string, factionId: number) => 
    apiClient.delete(`/campaigns/${id}/strategists/${factionId}`),
  getAvailableUsers: (id: string) => apiClient.get<User[]>(`/campaigns/${id}/available-users`),
  getPlayers: (id: string) => apiClient.get<CampaignPlayer[]>(`/campaigns/${id}/players`),
  invitePlayer: (id: string, userId: string) => 
    apiClient.post<{ message: string }>(`/campaigns/${id}/invite`, { userId }),
  getRecentInvitations: (id: string, userId: string) => 
    apiClient.get<any[]>(`/campaigns/${id}/recent-invitations/${userId}`),
  updatePlayerFaction: (campaignId: string, campaignPlayerId: string, factionId: number | null) => 
    apiClient.put<CampaignPlayer>(`/campaigns/${campaignId}/players/${campaignPlayerId}/faction`, { factionId }),
  getCampaignFactions: (campaignId: string) => 
    apiClient.get<Faction[]>(`/campaigns/${campaignId}/factions`),
};

// API методы для фракций
export const factions = {
  getAll: () => apiClient.get<Faction[]>('/factions'),
  getById: (id: number) => apiClient.get<Faction>(`/factions/${id}`),
  getTopLevel: () => apiClient.get<Faction[]>('/factions/top-level'),
  getChildren: (id: number) => apiClient.get<Faction[]>(`/factions/${id}/children`),
};

// API методы для игр
export const games = {
  getAll: () => apiClient.get<any[]>('/games'),
  getById: (id: string) => apiClient.get<any>(`/games/${id}`),
  getActive: () => apiClient.get<any[]>('/games/active'),
};

// API методы для мехов
export const mechs = {
  getAll: () => apiClient.get<any[]>('/mechs'),
  getById: (id: string) => apiClient.get<any>(`/mechs/${id}`),
  getByFaction: (factionId: number) => apiClient.get<any[]>(`/mechs/faction/${factionId}`),
};

// API методы для пользователей
export const users = {
  getAll: () => apiClient.get<User[]>('/users'),
  getById: (id: string) => apiClient.get<User>(`/users/${id}`),
  update: (id: string, data: Partial<User>) => apiClient.put<User>(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
  updateProfile: (id: string, data: { username?: string }) => 
    apiClient.put<User>(`/users/${id}/profile`, data),
};

// API методы для уведомлений
export const notifications = {
  getAll: () => apiClient.get<Notification[]>('/notifications'),
  getUnread: () => apiClient.get<Notification[]>('/notifications/unread'),
  getUnreadCount: () => apiClient.get<{ count: number }>('/notifications/unread-count'),
  markAsRead: (id: string) => apiClient.put<Notification>(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put<{ count: number }>('/notifications/mark-all-read'),
  delete: (id: string) => apiClient.delete(`/notifications/${id}`),
};

// API методы для пилотов
export const pilots = {
  getAll: () => apiClient.get<Pilot[]>('/campaign-pilots'),
  getById: (id: string) => apiClient.get<Pilot>(`/campaign-pilots/${id}`),
  getByCampaign: (campaignId: string) => apiClient.get<Pilot[]>(`/campaign-pilots/campaign/${campaignId}`),
  create: (data: Partial<Pilot>) => apiClient.post<Pilot>('/campaign-pilots', data),
  update: (id: string, data: Partial<Pilot>) => apiClient.put<Pilot>(`/campaign-pilots/${id}`, data),
  delete: (id: string) => apiClient.delete(`/campaign-pilots/${id}`),
  
  // Новые методы для генерации пилотов с учетом пола
  generate: (data: PilotGenerationRequest) => 
    apiClient.post<{ generatedPilotData: any }>('/campaign-pilots/generate', data),
  
  regenerate: (data: PilotRegenerationRequest) => 
    apiClient.post<{ generatedPilotData: any }>('/campaign-pilots/regenerate', data),
  
  validateName: (data: NameValidationRequest) => 
    apiClient.post<{ valid: boolean }>('/campaign-pilots/validate-name', data),
  
  getGenderFromName: (data: GenderFromNameRequest) => 
    apiClient.post<{ gender: string | null }>('/campaign-pilots/get-gender-from-name', data),
};

// API методы для формаций
export const formations = {
  getAll: () => apiClient.get<CombatFormation[]>('/formations'),
  getById: (id: string) => apiClient.get<CombatFormation>(`/formations/${id}`),
  getByCampaign: (campaignId: string) => apiClient.get<CombatFormation[]>(`/formations?campaignId=${campaignId}`),
  create: (data: Partial<CombatFormation>) => apiClient.post<CombatFormation>('/formations', data),
  update: (id: string, data: Partial<CombatFormation>) => apiClient.put<CombatFormation>(`/formations/${id}`, data),
  delete: (id: string) => apiClient.delete(`/formations/${id}`),
};

// API методы для аутентификации
export const auth = {
  login: (credentials: { email: string; password: string }) => 
    apiClient.post<{ access_token: string; user: any }>('/auth/login', credentials),
  
  register: (userData: { username: string; email: string; password: string }) => 
    apiClient.post<{ access_token: string; user: any }>('/auth/register', userData),
  
  logout: () => apiClient.post('/auth/logout'),
  
  getProfile: () => apiClient.get('/auth/profile'),
  
  me: () => apiClient.get('/auth/profile'),
};

// Экспортируем основной объект API
export const api = {
  campaigns,
  factions,
  games,
  mechs,
  notifications,
  pilots,
  formations,
  auth,
  users,
};

export default apiClient;
