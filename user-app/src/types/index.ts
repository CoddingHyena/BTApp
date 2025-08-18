// Базовые типы для BTApp

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl?: string;
  bannerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Faction {
  id: number;
  name: string;
  code: string;
  gameIdRef?: string;
  game?: Game;
  isMajor: boolean;
  isActive: boolean;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  color?: string; // Добавляем поле color для отображения
  icon?: string; // Добавляем поле icon для отображения
  formationYear?: number;
  dissolutionYear?: number;
  parentFactionId?: number;
  parentFaction?: Faction;
  childFactions?: Faction[];
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  gameId: string;
  game?: Game;
  campaignType: string;
  parentCampaignId?: string;
  parentCampaign?: Campaign;
  status: string;
  startDate?: string;
  endDate?: string;
  accessType: string;
  maxPlayers?: number;
  minPlayers?: number;
  commonRules?: Record<string, any>;
  gameSpecificRules?: Record<string, any>;
  tags?: string[];
  metadata?: Record<string, any>;
  imageUrl?: string;
  geographicScope?: string;
  thematicFocus?: string;
  eventType?: string;
  durationHours?: number;
  maxParticipants?: number;
  autoGenerate?: boolean;
  triggerConditions?: Record<string, any>;
  completionConditions?: Record<string, any>;
  rewards?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignPlayer {
  id: string;
  campaignId: string;
  playerId: string;
  factionId?: number;
  role: 'PLAYER' | 'STRATEGIST' | 'MODERATOR' | 'ADMIN' | 'SPECTATOR';
  joinedAt: string;
  avatarUrl?: string;
  lastActivity: string;
  nickname?: string;
  notes?: string;
  preferences: Record<string, any>;
  totalBattles: number;
  winRate: number;
  status: string;
  player?: User;
  user?: User; // Добавляем поле user для совместимости
  faction?: Faction;
}

export interface AssignStrategistRequest {
  userId: string;
  factionId: number;
}

export interface Pilot {
  id: string;
  campaignId: string;
  factionId: number;
  firstName: string;
  lastName: string;
  callsign: string;
  gender: 'MALE' | 'FEMALE';
  gunnery: number;
  piloting: number;
  alphaStrikeSkill: number;
  experience: number;
  rank: string;
  specialization: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

// Типы для генерации пилотов
export type Gender = 'male' | 'female';

export interface GeneratedPilotData {
  firstName: string;
  lastName: string;
  callsign: string;
  gender: string;
  fullName: string;
}

export interface PilotGenerationRequest {
  factionId: number;
  gender?: Gender;
}

export interface PilotRegenerationRequest {
  factionId: number;
  currentGender?: Gender;
}

export interface NameValidationRequest {
  firstName: string;
  lastName: string;
  gender: Gender;
  factionId: number;
}

export interface GenderFromNameRequest {
  firstName: string;
  factionId: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Notification {
  id: string;
  type: 'CAMPAIGN_INVITE' | 'CAMPAIGN_UPDATE' | 'BATTLE_RESULT' | 'SYSTEM_MESSAGE';
  title: string;
  message: string;
  recipientId: string;
  senderId?: string;
  campaignId?: string;
  isRead: boolean;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    username: string;
  };
  campaign?: {
    id: string;
    name: string;
  };
}

export interface Formation {
  id: string;
  name: string;
  type: 'LANCE' | 'LINEAR_COMPANY' | 'COMMAND_COMPANY' | 'DIVISION';
  campaignId: string;
  factionId: number;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DESTROYED';
  maxUnits: number;
  currentUnits: number;
  createdAt: string;
  updatedAt: string;
  faction?: Faction;
  campaign?: Campaign;
}
